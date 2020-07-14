import { SignUpController } from '../../presentation/controllers/singup/singup'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account' // add-account é interface mas importamos a implementação
import { BcryptAdapter } from '../../infra/cripttography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignupValidation } from './signup-validation'

export const makeSignupController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignupValidation())
  const logMongoRepositoty = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepositoty)
}
