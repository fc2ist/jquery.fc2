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
          "src/header.coffee",
          'src/jquery.fc2.coffee',
          'src/eyecatch.coffee',
          'src/pager.coffee',
          'src/scroll.coffee',
          'src/lightbox.coffee',
          "src/footer.coffee"
        ]
      },
      'b': {
        dest: 'jquery_fc2.js',
        src: ['<banner:meta.banner>', 'jquery_fc2.js', 'src/jquery.imagesloaded.js']
      },
      'c': {
        dest: 'jquery_fc2_min.js',
        src: ['jquery_fc2_min.js', 'src/jquery.imagesloaded.js']
      }
    },
    
    watch: {
      files: [
        'src/*.coffee'
      ],
      tasks: 'concat:a coffee clean concat:b min concat:c growl:complete'
    },
    
    min: {
      'jquery_fc2_min.js': ['<banner:meta.banner>', 'jquery_fc2.js']
    },
    
    coffee: {
      dist: {
        src: ['src/_tmp.coffee'],
        dest: 'jquery_fc2.js',
        options: {
          bare: true
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