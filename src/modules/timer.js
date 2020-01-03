import dayjs from 'dayjs'
import { Consola } from './consola'

const consola = Consola.create('timer')

export class Timer {
  constructor() {
    this.startTime = undefined
    this.duration = 0
    this.interval = undefined
  }

  start() {
    this.startTime = dayjs()
    this.duration = 0
    this.interval = setInterval(this.handle.bind(this), 1000)
  }

  handle() {
    this.duration = dayjs().diff(this.startTime, 'second')

    if (this.duration > 3600) {
      // this does not seem normal.
      consola.warn('Timer out of control.').report()
      this.stop()
    }
  }

  stop() {
    clearInterval(this.interval)
  }
}
