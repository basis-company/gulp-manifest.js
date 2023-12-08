var crypto      = require('crypto');
var fs          = require('fs');
var path        = require('path');
var Transform   = require('stream').Transform;
var Vinyl       = require('vinyl');

module.exports = function(bundles, rename) {
  var result = {};

  return new Transform({
    objectMode: true,
    highWaterMark: 16,

    transform(file, enc, cb) {
      var f = path.parse(file.path);

      if (f.ext === '.txt') {
        result[f.name] = file.contents.toString();
      }
      else if ((a = f.base.split('-')).length > 1) {
        if (result[a = a[0] + f.ext]) {
          fs.unlinkSync(file.path);
        }
        else {
          result[a] = f.base;
        }
      }
      else {
        var a = f.name + '-' +
          crypto
            .createHash('md5')
            .update(file.contents)
            .digest('hex')
            .slice(0, 12) + f.ext;

        if (rename) {
          if (result[f.base] === a) {
            fs.unlinkSync(file.path);
          }
          else {
            if (result[f.base]) {
              fs.unlinkSync(path.join(f.dir, result[f.base]));
            }

            fs.renameSync(file.path, path.join(f.dir, a));
          }
        }

        result[f.base] = a;
      }

      cb();
    },

    flush(cb) {
      if (Object.keys(result).length > 0) {
        bundles.forEach(k => {
          var o = Object.assign({ starter: k + '.js' }, result);

          bundles.forEach(n => {
            if (k !== n) {
              delete o[n + '.js'];
            }
          });

          this.push(new Vinyl({
            path: k + '.json',
            contents: Buffer.from(JSON.stringify(o)),
          }));
        });
      }

      cb();
    },
  });
};
