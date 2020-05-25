import { AddAccount, AddAccountModel, AccountModel, Encrypter } from './add-account-protocols'
import { AddAccountRepository } from '../../protocols/add-account-repository'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  // erros são tratados no controller com o try catch (deve ser feito um teste garantindo que não sera tratado aqui)
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassowrd = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassowrd }))
    // Obj.assign = cria um novo obj ({} garante que não vai alterar o obj passado, o obj, e o valor a substituir)
    return new Promise(resolve => resolve(null))
  }
}
