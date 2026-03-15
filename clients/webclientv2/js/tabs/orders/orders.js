// Initialize Orders CRUD Manager
let ordersCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 * This replaces DOMContentLoaded since the script loads dynamically
 */
async function initializeOrdersCRUD() {
  try {
    console.log('📍 initializeOrdersCRUD');
    const configResponse = await fetch('config/tabs/orders/orders.json');
    const config = await configResponse.json();
    
    ordersCrudManager = new CRUDManager(config, apiClient);
    ordersCrudManager.initializeTable();
    
    // ✅ ADD THIS LINE - Make it available to TabManager
    window.ordersCrudManager = ordersCrudManager;
    
    // Keep this too for onclick handlers
    window.crudManager = ordersCrudManager;
    
    // Generate form if needed (respects data-auto-generate attribute)
    ordersCrudManager.generateFormIfNeeded();  

   // Setup callbacks
    setupOrdersCallbacks();

    await ordersCrudManager.loadAll();
    ordersCrudManager.setupFormSubmit('create');
    // Load dropdown options
    await loadOrdersCustomersDropdownOptions();  
  } catch (error) {
    console.error('❌ initializeOrdersCRUD - ERROR OCCURRED', {
      message: error.message,
      stack: error.stack,
      error
    });
    throw error;
  }
}

/**
 * Setup Orders callbacks for orders module
 */
function setupOrdersCallbacks() {
  console.log('📍 Setting up orders callbacks');
  
  // Callback function that runs after orders are loaded
  window.onOrdersLoaded = async (data) => {
    console.log('✅ orders loaded successfully!', data);
    // Load dropdown options (orderss)
    await loadOrdersCustomersDropdownOptions();
  };
}

/**
 * Load dropdown options (customers) for order form
 */
async function loadOrdersCustomersDropdownOptions() {
  try {
    const [customers] = await Promise.all([
      apiClient.getCustomers(),
    ]);

    populateOrdersCustomerDropdown(customers);
  } catch (error) {
    console.error('Error loading dropdown options:', error);
    ordersCrudManager.showMessage('Error loading dropdown options', 'error');
  }
}

/**
 * Populate customer dropdown
 * @param {Array} customers - Array of customer objects
 */
function populateOrdersCustomerDropdown(customers) {
  const customerSelect = document.getElementById('order-customer');
  const defaultOption = customerSelect.querySelector('option[value=""]');
  
  customerSelect.innerHTML = '';
  customerSelect.appendChild(defaultOption);

  if (!Array.isArray(customers) || customers.length === 0) {
    return;
  }

  customers.forEach(customer => {
    const option = document.createElement('option');
    option.value = customer.id;
    option.textContent = `${customer.firstName}`;
    customerSelect.appendChild(option);
  });
}