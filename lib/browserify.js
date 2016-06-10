const browserify = require('browserify')
const path = require('path')
const uglifyify = require('uglifyify')

const transform = require('./transform')

module.exports = function ({
  config,
  entry,
  env,
  minify,
  outfile
}) {
  const pipeline = browserify(entry, {
    cache: {},
    debug: !minify,
    packageCache: {},
    paths: [
      path.join(__dirname, '/../node_modules'),
      path.join(process.cwd(), '/node_modules')
    ],
    transform: transform({
      config,
      env,
      outfile
    })
  })
  .on('error', function (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(0)
  })
  .on('log', function (message) {
    console.log(message)
  })

  if (minify) {
    pipeline.transform({ global: true }, uglifyify)
  }

  return pipeline
}