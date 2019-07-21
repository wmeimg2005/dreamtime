class Platform {
  constructor() {
    this._fetchGpuDevices()
  }

  async _fetchGpuDevices() {
    try {
      this.gpuDevices = await tools.getGpusList()

      /*
      sentry.addBreadcrumb({
        category: 'stats',
        message: 'GPU Devices',
        level: 'info',
        data: {
          devices: this.gpuDevices
        }
      })
      */

      sentry.captureEvent({
        message: 'GPU Devices',
        level: 'info',
        extra: {
          devices: this.gpuDevices
        }
      })
    } catch (error) {
      this.gpuDevices = []
    }
  }

  getGpuDevices() {
    return this.gpuDevices
  }
}

export default new Platform()
