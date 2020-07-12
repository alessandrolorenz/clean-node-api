import { LoginController } from '../../../presentation/controllers/login/login'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { EmailValidator, HttpRequest, Authentication } from './login-protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAuthentication = (): Authentication => {
  class Authenticationtub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new Authenticationtub()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any@mail.com',
    password: 'any_password'
  }
})

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any@mail.com')
  })
  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('should return 500 if an invalid email throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const HttpResponse = await sut.handle(makeHttpRequest())
    expect(HttpResponse).toEqual(serverError(new Error()))
  })
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeHttpRequest())
    expect(authSpy).toHaveBeenCalledWith('any@mail.com', 'any_password')
  })
  test('should return 401 if an invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValue(
      new Promise(resolve => resolve(null))
    )
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
})
