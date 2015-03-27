module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			options: {
				compass: true,
				style: "compressed"
			},
			code: {
				files: {
					'dist/style.css' : 'src/scss/style.scss',
				}	
			}
		},
		jade: {
			debug: {
				options: {
					// data: {
					// 	debug: true,
					// 	timestamp: "<%= grunt.template.today() %>"
					// }
				},
				files: {
					"dist/index.html": "src/jade/index.jade"
				}
			}
		},

		jshint: {
			options: {
				'strict': true,
				'curly': true,
				'eqeqeq': true,
				'eqnull': true,
				'camelcase': true,
				'undef': true,
				'expr': true,
				'unused': 'strict',

				// Storing this-based functions elsewhere
				'validthis': true,

				// Allow variable shadowing for 'self'?
				'shadow': true
			},
			grunt: {
				options: {
					globals: {
						'module': true
					}
				},
				files: {
					src: ['Gruntfile.js']
				},
			},
			code: {
				options: {
					'browser': true,
					'jquery': true,
					'devel': true,
					globals: {
						module: true,
						require: true,
						Event: true
					}
				},
				files: {
					src: ['src/javascript/*']
				}
			}
		},

		browserify: {
			dist: {
				files: {
					'dist/Week.js' : ['src/javascript/Week.js']
				},
				options: {
					browserifyOptions: {
						'standalone': 'Week'
					}
				}
			}
		},

		uglify: {
			options: {
				// banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
			},

			bundle: {
				options: {
					mangle: true,
					// beautify: true,
					compress: true
				},
				src: 'dist/Week.js',
				dest: 'dist/Week.min.uglified.js'
			},

			script: {
				options: {
					mangle: true,
					beautify: true,
					compress: true
				},
				src: 'src/javascript/script.js',
				dest: 'dist/script.js'
			}
		},

		'closure-compiler': {
			frontend: {
				closurePath: '/usr/local/Cellar/closure-compiler/20141023/libexec',
				js: 'dist/Week.js',
				jsOutputFile: 'dist/Week.min.closure.js',
				//maxBuffer: 500,
				options: {
				//	compilation_level: 'ADVANCED_OPTIMIZATIONS',
				//	language_in: 'ECMASCRIPT5_STRICT',
					'language_in': 'ECMASCRIPT5'
				}
			}
		},

		watch: {
			grunt: {
				files: [ 'Gruntfile.js' ],
				options: {
					reload: true
				}
			},
			src: {
				files: ['src/**/*'],
				tasks: ['development'],
				options: {
					livereload: true
				}
			},
			options: {
				spawn: false
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-jade');

	grunt.registerTask('default', ['jade', 'sass', 'jshint', 'browserify', 'uglify', 'closure-compiler', 'watch']);
	grunt.registerTask('development', ['jade', 'sass', 'jshint', 'uglify:script', 'browserify', 'watch']);

};