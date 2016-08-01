## gulp-aliyun-oss

一个阿里云上传文件的gulp插件

>参考[https://github.com/wefound/gulp-alioss](https://github.com/wefound/gulp-alioss)

## 安装
```shell
npm install gup-aliyun-oss
```

## 示例
```javascript
var gulp = require('gulp');
var oss = require('gulp-aliyun-oss');
gulp.task('oss', function(cb){
    var options = {
        accessKeyId: your-accessKeyId,
        accessKeySecret: your-accessKeySecret,
        region: your-region,
        bucket: your-bucket,
        prefix: your-prefix,
    };
    
    return gulp.src('*.js').pipe(oss(options));
})
```