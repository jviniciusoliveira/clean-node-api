import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('should parse body as json', async () => {
    app.post('/test-body-parser', (request, response) => {
      response.send(request.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'José Vinicius' })
      .expect({ name: 'José Vinicius' })
  })
})
