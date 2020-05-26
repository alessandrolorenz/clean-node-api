import express from 'express'
import setupMiddlewares from './middlewares'
import setupRutes from './routes'

const app = express()
setupMiddlewares(app)
setupRutes(app)
export default app
