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
					'bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
					'bower_components/angularjs/angular.min.js',
					'bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.min.js',
					'bower_components/angular-resource/angular-resource.min.js',
					'bower_components/angular-route/angular-route.min.js',
					'bower_components/angular-input-masks/angular-input-masks.min.js',
					'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
					'bower_components/angular-i18n/angular-locale_pt-br.js'
				],
				dest: 'src/main/webapp/build/js/<%= pkg.name %>-deps.js'
			},
			css: {
				src: [
					'bower_components/leaflet/dist/leaflet.css',
					'bower_components/leaflet.markercluster/dist/MarkerCluster.css',
					'bower_components/leaflet.markercluster/dist/MarkerCluster.Default.css',
					'bower_components/bootstrap/dist/css/bootstrap.min.css',
					'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
				],
				dest: 'src/main/webapp/build/css/<%= pkg.name %>-deps.css'
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
		sass: {
			dist: {
				files: {
					'src/main/webapp/build/css/<%= pkg.name %>.css' : 'src/main/webapp/sources/sass/main.scss'
				}
			}

		},
		watch: {
			scripts: {
				files: ['src/main/webapp/sources/js/**/*.js'],
				tasks: ['concat:dist', 'uglify']
			},
			styles: {
				files: ['src/main/webapp/sources/css/**/*.css', 'src/main/webapp/sources/sass/**/*.scss'],
				tasks: ['sass', 'concat:css']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

	//tasks
	grunt.registerTask('default', ['sass', 'concat', 'uglify']);
	grunt.registerTask('build', ['sass', 'concat', 'uglify']);
}