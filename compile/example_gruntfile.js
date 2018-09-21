var pattern = {
	preprocess: [
		{
			pattern: /\~([\$a-z0-9A-Z\._ \-\(\),\"\']+)\(([^\r\n]*)\)[ ]*([\r]*\n)/ig,
			replacement: '@include $1($2); $3'
		},
		{
		pattern: /\~([\$a-z0-9A-Z\._ \-\(\),\"\']+)\(([^\}\{]*)\)[\s]+\}/ig,
			replacement: '@include $1($2); }'
		},
		{
			pattern: /\~([\$a-z0-9A-Z\._ \-\(\),\"\']+)\(([^;\{]*)\)\;/ig,
			replacement: '@include $1($2);'
		},
	],
	postprocess: [
		{
			pattern: /@include ([\$a-z0-9A-Z\._ \-\(\),\"\']+)\(([^;\{]*)\)\;/ig,
			replacement: '~$1($2);'
		}
	],
};

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			theme: {
				files: {
					'OUTPUT.css' : 'INPUT.scss'
				},
				options: {
					cache_location: '.sass_cache/theme',
					style: 'compact '
				}
			},
			production: {
				files: {
					'OUTPUT.css' : 'INPUT.scss',
				},
				options: {
					cache_location: '.sass-cache/theme',
					style: 'compressed'
				}
			}
		},
		watch: {
			theme: {
				files: ['FOLDER*.scss'],
				tasks: ['string-replace:preprocess_theme','sass:theme','string-replace:postprocess_theme'],
				options: {
					spawn: false,
					livereload: true,
					nospawn: false
				}
			}
		},
		'string-replace': {
			'preprocess_theme': {
				files: {
					'./': '.FOLDER/*.scss'
				},
				options: {
					replacements: pattern.preprocess,	
					]
				}
			},
			'postprocess_theme': {
				files: {
					'./': '../../web/sites/all/themes/ifafri/css/*.scss'
				},
				options: {
					replacements: pattern.postprocess,
				}
			}
		},
		clean: {
		  test: [
			'.sass-cache'
		  ]
		},
	});
	grunt.loadNpmTasks('grunt-contrib-sass');	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-livereload');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.registerTask('default',['watch', 'clean', 'string-replace']);
	
	grunt.registerTask('sass_theme', '', function() {
			grunt.task.run('string-replace:preprocess_theme','sass:theme', 'string-replace:postprocess_theme');
	});
}