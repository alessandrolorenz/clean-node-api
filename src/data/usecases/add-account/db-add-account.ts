import { AddAccount, AddAccountModel, AccountModel, Encrypter } from './add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  // erros são tratados no controller com o try catch (deve ser feito um teste garantindo que não sera tratado aqui)
  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
