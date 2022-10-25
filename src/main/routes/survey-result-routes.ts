import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadSurveyResultController } from '../factories/controllers/save-survey-result/load-survey-result-controller-factory'
import { makeSaveSurveyResultController } from '../factories/controllers/save-survey-result/save-survey-result-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const saveSurveyResultController = adaptRoute(makeSaveSurveyResultController())
  const loadSurveyResultController = adaptRoute(makeLoadSurveyResultController())

  const auth = adaptMiddleware(makeAuthMiddleware())

  router.put('/surveys/:surveyId/results', auth, saveSurveyResultController)
  router.get('/surveys/:surveyId/results', auth, loadSurveyResultController)
}
