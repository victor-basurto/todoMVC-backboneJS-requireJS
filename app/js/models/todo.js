define([ '_', 'backbone' ], function( _, Backbone ) {
	'use strict';

	var Todo = Backbone.Model.extend({
		defaults: {
			title: '',
			completed: false
		},

		// toggle the `completed` state of this Todo
		toggle: function() {
			this.save({
				completed: !this.get( 'completed' )
			});
		}
	});

	return Todo;
});