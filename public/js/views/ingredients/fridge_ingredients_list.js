App.Views.FridgeIngredientList = Backbone.View.extend({

  initialize: function () {
    console.log('new fridge ingredients view created brough');
    this.listenTo(this.collection, 'reset', this.renderAll);
    this.listenTo(this.collection, 'create', this.save);
    this.listenTo(this.collection, 'all', this.renderAll);
    this.listenTo(this.collection, 'remove', this.delete);
    this.listenTo(this.collection, 'create', App.fridgeIngredients.getFridgeIngredients);
    App.users.getUsers();
  },

  el: 'body',

  events: {
    'click .add-to-search': 'selectIngredient',
    'click .delete-fridge-ingredient': 'delete',
    'click .add-ingredient': 'addIngredient',
    'click .move-to-pantry': 'addToPantry',
    'click .select-user':'setUser',
    'click .search-oldest': 'searchOldest'
  },

  setUser: function() {
    App.fridgeIngredients.userId = $('#userDropDown').val();
    App.pantryIngredients.userId = $('#userDropDown').val();
    App.fridgeIngredients.getFridgeIngredients();
    App.pantryIngredients.getPantryIngredients();
  },

  //This function takes whatever number the user sets 'add oldest to serch' and puts that into the search.
  //If the user sets it to 2, it will take the 2 oldest items and the fridge and put it into search.
  searchOldest: function () {
    App.searchIngredients.reset();
    $.ajax({
      url: '/users/' + App.fridgeIngredients.userId + '/fridge_ingredients',
      method: 'get'
    }).done(function(ingredients) {
      for ( var i = 0; i < $('#oldestNumber').val(); i ++) {
        var ingredientId = ingredients[i].id;
        var movedIngredient = App.fridgeIngredients.findWhere({fridgeIngId: ingredientId});
        App.searchIngredients.add(movedIngredient);
      }
    })
  },

 	addIngredient: function(){
 	  console.log('add ingredient button clicked brough');
 	  var ingredientName = $('#add-fridge-ingredient-input').val();
    this.collection.create({name: ingredientName}, {
      success: function() {
          App.fridgeIngredients.getFridgeIngredients()
      }
     });
  },

  addToPantry: function(){
    console.log('select pantry button clicked doooooood');
    var fridge = $('#fridge-ingredients-list-container');
    for (var i = 0; i < fridge.children().length; i++) {
      if (fridge.children().eq(i).children().eq(0).children().eq(0).is(':checked') === true) {
        var ingredientId = parseInt(fridge.children().eq(i).children().eq(0).attr('data-id'));
        var movedIngredient = App.fridgeIngredients.findWhere({fridgeIngId: ingredientId});
        App.pantryIngredients.create({
          name:movedIngredient.attributes.name
        });
      };
    };
  },

  //This function grabs an ingredient based on whether or not it's checkbox has been ticked. 
  //If it has, it will take it's id and add it to the search collection.
  selectIngredient: function () {
    console.log('select ingredient button clicked doooooood');
    var fridge = $('#fridge-ingredients-list-container');
    for (var i = 0; i < fridge.children().length; i ++) {
      if (fridge.children().eq(i).children().eq(0).children().eq(0).is(':checked') === true) {
        var ingredientId = parseInt(fridge.children().eq(i).children().eq(0).attr('data-id'));
        var movedIngredient = App.fridgeIngredients.findWhere({fridgeIngId: ingredientId});
        App.searchIngredients.add(movedIngredient);
      }
    }
  },

  delete: function(){
  	console.log('delete button clicked doooooood');
  	var fridge = $('#fridge-ingredients-list-container');
  	for (var i = 0; i < fridge.children().length; i++) {
      if (fridge.children().eq(i).children().eq(0).children().eq(0).is(':checked') === true) {
        var ingredientId = parseInt(fridge.children().eq(i).children().eq(0).attr('data-id'));
        var movedIngredient = App.fridgeIngredients.findWhere({fridgeIngId: ingredientId});
        $.ajax({
        	url: '/fridge_ingredients/' + ingredientId,
        	method: 'DELETE'
        }).done(this.collection.remove(movedIngredient))
    	}
    }      
  },

	renderAll: function() {
	  $('#fridge-ingredients-list-container').empty();
	  this.collection.each(this.renderOne, this);
	},

	renderOne: function(ingredient) {
	  var fridgeListItem = new App.Views.FridgeIngredient({model: ingredient});
	  fridgeListItem.$el.appendTo($('#fridge-ingredients-list-container'));
	}

});




