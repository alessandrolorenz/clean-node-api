
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => { // chamas dentro pra garantir que não vai chamar nada que precise do mongo antes de conectar nele
    const app = (await import('./config/app')).default
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  }).catch(console.error)
