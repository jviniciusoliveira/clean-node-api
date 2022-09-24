import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly hahser: Hasher
  private readonly addAccountRepository: AddAccountRepository

  constructor (hahser: Hasher, addAccountRepository: AddAccountRepository) {
    this.hahser = hahser
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassowrd = await this.hahser.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassowrd })

    return account
  }
}
