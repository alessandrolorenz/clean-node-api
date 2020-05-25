module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '3.5.7',
      skipMD5: true
    },
    autoStart: false
  }
}
