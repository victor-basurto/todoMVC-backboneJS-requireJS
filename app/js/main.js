require.config({
	paths: {
		'$': './libs/jquery/dist/jquery.min',
		'_': './libs/underscore-amd/underscore-min',
		'backbone': './libs/backbone-amd/backbone-min',
		'text': './libs/text',
		'bootstrap': './libs/bootstrap/dist/js/bootstrap.min',
		'backboneLocalStorage': './libs/backbone.localstorage/backbone.localStorage'
	},
	shim: {
		'_': {
			'exports': '_'
		},
		'backbone': {
			'deps': [ 
				'$', '_' 
			],
			'exports': 'Backbone'
		},
		'backboneLocalStorage': {
			'deps': [ 'backbone' ],
			'exports': 'Store'
		}
	}
});

require([ 'backbone', 'views/app', 'routers/router' ], function( Backbone, AppView, Workspace ) {
	// initialize routing and start backbone.history()
	new Workspace();
	Backbone.history.start();

	// initialize the application view
	new AppView();
});