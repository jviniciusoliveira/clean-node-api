import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'
import { Collection } from 'mongodb'

describe('Log Mongo Repository', () => {
  let errorColletion: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorColletion = await MongoHelper.getColletion('errors')
    await errorColletion.deleteMany({})
  })

  test('should create an error log o success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await errorColletion.countDocuments()
    expect(count).toBe(1)
  })
})
