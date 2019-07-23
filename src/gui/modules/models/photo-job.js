import randomstring from 'randomstring'
import File from '../file'

export default class PhotoJob {
  constructor(photo) {
    this.photo = photo

    // Output file, this is the photo already transformed!
    this.file = File.fromPath(this.getFolderPath(this.getOutputFileName()))
  }

  /**
   *
   */
  getOutputFileName() {
    const rand = randomstring.generate({
      length: 5,
      charset: 'numeric'
    })

    return `${this.photo.getSourceFile().getName()}-${rand}-dreamtime.png`
  }

  /**
   *
   */
  getFile() {
    return this.file
  }
}
