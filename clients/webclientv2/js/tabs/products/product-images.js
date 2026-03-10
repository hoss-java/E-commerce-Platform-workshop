// Initialize Product images CRUD Manager
let productImagesCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 * This replaces DOMContentLoaded since the script loads dynamically
 */
async function initializeProductImagesCRUD() {
  try {
    console.log('📍 initializeProductImagesCRUD');
    const configResponse = await fetch('config/tabs/products/product-images.json');
    const config = await configResponse.json();
    
    productImagesCrudManager = new CRUDManager(config, apiClient);
    productImagesCrudManager.initializeTable();
    
    // ✅ ADD THIS LINE - Make it available to TabManager
    window.productImagesCrudManager = productImagesCrudManager;
    
    // Keep this too for onclick handlers
    window.crudManager = productImagesCrudManager;

    // Generate form if needed (respects data-auto-generate attribute)
    productImagesCrudManager.generateFormIfNeeded();    

   // Setup callbacks
    setupProductsCallbacks();

    await productImagesCrudManager.loadAll();
    productImagesCrudManager.setupFormSubmit('create');
    // Load dropdown options
    await loadProductsDropdownOptions();  
  } catch (error) {
    console.error('❌ initializeProductImagesCRUD - ERROR OCCURRED', {
      message: error.message,
      stack: error.stack,
      error
    });
    throw error;
  }
}

/**
 * Setup category callbacks for categories module
 */
function setupProductsCallbacks() {
  console.log('📍 Setting up products callbacks');
  
  // Callback function that runs after categories are loaded
  window.onProductsLoaded = async (data) => {
    console.log('✅ products loaded successfully!', data);
    // Load dropdown options (categories)
    await loadProductsDropdownOptions();
  };
}

/**
 * Load dropdown options (addresses and profiles) for category form
 */
async function loadProductsDropdownOptions() {
  try {
    const [products] = await Promise.all([
      apiClient.getProducts(),
    ]);

    populateProductDropdown(products);
  } catch (error) {
    console.error('Error loading dropdown options:', error);
    productsCrudManager.showMessage('Error loading dropdown options', 'error');
  }
}

/**
 * Populate product dropdown
 * @param {Array} products - Array of product objects
 */
function populateProductDropdown(products) {
  const productSelect = document.getElementById('product-image-product');
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