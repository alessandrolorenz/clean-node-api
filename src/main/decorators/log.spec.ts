import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: 'Alessandro'
          }
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
