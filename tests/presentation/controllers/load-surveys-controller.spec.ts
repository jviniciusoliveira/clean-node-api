import MockDate from 'mockdate'
import { LoadSurveysController } from '@/presentation/controllers/load-surveys-controller'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockSurveyModels, throwError } from '@/tests/mocks/domain'
import { LoadSurveys } from '@/domain/usecases'

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<LoadSurveys.Result> {
      return Promise.resolve(mockSurveyModels())
    }
  }

  return new LoadSurveysStub()
}

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({ accountId: 'any_account' })
    expect(loadSpy).toHaveBeenCalledWith('any_account')
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ accountId: 'any_account' })
    expect(httpResponse).toEqual(ok(mockSurveyModels()))
  })

  test('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest
      .spyOn(loadSurveysStub, 'load')
      .mockResolvedValueOnce([])
    const httpResponse = await sut.handle({ accountId: 'any_account' })
    expect(httpResponse).toEqual(noContent())
  })

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest
      .spyOn(loadSurveysStub, 'load')
      .mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({ accountId: 'any_account' })
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
