import { SingUpController } from './singup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SingUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const sut = new SingUpController()
    const httpRequest = {
      body: {
        email: 'any@gmail.com',
        password: 'any_passord',
        passworddConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const sut = new SingUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_passord',
        passworddConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const sut = new SingUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any@gmail.com',
        passworddConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
})
