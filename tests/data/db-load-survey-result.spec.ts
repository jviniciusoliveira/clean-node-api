import MockDate from 'mockdate'
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from '@/data/protocols'
import { DbLoadSurveyResult } from '@/data/usecases'
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/tests/mocks/data'
import { mockSurveyResultModel, throwError } from '@/tests/mocks/domain'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_surveyId', 'any_account')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_surveyId', 'any_account')
  })

  test('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load('any_surveyId', 'any_account')
    await expect(promise).rejects.toThrow()
  })

  test('should call LoadSurveyResultRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    await sut.load('any_surveyId', 'any_account')
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('should return surveyResultModel with all answers with count 0', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)
    const surveyReult = await sut.load('any_surveyId', 'any_account')
    expect(surveyReult).toEqual(mockSurveyResultModel())
  })

  test('should return surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyReult = await sut.load('any_surveyId', 'any_account')
    expect(surveyReult).toEqual(mockSurveyResultModel())
  })
})
