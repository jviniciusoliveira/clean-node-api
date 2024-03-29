import request from 'supertest'
import app from '@/main/config/app'

describe('Content Type Middleware', () => {
  test('should return default content type as json', async () => {
    app.get('/test-content-type', (request, response) => {
      response.send('')
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  test('should return xml content type when forced', async () => {
    app.get('/test-content-type-xml', (request, response) => {
      response.type('xml')
      response.send('')
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})
