define([ 
	'_', 
	'backbone', 
	'backboneLocalStorage', 
	'models/todo' 
], function( _, Backbone, Store, Todo ) {
	'use strict';
	
	var TodosCollection = Backbone.Collection.extend({
		// reference to this collection's model
		model: Todo,

		/**
		 * backboneLocalStorage
		 * @param {String} `todos-backbone` namespace
		 */
		localStorage: new Store( 'todos-backbone' ),

		// filter list of all finished todo items
		completed: function() {
			return this.where({ completed: true });
		},

		// filter list of not finished todo items
		remaining: function() {
			return this.where({ completed: false });
		},

		// Keep Todos in sequential order
		nextOrder: function() {
			return this.length ? this.last().get( 'order' ) + 1 : 1;
		},

		// Todos are sorted by their original insertion order
		comparator: 'order'
	});
	return new TodosCollection();
});