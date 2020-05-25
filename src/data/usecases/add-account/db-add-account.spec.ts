import { DbAddAccount } from './db-add-account'
import { Encrypter } from './add-account-protocols'

interface SutTypes {
  sut: DbAddAccount
  encrypertStub: Encrypter
}

const makeEmcrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashedPassorwd'))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypertStub = makeEmcrypter()
  const sut = new DbAddAccount(encrypertStub)
  return {
    sut,
    encrypertStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct passowr', async () => {
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

  test('Should throws if Encrypter with throws', async () => {
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
})
