import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { EmailValidator } from '../singup/singup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError(email ? 'password' : 'email'))))
    }
    this.emailValidator.isValid(email)
  }
}
