import { AppError } from './scripts'
import * as services from './scripts/services'
import * as tools from './scripts/tools'

// main process provider
window.$provider = {
  AppError,
  services,
  tools,
}
