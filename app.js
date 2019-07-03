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
    getItems: function() {
      return data.items;
    },
    addItem: function(iname,calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length-1].id + 1;
      } else {
        ID = 0;
      }

      //Calories to number
      calories = parseInt(calories);

      //Create new Item
      newItem = new Item(ID,name,calories);
      
      //Add to data store
      data.items.push(newItem);
      return newItem;
    },
    logData: function() {
      return data;
    }
  }
})();

// UI Controller
const UICtrl = (function() {
  console.log('UI Controller');

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput:'#item-name',
    itemCaloriesInput:'#item-calories',
  }
  //Public methods
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
                  <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                  <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                  </a>
                </li>`;
        
      });
      //Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    getSelectors: function() {
      return UISelectors;
    }

  }
})();

// App Controller
const AppCtrl = (function(ItemCtrl, UICtrl, StorageCtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    console.log('Loading event listeners....');
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();
    console.log(UISelectors);
    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UICtrl
    const input = UICtrl.getItemInput();
    
    // Check for name and Calorie input
    if(input.name !== '' && input.calories !== ''){
      // Add item
      const newItem = ItemCtrl.addItem(input.name,input.calories);
    }
    e.preventDefault();
  }
  //Public methods
  return {
    init: function() {
      console.log('Initializing App...');
      //Fetch items from data store
      const items = ItemCtrl.getItems();

      //Populate list with items
      UICtrl.populateItemList(items);

      // Load event listeners
      loadEventListeners();
      
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

//Initialize App
AppCtrl.init();