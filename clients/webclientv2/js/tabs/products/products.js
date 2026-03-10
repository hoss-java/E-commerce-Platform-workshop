// Initialize Products CRUD Manager
let productsCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 * This replaces DOMContentLoaded since the script loads dynamically
 */
async function initializeProductsCRUD() {
  console.log('📍 initializeProductsCRUD');
  try {
    // Load product configuration
    const configResponse = await fetch('config/tabs/products/products.json');
    const config = await configResponse.json();
    
    productsCrudManager = new CRUDManager(config, apiClient);
    productsCrudManager.initializeTable();
    
    // ✅ ADD THIS LINE - Make it available to TabManager
    window.productsCrudManager = productsCrudManager;
    
    // Keep this too for onclick handlers
    window.crudManager = productsCrudManager;

    // Generate form if needed (respects data-auto-generate attribute)
    productsCrudManager.generateFormIfNeeded();    

    // Setup callbacks
    setupCategoriesCallbacks();

    await productsCrudManager.loadAll();
    productsCrudManager.setupFormSubmit('create');

    // Load dropdown options
    await loadCategoriesDropdownOptions();  
  } catch (error) {
    console.error('❌ initializeCustomersCRUD - ERROR OCCURRED', {
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
function setupCategoriesCallbacks() {
  console.log('📍 Setting up categories callbacks');
  
  // Callback function that runs after categories are loaded
  window.onCategoriesLoaded = async (data) => {
    console.log('✅ categories loaded successfully!', data);
    // Load dropdown options (categories)
    await loadCategoriesDropdownOptions();
  };
}

/**
 * Load dropdown options (addresses and profiles) for category form
 */
async function loadCategoriesDropdownOptions() {
  try {
    const [categories] = await Promise.all([
      apiClient.getCategories(),
    ]);

    populateCategoryDropdown(categories);
  } catch (error) {
    console.error('Error loading dropdown options:', error);
    productsCrudManager.showMessage('Error loading dropdown options', 'error');
  }
}

/**
 * Populate category dropdown
 * @param {Array} categories - Array of category objects
 */
function populateCategoryDropdown(categories) {
  const categorySelect = document.getElementById('product-category');
  const defaultOption = categorySelect.querySelector('option[value=""]');
  
  categorySelect.innerHTML = '';
  categorySelect.appendChild(defaultOption);

  if (!Array.isArray(categories) || categories.length === 0) {
    return;
  }

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = `${category.name}`;
    categorySelect.appendChild(option);
  });
}