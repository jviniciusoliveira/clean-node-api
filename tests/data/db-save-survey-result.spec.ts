import MockDate from 'mockdate'
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockSaveSurveyResultRepository, mockLoadSurveyResultRepository } from '@/tests/mocks/data'
import { mockSaveSurveyResultParams, mockSurveyResultModel, throwError } from '@/tests/mocks/domain'

type SutTypes = {
  sut: SaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('sould call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(addSpy).toBeCalledWith(surveyData)
  })

  test('sould call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(loadBySurveyIdSpy).toBeCalledWith(surveyData.surveyId)
  })

  test('should return an survey result on success', async () => {
    const { sut } = makeSut()
    const surveyReult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyReult).toEqual(mockSurveyResultModel())
  })

  test('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
})
