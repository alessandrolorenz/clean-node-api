import { AddAccountModel, AccountModel, AddAccountRepository, Encrypter } from './add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeEmcrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryrStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryrStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: DbAddAccount
  encrypertStub: Encrypter
  addAccountRepositoryrStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypertStub = makeEmcrypter()
  const addAccountRepositoryrStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypertStub, addAccountRepositoryrStub)
  return {
    sut,
    encrypertStub,
    addAccountRepositoryrStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct passowrd', async () => {
    const { sut, encrypertStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypertStub, 'encrypt')
    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throws if Encrypter throws', async () => {
    const { sut, encrypertStub } = makeSut()
    jest.spyOn(encrypertStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    // não da pra retornar diretamente pr esta retornando uma excessão
    const promise = sut.add(makeFakeAccountData()) // sem await
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountReposytory with corretc values', async () => {
    const { sut, addAccountRepositoryrStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryrStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'hashed_password'
    })
  })

  test('Should throws if DbAddAccount throws', async () => {
    const { sut, addAccountRepositoryrStub } = makeSut()
    jest.spyOn(addAccountRepositoryrStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    // não da pra retornar diretamente pr esta retornando uma excessão
    const promise = sut.add(makeFakeAccountData()) // sem await
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if sucess', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
