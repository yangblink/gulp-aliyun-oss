// PLUGIN_NAME: gulp-aliyun-oss
const PLUGIN_NAME = 'gulp-aliyun-oss';

var path = require('path');
var through2 = require('through2');
var PluginError = require('gulp-util').PluginError;
var colors = require('gulp-util').colors;
var log = require('gulp-util').log;
var OSS = require('ali-oss');
var co = require('co');

function oss(option) {
    if (!option) {
        throw new PluginError(PLUGIN_NAME, 'Missing option!');
    }
    if(!option.bucket){
        throw new PluginError(PLUGIN_NAME, 'Missing option.bucket!');
    }

    option.prefix = option.prefix || "";

    var client = new OSS({
      region: option.region,
      accessKeyId: option.accessKeyId,
      accessKeySecret: option.accessKeySecret,
      bucket: option.bucket,
    });

    var stream = through2.obj(function (file, enc, cb) {
        var filename = file.relative;
        var self = this;
        var getFileKey = function(){
            return (option.prefix
                + ((!option.prefix || (option.prefix[option.prefix.length - 1]) === '/') ? '' : '/')
                + path.relative(file.base, file.path)).replace(/\\/g,"/");
        };
        
        if(file.isBuffer()){
          // console.log(filename);
          co(function* () {
            var result = yield client.put(getFileKey(), file.contents );
			log('OK:', colors.green(filename));
            cb(null, file);
          })
          .catch(function (err) {
            log('ERR:', colors.red(filename + "\t" + err.code));
            cb(err, null);
          })  
        }
        else {
          cb();
        }
    });

    return stream;
}

module.exports = oss;
