import { sample } from 'lodash'
import lessons from './config/help.yml'

// const { fs } = $provider

const RANDOM_INTERVAL = process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 15 * 1000

export const Help = {
  lessons,

  randomLesson: null,

  async load() {
    this.pickRandom()
    setInterval(this.pickRandom.bind(this), RANDOM_INTERVAL)
  },

  pickRandom() {
    this.randomLesson = sample(this.lessons)
  },
}
