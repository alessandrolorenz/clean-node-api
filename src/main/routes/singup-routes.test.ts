import request from 'supertest'
import app from '../config/app'

describe('Singup routes', () => {
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Alessandro',
        email: 'alessandro.lorenz@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
