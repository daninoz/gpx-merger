// vue.config.js
module.exports = {
  configureWebpack: {
    resolve: {
      fallback: { 
          "timers":  require.resolve("timers-browserify")
      },
    },
  }
}