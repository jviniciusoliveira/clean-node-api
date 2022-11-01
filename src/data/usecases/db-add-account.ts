import { AddAccount } from '@/domain/usecases'
import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    if (!account) {
      const hashedPassowrd = await this.hasher.hash(accountData.password)
      const newAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassowrd })
      return newAccount
    }

    return null
  }
}
