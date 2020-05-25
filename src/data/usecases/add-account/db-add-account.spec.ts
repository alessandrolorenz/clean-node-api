import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypertStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashedPassorwd'))
    }
  }
  const encrypertStub = new EncrypterStub()
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
})
