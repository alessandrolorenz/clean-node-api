import { Router } from 'express'
import { makeSignupController } from '../factories/signup'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => { // necessário adaptar a interface no controller ao que o express espera(req e res dele)
  // makeSignupController().handle nao funciona assim (precisa do adapter)
  router.post('/signup', adaptRoute(makeSignupController()))
}
