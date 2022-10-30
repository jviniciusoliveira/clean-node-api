import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from '@/data/protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    let surveyReult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)
    if (!surveyReult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyReult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => ({
          ...answer,
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }))
      }
    }
    return surveyReult
  }
}
