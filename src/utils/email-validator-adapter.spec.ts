import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const stu = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = stu.isValid('invalid@gmail.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if validator returns true', () => {
    const stu = new EmailValidatorAdapter()
    const isValid = stu.isValid('valid@gmail.com')
    expect(isValid).toBe(true)
  })
  test('Should call validator w/ correct email"', () => {
    const stu = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    stu.isValid('valid@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid@gmail.com')
  })
})
