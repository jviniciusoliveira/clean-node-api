import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyColletion: Collection

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
  })

  test('should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'any_answer'
        }
      ],
      date: new Date()
    })
    const survey = await surveyColletion.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
