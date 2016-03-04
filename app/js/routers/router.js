define([ '$', 'backbone', 'collections/todos', 'common' ], function( $, Backbone, Todos, Common ) {
	'use strict';

	var TodoRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setfFilter'
		},

		setfFilter: function( param ) {
			// set the current filter to be used
			Common.TodoFilter = param || '';

			Todos.trigger( 'filter' );
		}
	});
	return TodoRouter;
});