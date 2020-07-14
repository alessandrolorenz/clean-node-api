import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'

const makeSut = (): RequiredFieldValidation => new RequiredFieldValidation('field')

describe('RequiredField Validator', () => {
  test('Should returtn a MIssingParamError if validator fails', () => {
    const sut = makeSut()
    const error = sut.validate({ email: 'email@email.com' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
