import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

const makeAccount = async (): Promise<AccountModel> => {
  const result = await accountColletion.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  return result.ops[0]
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const result = await surveyColletion.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  return result.ops[0]
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

let surveyColletion: Collection
let accountColletion: Collection
let surveyResultColletion: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyColletion = await MongoHelper.getColletion('surveys')
    await surveyColletion.deleteMany({})

    accountColletion = await MongoHelper.getColletion('accounts')
    await accountColletion.deleteMany({})

    surveyResultColletion = await MongoHelper.getColletion('surveyResults')
    await surveyResultColletion.deleteMany({})
  })

  describe('save()', () => {
    test('should add a survey result', async () => {
      const account = await makeAccount()
      const survey = await makeSurvey()

      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: account.id,
        accountId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('should update a survey result if its not new', async () => {
      const account = await makeAccount()
      const survey = await makeSurvey()
      const res = await surveyResultColletion.insertOne({
        surveyId: account.id,
        accountId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const sut = makeSut()
      const surveyResult = await sut.save({
        surveyId: account.id,
        accountId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(res.insertedId)
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
  })
})
