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
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'hashed_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryrStub()
}

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
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throws if Encrypter throws', async () => {
    const { sut, encrypertStub } = makeSut()
    jest.spyOn(encrypertStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    // não da pra retornar diretamente pr esta retornando uma excessão
    const promise = sut.add(accountData) // sem await
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountReposytory with corretc values', async () => {
    const { sut, addAccountRepositoryrStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryrStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'hashed_password'
    })
  })

  test('Should throws if DbAddAccount throws', async () => {
    const { sut, addAccountRepositoryrStub } = makeSut()
    jest.spyOn(addAccountRepositoryrStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    // não da pra retornar diretamente pr esta retornando uma excessão
    const promise = sut.add(accountData) // sem await
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if sucess', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'hashed_password'
    })
  })
})
