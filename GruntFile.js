module.exports = function (grunt)
{
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: "\n\n"
			},
			dist: {
				src: ['src/main/webapp/sources/js/**/*.js'],
				dest: 'src/main/webapp/build/js/<%= pkg.name %>.js'
			},
			deps: {
				src: [
					'bower_components/jquery/dist/jquery.min.js',
					'bower_components/bootstrap/dist/js/bootstrap.min.js',
					'bower_components/leaflet/dist/leaflet.js',
					'bower_components/angularjs/angular.min.js',
					'bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.min.js',
					'bower_components/angular-resource/angular-resource.min.js',
					'bower_components/angular-input-masks/angular-input-masks.min.js',
					'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
					'bower_components/angular-i18n/angular-locale_pt-br.js'
				],
				dest: 'src/main/webapp/build/js/<%= pkg.name %>-deps.js'
			},
			css: {
				src: [
					'src/main/webapp/sources/css/**/*.css',
					'bower_components/bootstrap/dist/css/bootstrap.min.css',
					'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
				],
				dest: 'src/main/webapp/build/css/<%= pkg.name %>.css'
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			target: {
				files: {
					'src/main/webapp/build/js/<%= pkg.name %>.min.js' : ['src/main/webapp/build/js/<%= pkg.name %>.js']
				}
			}
		},
		watch: {
			scripts: {
				files: ['src/main/webapp/sources/js/**/*.js'],
				tasks: ['concat:dist', 'uglify']
			},
			styles: {
				files: ['src/main/webapp/sources/css/**/*.css'],
				tasks: ['concat:css']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	//tasks
	grunt.registerTask('default', ['concat', 'uglify']);
	grunt.registerTask('build', ['concat', 'uglify']);
}