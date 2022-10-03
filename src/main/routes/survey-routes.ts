import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/load-surveys/load-surveys-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const addSurveyController = adaptRoute(makeAddSurveyController())
  const loadSurveysController = adaptRoute(makeLoadSurveysController())

  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())

  router.post('/surveys', adminAuth, addSurveyController)
  router.get('/surveys', auth, loadSurveysController)
}
