import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { mockSurveyResultModel } from '@/tests/mocks/domain/survey-result'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyResultData: SaveSurveyResult.Params): Promise<void> {
      return Promise.resolve()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRespositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultRespositoryStub()
}
