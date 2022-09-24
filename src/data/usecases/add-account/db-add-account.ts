import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hahser: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassowrd = await this.hahser.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassowrd })

    return account
  }
}
