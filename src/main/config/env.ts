import dotEnv from 'dotenv'

dotEnv.config()

export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
  port: process.env.PORT || 3002
}
