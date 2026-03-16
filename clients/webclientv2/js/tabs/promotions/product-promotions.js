// Initialize Product Promotions CRUD Manager
let productPromotionsCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 * This replaces DOMContentLoaded since the script loads dynamically
 */
async function initializeProductPromotionsCRUD() {
  try {
    console.log('🔗 initializeProductPromotionsCRUD');
    const configResponse = await fetch('config/tabs/promotions/product-promotions.json');
    const config = await configResponse.json();
    
    productPromotionsCrudManager = new CRUDManager(config, apiClient);
    productPromotionsCrudManager.initializeTable();
    
    // ✅ ADD THIS LINE - Make it available to TabManager
    window.productPromotionsCrudManager = productPromotionsCrudManager;
    
    // Keep this too for onclick handlers
    window.crudManager = productPromotionsCrudManager;

    // Generate form if needed (respects data-auto-generate attribute)
    productPromotionsCrudManager.generateFormIfNeeded();    

    // Setup callbacks
    setupProductPromotionsCallbacks();

    await productPromotionsCrudManager.loadAll();
    productPromotionsCrudManager.setupFormSubmit('create');
    
    // Load dropdown options
    await loadProductPromotionsDropdownOptions();  
  } catch (error) {
    console.error('❌ initializeProductPromotionsCRUD - ERROR OCCURRED', {
      message: error.message,
      stack: error.stack,
      error
    });
    throw error;
  }
}

/**
 * Setup product promotions callbacks
 */
function setupProductPromotionsCallbacks() {
  console.log('📍 Setting up product promotions callbacks');
  
  // Callback function that runs after product promotions are loaded
  window.onProductPromotionsLoaded = async (data) => {
    console.log('✅ product promotions loaded successfully!', data);
    // Load dropdown options (products and promotions)
    await loadProductPromotionsDropdownOptions();
  };
}

/**
 * Load dropdown options (products and promotions) for product promotion form
 */
async function loadProductPromotionsDropdownOptions() {
  try {
    const [products, promotions] = await Promise.all([
      apiClient.getProducts(),
      apiClient.getPromotions(),
    ]);

    populateProductPromotionsProductDropdown(products);
    populateProductPromotionsPromotionDropdown(promotions);
  } catch (error) {
    console.error('Error loading dropdown options:', error);
    productPromotionsCrudManager.showMessage('Error loading dropdown options', 'error');
  }
}

/**
 * Populate product dropdown
 * @param {Array} products - Array of product objects
 */
function populateProductPromotionsProductDropdown(products) {
  const productSelect = document.getElementById('product-promotion-product');
  const defaultOption = productSelect.querySelector('option[value=""]');
  
  productSelect.innerHTML = '';
  if (defaultOption) {
    productSelect.appendChild(defaultOption);
  } else {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Select a product';
    productSelect.appendChild(option);
  }

  if (!Array.isArray(products) || products.length === 0) {
    return;
  }

  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = product.name;
    productSelect.appendChild(option);
  });
}

/**
 * Populate promotion dropdown
 * @param {Array} promotions - Array of promotion objects
 */
function populateProductPromotionsPromotionDropdown(promotions) {
  const promotionSelect = document.getElementById('product-promotion-promotion');
  const defaultOption = promotionSelect.querySelector('option[value=""]');
  
  promotionSelect.innerHTML = '';
  if (defaultOption) {
    promotionSelect.appendChild(defaultOption);
  } else {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Select a promotion';
    promotionSelect.appendChild(option);
  }

  if (!Array.isArray(promotions) || promotions.length === 0) {
    return;
  }

  promotions.forEach(promotion => {
    const option = document.createElement('option');
    option.value = promotion.id;
    option.textContent = promotion.code;
    promotionSelect.appendChild(option);
  });
}
