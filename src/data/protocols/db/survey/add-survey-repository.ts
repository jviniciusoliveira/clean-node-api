import { AddSurvey } from '@/domain/usecases'

export interface AddSurveyRepository {
  add: (surveyData: AddSurvey.Params) => Promise<void>
}
