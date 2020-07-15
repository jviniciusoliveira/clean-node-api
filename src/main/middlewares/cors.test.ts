import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('should enable CORS', async () => {
    app.post('/test-cors', (request, response) => {
      response.send()
    })

    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
