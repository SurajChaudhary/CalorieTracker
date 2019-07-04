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
     // Static data
      // {id: 0, name: 'Steak Dinner', calories: 1200},
     // {id: 1, name: 'Cookies', calories: 400},
     // {id: 2, name: 'Eggs', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }
  //Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name,calories) {
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
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item){
        total += item.calories;
      });
      // Set total Calories in data store
      data.totalCalories = total;

      //Return total cal
      return data.totalCalories;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    }
  }
})();

// UI Controller
const UICtrl = (function() {
  console.log('UI Controller');

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput:'#item-name',
    itemCaloriesInput:'#item-calories',
    totalCalories: '.total-calories'
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
    addListItem: function(item) {
      //Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                      <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                      </a>`;
      // Insert item ti list
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },
    getSelectors: function() {
      return UISelectors;
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
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

    //Edit icon click event- Since this gets added dynamically during DOM rendering thats why we have to use event delegation and not bubbling.
    // In event delegation, we gets hold of a parent element in DOM to grab dynamically generated element.
    // Item list is the parent element in this case. But we need to target our icon element else click event will happen on whole parent element(itemList).
    document.querySelector(UISelectors.itemList).addEventListener('click',itemUpdateSubmit);
  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UICtrl
    const input = UICtrl.getItemInput();
    
    // Check for name and Calorie input
    if(input.name !== '' && input.calories !== ''){
      // Add item
      const newItem = ItemCtrl.addItem(input.name,input.calories);
      //Add item to UI List
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function(e) {
    //We are targeting edit icon in event delegation.
    if(e.target.classList.contains('edit-item')){
      // Get list item ID
      //So we need to get the li(listItem)
      // icon's parent is <a> tag and its parent is li. So
      const listItemID = e.target.parentNode.parentNode.id;

      // Split ID to get number
      const listIdArray = listItemID.split('-');
      // Get the number in split array
      const id = parseInt(listIdArray[1]);

      // Get item based on ID
      const itemToEdit = ItemCtrl.getItemById(id);
      
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add item to form
      UICtrl.addItemToForm();
    }
    
    e.preventDefault();
  }
  //Public methods
  return {
    init: function() {
      console.log('Initializing App...');
      // Clear Edit state / Set initial state
      UICtrl.clearEditState();

      //Fetch items from data store
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate list with items
        UICtrl.populateItemList(items);
      }

       // Get total calories
       const totalCalories = ItemCtrl.getTotalCalories();

       // Add total calories to UI
       UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
      
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);

//Initialize App
AppCtrl.init();