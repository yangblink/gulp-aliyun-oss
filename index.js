// PLUGIN_NAME: gulp-aliyun-oss
const PLUGIN_NAME = 'gulp-aliyun-oss';

var path = require('path');
var through2 = require('through2');
var PluginError = require('gulp-util').PluginError;
var colors = require('gulp-util').colors;
var log = require('gulp-util').log;
var OSS = require('ali-oss');
var crypto =  require('crypto')

function oss(option) {
  if (!option) {
    throw new PluginError(PLUGIN_NAME, 'Missing option!');
  }
  if (!option.bucket) {
    throw new PluginError(PLUGIN_NAME, 'Missing option.bucket!');
  }

  option.prefix = option.prefix || "";

  var client = new OSS({
    region: option.region,
    accessKeyId: option.accessKeyId,
    accessKeySecret: option.accessKeySecret,
    bucket: option.bucket,
  });

  var ossOpt = option.ossOpt || {};

  var stream = through2.obj(function(file, enc, cb) {
    var filename = file.relative;
    var self = this;
    var getFileKey = function() {
      return option.prefix +
        ((!option.prefix || (option.prefix[option.prefix.length - 1]) === '/') ? '' : '/') +
        path.posix.relative(file.base, file.path);
    };

    function upload (cb) {
      return client.put(getFileKey(), file.contents, ossOpt)
        .then(function(result) {
          log('OK:', colors.green(filename));
          cb(null, file);
        })
        .catch(function(err) {
          log('ERR:', colors.red(filename + "\t" + err.code));
          cb(err, null);
        })
    }

    if (file.isBuffer()) {
      const contentMd5 = crypto.createHash('md5').update(file.contents).digest().toString('base64')
      client.head(getFileKey(), ossOpt)
        .then(function (result) {
          var res = result.res
          if (res.headers['content-md5'] === contentMd5) {
            log('IGNORE:', colors.gray(filename))
            cb(null, file)
          } else {
            // log('REPLACE:', colors.yellow(filename))
            upload(cb)
          }
        })
        .catch(function (err) {
          if (err.status === 404) {
            log('NEW:', colors.green(filename))
            upload(cb)
          } else {
            cb(err, null)
          }
        })

    } else {
      cb();
    }
  });

  return stream;
}

module.exports = oss;
