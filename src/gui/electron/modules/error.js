class AppError extends Error {
  /**
   *
   * @param {*} message
   */
  constructor(message, error) {
    if ($rollbar.isEnabled) {
      const response = $rollbar.error(error || new Error(message))

      if (response.uuid) {
        message += `
          \nFor help, please report the following to one of our developers in the Discord server:\n
          https://rollbar.com/occurrence/uuid/?uuid=${response.uuid}`
      } else {
        message += `
          \n[Problem reporting the error to Rollbar!] For help, take a screenshot and report the following to one of our developers in the Discord server:\n
          ${error}`
      }
    } else if (error) {
      message += `
          \nFor help, take a screenshot and report the following to one of our developers in the Discord server:\n
          ${error}`
    }

    super(message)
  }
}

module.exports = AppError
