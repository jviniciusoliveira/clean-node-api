import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountColletion: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountColletion = await MongoHelper.getColletion('accounts')
    await accountColletion.deleteMany({})
  })

  describe('add', () => {
    test('should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail', () => {
    test('should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountColletion.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken', () => {
    test('should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const result = await accountColletion.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const enteredAccount = result.ops[0]
      expect(enteredAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(enteredAccount._id, 'any_token')
      const account = await accountColletion.findOne({ _id: enteredAccount._id })
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken', () => {
    test('should return an account on loadByToken success without role', async () => {
      const sut = makeSut()
      await accountColletion.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('should return an account on loadByToken success with role', async () => {
      const sut = makeSut()
      await accountColletion.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      })
      const account = await sut.loadByToken('any_token', 'any_role')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })
})
