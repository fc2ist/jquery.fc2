module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-growl');

  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      'a': {
        dest: 'src/_tmp.coffee',
        src: [
          'src/jquery.fc2.coffee',
          'src/eyecatch.coffee',
          'src/pager.coffee',
          'src/scroll.coffee',
          'src/lightbox.coffee'
        ]
      },
      'b': {
        dest: 'jquery_fc2.js',
        src: ['<banner:meta.banner>', 'jquery_fc2.js']
      }
    },
    
    watch: {
      files: [
        'src/*.coffee'
      ],
      tasks: 'concat:a coffee concat:b min clean growl:complete'
    },
    
    min: {
      'jquery_fc2_min.js': ['<banner:meta.banner>', 'jquery_fc2.js']
    },
    
    coffee: {
      compile: {
        files: {
          'jquery_fc2.js': 'src/_tmp.coffee'
        }
      }
    },
    
    growl: {
      complete: {
        message: "＼(^o^)／",
        title: "grunt"
      }
    },
    
    clean: ['src/_tmp.coffee']
  });
  
};