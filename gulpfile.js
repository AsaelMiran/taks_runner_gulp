var gulp = require('gulp')
var babel = require('gulp-babel')
var pug = require('gulp-pug')
var browserSync = require('browser-sync')
var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var cssnano = require('cssnano')
const imagemin = require('gulp-imagemin');

const server = browserSync.create()
const postCSSPlugins = [
  cssnano({
    autoprefixer: {
      add: true
    }
  })
]

gulp.task('img', ()=>{
  gulp.src('./dev/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('./public/img'))
})

gulp.task('es6', () => {
  gulp.src('./dev/js/*.js')
    .pipe(babel({
      presets: ['env']
    }
    ))
    .pipe(gulp.dest('./public/js'))
})

gulp.task('sass', () =>
  gulp.src('./dev/scss/styles.scss')
    .pipe(sass())
    .pipe(postcss(postCSSPlugins))
    .pipe(gulp.dest('./public/css'))
    .pipe(server.stream({ match: '**/*.css' }))
)

gulp.task('pug', () =>
  gulp.src('./dev/pug/*.pug')
    .pipe(pug({
      pretty: false
    }))
    .pipe(gulp.dest('./public'))
)

gulp.task('default', () => {
  server.init({
    server: {
      baseDir: './public'
    }
  })
  gulp.watch('./dev/js/*.js', ['es6', server.reload])
  gulp.watch('./dev/pug/**/*.pug', ['pug', server.reload])
  gulp.watch('./dev/scss/**/*.scss', ['sass'])
})
