module.exports = (grunt)->
  #config
  grunt.initConfig
    clean:
      main:
       src: 'target'

    coffee:
      glob_to_multiple: 
        expand: true
        flatten: false
        src: ["src/**/*.coffee"]
        dest: 'target'
        ext: ".js"

    copy:
      static:
        files: [
          {
            src: 'index.html'
            dest: 'target/index.html'
          }
        ]
      testServer:
        files: [
          src: 'src/app/server/appDev.js'
          dest: 'target/src/app/server/appDev.js'
        ]
      vendor:
        files: [
          expand: true
          flatten: false
          src: 'vendor/**/*'
          dest: 'target/'
        ]
      data:
        files: [
          expand: true
          flatten: true
          src: 'data/*.json'
          dest: 'target/data/'
        ]
      assets:
        files: [
          expand: true
          src: ['assets/font/*','assets/img/**/*']
          dest: 'target/'
        ]
    cssmin:
      options:
        rebase: false
      target:
        files:
          'target/assets/css/compass.min.css':['assets/css/ace.min.css',
             'assets/css/ace-skins.min.css',
             'assets/css/ace-fonts.css',
             'assets/css/style.css',
             'assets/css/chart.css',
             'assets/css/chosen.css',
             'assets/css/shelf.css']
    uglify:
      target:
        files: [
          expand: true
          cwd: 'target/src/app'
          src: '**/*.js'
          dest: 'target/src/app'
        ]
        # files:
        #   'target/src/app/app.js': ['target/src/app/app.js']
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

  #dependencis
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-contrib-watch')

  #Alias tasks
  grunt.registerTask('build', ['copy','coffee','cssmin', 'htmlmin','uglify'])
  grunt.registerTask('watcher', ['watch'])
  grunt.registerTask('default',['clean', 'build','watcher'])

