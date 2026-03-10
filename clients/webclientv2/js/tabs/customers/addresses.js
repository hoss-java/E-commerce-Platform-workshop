// Initialize Addresses CRUD Manager
let addressesCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 * This replaces DOMContentLoaded since the script loads dynamically
 */
async function initializeAddressesCRUD() {
  console.log('📍 initializeAddressesCRUD');
  const configResponse = await fetch('config/tabs/customers/addresses.json');
  const config = await configResponse.json();
  
  addressesCrudManager = new CRUDManager(config, apiClient);
  addressesCrudManager.initializeTable();
  
  // ✅ ADD THIS LINE - Make it available to TabManager
  window.addressesCrudManager = addressesCrudManager;
  
  // Keep this too for onclick handlers
  window.crudManager = addressesCrudManager;

  // Generate form if needed (respects data-auto-generate attribute)
  addressesCrudManager.generateFormIfNeeded();  

  await addressesCrudManager.loadAll();
  addressesCrudManager.setupFormSubmit('create');
}

