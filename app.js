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
    updateItem: function(name, calories){
      // calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function(item){
        if (item.id === data.currentItem.id) {
            item.name = name;
            item.calories = calories;
            found = item;
        }
      });
      return found;
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
    },
    deleteItem: function(currentItemId){
      // Get Ids using map for a change and not simple for each.
      ids = data.items.map(function(item){
        return item.id;
      });

      //Get Index
      const index = ids.indexOf(currentItemId);

      //Remove item
      data.items.splice(index,1);
    },
    clearAllItems: function() {
      data.items = [];
    }
  }
})();

// UI Controller
const UICtrl = (function() {
  console.log('UI Controller');

  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
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
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // It will return a node list and for each can't be used with it.
      //So turn node list into an array
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        const itemId = listItem.getAttribute('id');

        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
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
    },
    deleteListItem: function(id) {
      const itemId = `#item-${id}`;
      let item = document.querySelector(itemId);
      item.remove();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove();
      });
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

    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      //If enter key was pressed
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event- Since this gets added dynamically during DOM rendering thats why we have to use event delegation and not bubbling.
    // In event delegation, we gets hold of a parent element in DOM to grab dynamically generated element.
    // Item list is the parent element in this case. But we need to target our icon element else click event will happen on whole parent element(itemList).
    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
  
    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
  
    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);
  
    // Delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
    // Clear button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
  
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
  const itemEditClick = function(e) {
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

  // Update item
  const itemUpdateSubmit = function(e) {
    console.log('Updating....');
    // Get the item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Clear UI Input
    UICtrl.clearEditState();

    e.preventDefault();
  }

  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

     // Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();

     // Add total calories to UI
     UICtrl.showTotalCalories(totalCalories);

    //Clear Edit State
    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Clear All item events
  const clearAllItemsClick = function (e) {
    // Delete All Items from data store
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete all items from UI
    UICtrl.removeItems();

    // Hide the list
    UICtrl.hideList();
    

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