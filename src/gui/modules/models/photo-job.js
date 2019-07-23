import randomstring from 'randomstring'
import File from '../file'

export default class PhotoJob {
  constructor(id, photo) {
    this.id = id
    this.photo = photo

    // Output file, this is the photo already transformed!
    this.file = File.fromPath(this.getFolderPath(this.getOutputFileName()))
  }

  /**
   *
   */
  getOutputFileName() {
    const rand = randomstring.generate({
      length: 3,
      charset: 'numeric'
    })

    return `${this.photo.getSourceFile().getName()}-${
      this.id
    }-${rand}-dreamtime.png`
  }

  /**
   *
   */
  getFile() {
    return this.file
  }

  transform() {
    return new Promise((resolve, reject) => {
      const onSpawnError = error => {
        reject(
          new Error(
            `We were unable to start the CLI for the transformation!\n
        This can be caused by a corrupt installation, please make sure that the cli executable exists and works correctly\n
        The script has reported the following error, take a screenshot to get more information:\n
        ${error}`
          )
        )

        $sentry.captureException(error)
      }

      const durationInterval = setInterval(durationFunc, 1000)
      durationFunc()

      let child

      try {
        child = window.deepTools.transform(this, settings)
      } catch (error) {
        clearInterval(durationInterval)
        onSpawnError(error)
        return
      }

      child.on('error', error => {
        onSpawnError(error)
      })

      child.on('stdout', output => {
        this.cliLines.push(
          ...output
            .toString()
            .trim()
            .split('\n')
        )
      })

      child.on('stderr', output => {
        this.cliLines.push(output)
        this.cliError += `${output}\n`
      })

      child.on('ready', code => {
        clearInterval(durationInterval)

        if (code === 0) {
          this.outputFile.update()
          resolve()
        } else {
          reject(
            new Error(
              `The transformation has been interrupted by an CLI error.\n
              This can be caused by:\n
              - A corrupt installation (commonly: The checkpoints folder was not found in cli/)\n
              - Incompatible system\n
              - If you are using GPU: The NVIDIA graphics card could not be found\n
              - If you are using CPU: Insufficient RAM. Buy more RAM!\n
              The CLI has reported the following error, take a screenshot to get more information:\n
              ${this.cliError}`
            )
          )

          this.cliLines = []
          this.cliError = ''
        }
      })
    })
  }
}
