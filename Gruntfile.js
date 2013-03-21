'use strict';
module.exports = function(grunt){
  console.log('rsync -rtv --exclude-from=' + __dirname + '/.rsyncignore --delete ' + __dirname + ' yuji@49.212.217.46:~/wwwroot/ooxx')
  grunt.loadNpmTasks("grunt-shell")
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      rsync: {
          command: 'rsync -rtv --exclude-from=' + __dirname + '/.rsyncignore --delete ' + __dirname + ' yuji@49.212.217.46:~/wwwroot/'
      }
    }
  })
  grunt.registerTask('default', 'shell:rsync')
}
