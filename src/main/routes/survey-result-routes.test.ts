import request from 'supertest'
import env from '../config/env'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import jwt from 'jsonwebtoken'

let surveyColletion: Collection
let accountColletion: Collection

const makeAccessToken = async (): Promise<string> => {
  const res = await accountColletion.insertOne({
    name: 'José Vinicius',
    email: 'jviniciusoliveira@gmail.com',
    password: '123',
    role: 'admin'
  })
  const id = res.insertedId.toHexString()
  const accessToken = jwt.sign({ id }, env.jwtSecret)

  await accountColletion.updateOne({
    _id: res.insertedId
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyColletion = await MongoHelper.getColletion('surveys')
    await surveyColletion.deleteMany({})

    accountColletion = await MongoHelper.getColletion('accounts')
    await accountColletion.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 200 on save survey result with valid accessToken', async () => {
      const accessToken = await makeAccessToken()

      const res = await surveyColletion.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://images.com/image-name'
          },
          {
            answer: 'Answer 2'
          }
        ],
        date: new Date()
      })

      await request(app)
        .put(`/api/surveys/${String(res.insertedId)}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })
})
