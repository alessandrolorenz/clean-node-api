import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError(email ? 'password' : 'email'))))
    }
  }
}
