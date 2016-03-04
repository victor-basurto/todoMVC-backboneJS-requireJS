define([
	'$',
	'_',
	'backbone',
	'collections/todos',
	'views/todos',
	'text!templates/stats.html',
	'common'
], function( $, _, Backbone, Todos, TodoView, statsTemplate, Common ) {
	'use strict';

	var AppView = Backbone.View.extend({
		el: '#todoapp',
		template: _.template( statsTemplate ),
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		},
		initialize: function() {
			this.allCheckBox = this.$( '#toggle-all' )[ 0 ];
			this.$input = this.$( '#new-todo' );
			this.$footer = this.$( '#footer' );
			this.$main = this.$( '#main' );
			this.$todoList = this.$( '#todo-list' );

			this.listenTo( Todos, 'add', this.addOne );
			this.listenTo( Todos, 'reset', this.addAll );
			this.listenTo( Todos, 'change:completed', this.filterOne );
			this.listenTo( Todos, 'filter', this.filter );
			this.listenTo( Todos, 'all', _.debounce( this.render, 0 ) );

			Todos.fetch({ reset: true });
		},

		render: function() {
			var completed = Todos.completed().length,
				remaining = Todos.remaining().length;

			if ( Todos.length ) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html( this.template({
					completed: completed,
					remaining: remaining
				}));

				this.$( '#filters li a' )
					.removeClass( 'selected' )
					.filter( '[href="#/' + ( Common.TodoFileter || '' ) + '"]' )
					.addClass( 'selected' );
			} else {
				this.$main.hide();
				this.$footer.hide();
			}
			this.allCheckBox.checked = !remaining;
		},

		/**
		 * Add a single item to the list by creating a view for it
		 * @ param {model} todo single item
		 */
		addOne: function( todo ) {
			var view = new TodoView({ model: todo });
			this.$todoList.append( view.render().el );
		},

		// add all items in the Todos collection
		addAll: function() {
			this.$todoList.empty();
			Todos.each( this.addOne, this );
		},

		filterOne: function( todo ) {
			todo.trigger( 'visible' );
		},

		filterAll: function() {
			Todos.each( this.filterOne, this );
		},

		// generate attributes from the todo item
		newAttributes: function() {
			return {
				title: this.$input.val().trim(),
				order: Todos.nextOrder(),
				completed: false
			};
		},

		createOnEnter: function( e ) {
			if ( e.which !== Common.ENTER_KEY || !this.$input.val().trim() ) {
				return;
			}

			Todos.create( this.newAttributes() );
			this.$input.val('');
		},

		// clear all completed todo items
		clearCompleted: function() {
			_.invoke( Todos.completed(), 'destroy' );
			return false;
		},

		toggleAllComplete: function() {
			var completed = this.allCheckBox.checked;

			Todos.each( function( todo ) {
				todo.save({
					completed: completed
				});
			});
		}
	});

	return AppView;	
});