define([ 
	'$', 
	'_', 
	'backbone', 
	'text!templates/todos.html', 
	'common' 
], function( $, _, Backbone, todosTemplate, Common ) {
	'use strict';
	
	var TodoView = Backbone.View.extend({
		// is a list tag
		tagName: 'li',
		template: _.template( todosTemplate ),
		events: {
			'click .toggle': 'toggleCompleted',
			'dbclick label': 'edit',
			'click .destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'revertOnScape',
			'blur .edit': 'close'
		},

		initialize: function() {
			this.listenTo( this.model, 'change', this.render );
			this.listenTo( this.model, 'destroy', this.remove );
			this.listenTo( this.model, 'visible', this.toggleVisible );
		},

		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			this.$el.toggleClass( 'completed', this.model.get( 'completed' ) );

			this.toggleVisible();
			this.$input = this.$( '.edit' );
			return this;
		},

		toggleVisible: function() {
			this.$el.toggleClass( 'hidden', this.isHidden() );
		},

		isHidden: function() {
			var isCompleted = this.model.get( 'completed' );
			return(
				( !isCompleted && Common.TodoFilter === 'completed' ) ||
				( isCompleted && Common.TodoFilter === 'active' )
			);
		},

		// toggle the completed state of the model
		toggleCompleted: function() {
			return this.toggle();
		},

		// switch view into editing mode
		edit: function() {
			this.$el.addClass( 'editing' );
			this.$input.focus();
		},

		// close the editing mode, saving changes to the todo
		close: function() {
			var value = this.$input.val();
			var trimmedValue = value.trim();

			if ( trimmedValue ) {
				this.model.save({
					title: trimmedValue
				});
				if ( value != trimmedValue ) {
					/**
					 * Model values changes consisting of whitespaces only are not causing change to be triggered
					 * Therefore we've to compared untrimmed version with a trimmed one to check whether anything
					 * changed, and if yes, we've trigger change event ourselves 
					 */
					 this.model.trigger( 'change' );
				}
			} else {
				this.clear();
			}

			this.$el.removeClass( 'editing' );
		},

		// update on `enter`
		updateOnEnter: function( e ) {
			if ( e.keyCode === Common.ENTER_KEY ) {
				this.close();
			}
		},

		// pressing `escape` key
		revertOnScape: function( e ) {
			if ( e.which === Common.ESCAPE_KEY ) {
				this.$el.removeClass( 'editing' );

				// also resets the hidden input back to the original value
				this.$inptu.val( this.model.get( 'title' ) );
			}
		},

		// Remove Item, destroy model from localStorage and delete its view
		clear: function() {
			this.model.destroy();
		}
	});
	return TodoView;
});