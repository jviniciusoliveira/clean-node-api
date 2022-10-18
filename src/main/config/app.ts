import express from 'express'
import setupMiddleware from './middlewares'
import setupRoute from './routes'
import setupSwagger from './swagger'

const app = express()
setupSwagger(app)
setupMiddleware(app)
setupRoute(app)

export default app
