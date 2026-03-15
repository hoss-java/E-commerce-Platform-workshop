// Initialize Categories CRUD Manager
let categoriesCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 * This replaces DOMContentLoaded since the script loads dynamically
 */
async function initializeCategoriesCRUD() {
  console.log('📍 initializeCategoriesCRUD');
  const configResponse = await fetch('config/tabs/products/categories.json');
  const config = await configResponse.json();
  
  categoriesCrudManager = new CRUDManager(config, apiClient);
  categoriesCrudManager.initializeTable();
  
  // ✅ ADD THIS LINE - Make it available to TabManager
  window.categoriesCrudManager = categoriesCrudManager;
  
  // Keep this too for onclick handlers
  window.crudManager = categoriesCrudManager;
  
  // Generate form if needed (respects data-auto-generate attribute)
  categoriesCrudManager.generateFormIfNeeded();  

  await categoriesCrudManager.loadAll();
  categoriesCrudManager.setupFormSubmit('create');
}

