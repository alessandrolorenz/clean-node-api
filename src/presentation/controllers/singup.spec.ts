import { SingUpController } from './singup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
import { AccountModel } from '../../domaind/models/accout'
import { AddAccount, AddAccountModel } from '../../domaind/usecases/add-account'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: String): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const MakeAddAccount = (): AddAccount => { // AddAccount não fica com protocolos pq é regra/uses case (criar layer Domain)
  class AddAccountStub implements AddAccount {
    add (email: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes { // sut = system under test
  sut: SingUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => { // mocka(stub) pra ter só o retorno
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = MakeAddAccount()
  const sut = new SingUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SingUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@gmail.com',
        password: 'any_passord',
        passwordConfirmation: 'any_passord'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_passord',
        passwordConfirmation: 'any_passord'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        passwordConfirmation: 'any_passord'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        password: 'any_passord'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        password: 'any_passord',
        passwordConfirmation: 'invalid_passord'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should return 400 if invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'Invalid_any@gmail.com',
        password: 'any_passord',
        passwordConfirmation: 'any_passord'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValid = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        password: 'any_passord',
        passwordConfirmation: 'any_passord'

      }
    }
    sut.handle(httpRequest)
    expect(isValid).toBeCalledWith('any@gmail.com')
  })

  test('should return 500 if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        password: 'any_passord',
        passwordConfirmation: 'any_passord'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        password: 'any_passord',
        passwordConfirmation: 'any_passord'

      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any@gmail.com',
      password: 'any_passord'
    })
  })
})
