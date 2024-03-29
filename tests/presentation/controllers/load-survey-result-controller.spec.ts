import MockDate from 'mockdate'
import { LoadSurveyResultController } from '@/presentation/controllers/load-survey-result-controller'
import { mockSurveyModel, mockSurveyResultModel, throwError } from '@/tests/mocks/domain'
import { LoadSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

const makeFakeRequest = (): LoadSurveyResultController.Request => ({
  surveyId: 'any_id',
  accountId: 'any_account_id'
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<LoadSurveyById.Result> {
      return Promise.resolve(mockSurveyModel())
    }
  }

  return new LoadSurveyByIdStub()
}

const makeLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<LoadSurveyResult.Result> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }

  return new LoadSurveyResultStub()
}

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const loadSurveyResultStub = makeLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)

  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId)
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.surveyId, request.accountId)
  })

  test('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
