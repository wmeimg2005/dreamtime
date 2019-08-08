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
          \nFor help, please report the following to one of our developers:\n
          https://rollbar.com/occurrence/uuid/?uuid=${response.uuid}`
      } else {
        message += `
          \nFor help, take a screenshot and report the following to one of our developers:\n
          ${error}`
      }
    } else if (error) {
      message += `
          \nFor help, take a screenshot and report the following to one of our developers:\n
          ${error}`
    }

    super(message)
  }
}

module.exports = AppError
