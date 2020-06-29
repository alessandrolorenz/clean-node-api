import { Router } from 'express'
import { makeSignupController } from '../factories/signup'
import { adaptRoute } from '../adapters/express-route-adapter'

// necessário adaptar a interface no controller ao que o express espera(req e res dele)
export default (router: Router): void => {
  // makeSignupController().handle nao funciona assim (precisa do adapter)
  router.post('/signup', adaptRoute(makeSignupController()))
}
