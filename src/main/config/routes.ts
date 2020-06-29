import { Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/main/routes/**routes.ts').map(async file => (await import(`../../../${file}`)).default(router))
} // como retorna uma função é só executar e passar o router

// fg traz o caminho de cada arquivo na pasta... dai usa um map pra percorrer cada e importar
// fg.sync('**/src/main/routes/**routes.ts').map(async file => {
// o import dentro deve ser feito dessa forma envolta em parenteses e não pode nomear, então ().default
//   const route = (await import(`../../../${file}`)).default
//   route(router)
// })

// .default  = permite dar o nome ao import (como: import nome from ...)
