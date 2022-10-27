import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

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
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorColletion.countDocuments()
    expect(count).toBe(1)
  })
})
