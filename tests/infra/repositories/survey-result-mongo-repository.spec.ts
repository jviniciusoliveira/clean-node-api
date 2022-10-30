import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

const makeAccount = async (): Promise<AccountModel> => {
  const result = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  return MongoHelper.map(result.ops[0])
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const result = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer_1'
    }, {
      answer: 'any_answer_2'
    }, {
      answer: 'any_answer_3'
    }],
    date: new Date()
  })

  return MongoHelper.map(result.ops[0])
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  describe('save()', () => {
    test('should add a survey result', async () => {
      const account = await makeAccount()
      const survey = await makeSurvey()

      const sut = makeSut()
      await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        accountId: account.id,
        surveyId: survey.id
      })

      expect(surveyResult).toBeTruthy()
    })

    test('should update a survey result if its not new', async () => {
      const account = await makeAccount()
      const survey = await makeSurvey()
      await surveyResultCollection.insertOne({
        accountId: new ObjectId(account.id),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const sut = makeSut()
      await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection.find({
        accountId: account.id,
        surveyId: survey.id
      })
        .toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })
  describe('loadBySurveyId()', () => {
    test('should load survey result', async () => {
      const account = await makeAccount()
      const account2 = await makeAccount()

      const survey = await makeSurvey()
      await surveyResultCollection.insertMany([
        {
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date()
        }, {
          accountId: new ObjectId(account2.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date()
        }
      ])

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result 3', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const account2 = await makeAccount()
      const account3 = await makeAccount()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account2.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account3.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers.length).toBe(survey.answers.length)
    })
  })
})
