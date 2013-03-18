'use strict';
module.exports = function(grunt){
  console.log('rsync -rtv --exclude-from=' + __dirname + '/.rsyncignore --delete ' + __dirname + ' hack@218.245.3.131:~/wwwroot/ooxx')
  grunt.loadNpmTasks("grunt-shell")
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      rsync: {
          command: 'rsync -rtv --exclude-from=' + __dirname + '/.rsyncignore --delete ' + __dirname + ' hack@218.245.3.131:~/wwwroot/'
      }
    }
  })
  grunt.registerTask('default', 'shell:rsync')
}
