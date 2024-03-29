import request from 'supertest'
import { noCache } from '@/main/middlewares/no-cache'
import app from '@/main/config/app'

describe('NoCache Middleware', () => {
  test('should disable cache', async () => {
    app.get('/test-no-cache', noCache, (request, response) => {
      response.send()
    })

    await request(app)
      .get('/test-no-cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
