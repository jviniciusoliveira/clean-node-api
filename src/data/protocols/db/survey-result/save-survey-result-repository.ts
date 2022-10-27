import { SaveSurveyResultParams } from '@/domain/usecases'

export interface SaveSurveyResultRepository {
  save: (surveyResultData: SaveSurveyResultParams) => Promise<void>
}
