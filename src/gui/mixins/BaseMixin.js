export default {
  filters: {},

  data: () => ({
    app: {
      name: process.env.APP_NAME,
      version: process.env.npm_package_version,
      status: process.env.APP_STATUS
    }
  })
}
