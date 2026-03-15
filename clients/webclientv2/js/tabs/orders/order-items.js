// Initialize Order Items CRUD Manager
let orderItemsCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 * This replaces DOMContentLoaded since the script loads dynamically
 */
async function initializeOrderItemsCRUD() {
  try {
    console.log('📍 initializeOrderItemsCRUD');
    const configResponse = await fetch('config/tabs/orders/order-items.json');
    const config = await configResponse.json();
    
    orderItemsCrudManager = new CRUDManager(config, apiClient);
    orderItemsCrudManager.initializeTable();
    
    // ✅ ADD THIS LINE - Make it available to TabManager
    window.orderItemsCrudManager = orderItemsCrudManager;
    
    // Keep this too for onclick handlers
    window.crudManager = orderItemsCrudManager;

    // Generate form if needed (respects data-auto-generate attribute)
    orderItemsCrudManager.generateFormIfNeeded();    

    // Setup callbacks
    setupOrdersAndProductsCallbacks();

    await orderItemsCrudManager.loadAll();
    orderItemsCrudManager.setupFormSubmit('create');
    // Load dropdown options
    await loadOrdersAndProductsDropdownOptions();  
  } catch (error) {
    console.error('❌ initializeOrderItemsCRUD - ERROR OCCURRED', {
      message: error.message,
      stack: error.stack,
      error
    });
    throw error;
  }
}

/**
 * Setup orders and products callbacks for order items module
 */
function setupOrdersAndProductsCallbacks() {
  console.log('📍 Setting up orders and products callbacks');
  
  // Callback function that runs after orders and products are loaded
  window.onOrderItemsLoaded = async (data) => {
    console.log('✅ orders and products loaded successfully!', data);
    // Load dropdown options (orders and products)
    await loadOrdersAndProductsDropdownOptions();
  };
}

/**
 * Load dropdown options (orders and products) for order item form
 */
async function loadOrdersAndProductsDropdownOptions() {
  try {
    const [orders, products] = await Promise.all([
      apiClient.getOrders(),
      apiClient.getProducts(),
    ]);

    populateOrderDropdown(orders);
    populateProductDropdown(products);
  } catch (error) {
    console.error('Error loading dropdown options:', error);
    orderItemsCrudManager.showMessage('Error loading dropdown options', 'error');
  }
}

/**
 * Populate order dropdown
 * @param {Array} orders - Array of order objects
 */
function populateOrderDropdown(orders) {
  const orderSelect = document.getElementById('order-item-order');
  const defaultOption = orderSelect.querySelector('option[value=""]');
  
  orderSelect.innerHTML = '';
  orderSelect.appendChild(defaultOption);

  if (!Array.isArray(orders) || orders.length === 0) {
    return;
  }

  orders.forEach(order => {
    const option = document.createElement('option');
    option.value = order.id;
    option.textContent = `Order #${order.id} - ${order.status}`;
    orderSelect.appendChild(option);
  });
}

/**
 * Populate product dropdown
 * @param {Array} products - Array of product objects
 */
function populateProductDropdown(products) {
  const productSelect = document.getElementById('order-item-product');
  const defaultOption = productSelect.querySelector('option[value=""]');
  
  productSelect.innerHTML = '';
  productSelect.appendChild(defaultOption);

  if (!Array.isArray(products) || products.length === 0) {
    return;
  }

  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name}`;
    productSelect.appendChild(option);
  });
}
