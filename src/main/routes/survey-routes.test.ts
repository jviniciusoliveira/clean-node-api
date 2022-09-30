import request from 'supertest'
import env from '../config/env'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import jwt from 'jsonwebtoken'

let surveyColletion: Collection
let accountColletion: Collection

describe('Login Routes', () => {
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

  describe('POST /surveys', () => {
    test('should return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://images.com/image-name'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403)
    })

    test('should return 204 on add survey with valid access token', async () => {
      const res = await accountColletion.insertOne({
        name: 'José Vinicius',
        email: 'jviniciusoliveira@gmail.com',
        password: '123',
        role: 'admin'
      })
      const id = res.ops[0]._id
      const accessToken = jwt.sign({ id }, env.jwtSecret)

      await accountColletion.updateOne({
        _id: id
      }, {
        $set: {
          accessToken
        }
      })

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://images.com/image-name'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(204)
    })
  })
})
