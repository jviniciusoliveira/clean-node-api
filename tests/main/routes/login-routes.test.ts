import request from 'supertest'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('should return 200 on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'José Vinicius',
          email: 'jviniciusoliveira@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'José Vinicius',
        email: 'jviniciusoliveira@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'jviniciusoliveira@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'jviniciusoliveira@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
