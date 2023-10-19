# gulp-manifest.js
create manifest file for bundle

### install

```shell
npm install basis-company/gulp-manifest.js
```

### gulpfile.js
```js
var manifest = require('gulp-manifest');

var bundles = [ 'admin', 'user' ];
var rename = true; // rename src files to 'name-hash.ext'

gulp.task('manifest', () =>
  gulp.src([
    'build/admin.js',
    'build/helpers.js',
    'build/style.css',
    'build/user.js',
    'build/version.txt',
  ])
    .pipe(manifest(bundles, rename))
    .pipe(gulp.dest('manifest'))
);
```

### result

##### manifest/admin.json
```json
{
  "starter": "admin.js",
  "admin.js": "admin-e7c0073c1167.js",
  "helpers.js": "helpers-c9833abeffd8.js",
  "style.css": "style-d2024e8e9557.css",
  "version": "1.0.0"
}
```

##### manifest/user.json
```json
{
  "starter": "user.js",
  "user.js": "user-2124834cba23.js",
  "helpers.js": "helpers-c9833abeffd8.js",
  "style.css": "style-d2024e8e9557.css",
  "version": "1.0.0"
}
```
