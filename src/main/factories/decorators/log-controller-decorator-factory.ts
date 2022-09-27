import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'

export const makeLogControllerDecorator = (constroller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(constroller, logMongoRepository)
}
