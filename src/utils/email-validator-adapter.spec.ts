import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const stu = new EmailValidatorAdapter()
    const isValid = stu.isValid('invalid@gmail.com')
    expect(isValid).toBe(false)
  })
})
