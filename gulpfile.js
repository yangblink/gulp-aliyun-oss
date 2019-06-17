var gulp = require('gulp')
var oss = require('./index')

const ossConfig = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
  region: process.env.OSS_REGION,
  bucket: process.env.OSS_BUCKET
}

gulp.task('default', function (cb) {
  return gulp.src([
    './**',
    '!node_modules/**'
  ])
    .pipe(oss(ossConfig))
})
