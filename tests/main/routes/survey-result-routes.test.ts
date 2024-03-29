import request from 'supertest'
import jwt from 'jsonwebtoken'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'José Vinicius',
    email: 'jviniciusoliveira@gmail.com',
    password: '123',
    role: 'admin'
  })
  const id = res.insertedId.toHexString()
  const accessToken = jwt.sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({
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
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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

    test('should return 200 on save survey result with valid accessToken', async () => {
      const accessToken = await makeAccessToken()

      const res = await surveyCollection.insertOne({
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

  describe('GET /surveys/:surveyId/results', () => {
    test('should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })
  })

  test('should return 200 on load survey result with valid accessToken', async () => {
    const accessToken = await makeAccessToken()

    const res = await surveyCollection.insertOne({
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
      .get(`/api/surveys/${String(res.insertedId)}/results`)
      .set('x-access-token', accessToken)
      .expect(200)
  })
})
