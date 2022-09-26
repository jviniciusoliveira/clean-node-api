import dotEnv from 'dotenv'

dotEnv.config()

export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
  port: process.env.PORT || 3002,
  jwtSecret: process.env.JWT_SECRET || 'trs8dsTW'
}
