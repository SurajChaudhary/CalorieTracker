// Storage Controller
const StorageCtrl = (function() {
  console.log('Storage Controller');
})();

// Item Controller
const ItemCtrl = (function() {
  console.log('Item Controller');
  //Item Constructor
  const Item = function(id,name,calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure or State
  const data = {
    items: [
      {id: 0, name: 'Steak Dinner', calories: 1200},
      {id: 1, name: 'Cookies', calories: 400},
      {id: 2, name: 'Eggs', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }
  //Public methods
  return {
    logData: function() {
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function() {
  console.log('UI Controller');
  //Public methods
  return {

  }
})();

// App Controller
const AppCtrl = (function(ItemCtrl, UICtrl, StorageCtrl) {
  console.log(ItemCtrl.logData());

  //Public methods
  return {
    init: function() {
      console.log('Initializing App...');
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

//Initialize App
AppCtrl.init();