import { SaveSurveyResult } from '@/domain/usecases'

export interface SaveSurveyResultRepository {
  save: (surveyResultData: SaveSurveyResult.Params) => Promise<void>
}
