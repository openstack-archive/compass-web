module.exports = (grunt)->
  #config
  grunt.initConfig
    clean:
      target:
       src: 'target'
      dist:
       src: 'dist'

    coffee:
      glob_to_multiple: 
        expand: true
        flatten: false
        src: ["src/**/*.coffee"]
        dest: 'target'
        ext: ".js"

    copy:
      target:
        files: [
          {
            src: 'index.html'
            dest:'target/index.html'
          },
          {
            src: 'src/app/server/appDev.js'
            dest: 'target/src/app/server/appDev.js'
          },
          {
            expand: true
            flatten: false
            src: 'bower_components/**/*'
            dest: 'target/'
          },
          {
            expand: true
            flatten: false
            src: 'vendor/**/*'
            dest: 'target/'
          },
          {
            expand: true
            flatten: true
            src: 'data/*.json'
            dest: 'target/data/'
          },
          {
            expand: true
            src: ['assets/font/*', 'assets/fonts/*', 'assets/img/**/*']
            dest: 'target/'

          },
          {
            expand: true
            flatten: true
            src: 'bower_components/requirejs/require.js'
            dest: 'target/requirejs/'
          }
        ]
      dist:
        files: [
          {
            src: 'target/index.html'
            dest: 'dist/index.html'
          },
          {
            expand: true
            cwd:'target'
            src: ['assets/**/*']
            dest: 'dist/'

          },
          {
            expand: true
            flatten: true
            src: 'target/src/app/partials/*.html'
            dest: 'dist/src/app/partials'
          },
          {
            expand: true
            flatten: true
            src: 'target/data/*.json'
            dest: 'dist/data/'
          },
          {
            expand: true
            flatten: true
            src: 'bower_components/requirejs/require.js'
            dest: 'dist/requirejs/'
          }
        ]
    cssmin:
      options:
        rebase: false
      target:
        files:
          'target/assets/css/compass.min.css':[
             'bower_components/bootstrap/dist/css/bootstrap.css'
             'assets/css/font-awesome.min.css'
             'assets/css/ace.min.css'
             'assets/css/ace-skins.min.css'
             'assets/css/ace-fonts.css'
             'assets/css/style.css'
             'assets/css/chart.css'
             'assets/css/chosen.css'
             'assets/css/shelf.css'
             'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css'
          ]
    htmlmin:
        target:
          options:
            removeComments: true
            collapseWhitespace: true
          files: [
            expand: true
            src: 'src/app/partials/*'
            dest: 'target/'
          ]
    watch:
      build:
        files: ["**/*.{css,coffee,html}"]
        tasks: ['build']
        options:
          spawn: false
    requirejs:
      dist:
        options:
          baseUrl: "target/src"
          mainConfigFile: "target/src/main.js"
          name: "main"
          keepBuildDir: true
          out: "dist/src/main.js"
          optimize: "uglify2"

  #dependencis
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-requirejs')

  #Alias tasks
  grunt.registerTask('build', ['clean:target','copy:target','coffee','cssmin', 'htmlmin'])
  grunt.registerTask('watcher', ['watch'])
  grunt.registerTask('default',['build','watcher'])
  grunt.registerTask('dist',['build','clean:dist', 'copy:dist', 'requirejs:dist','watch'])

