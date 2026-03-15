// Initialize Promotions CRUD Manager
let promotionsCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 * This replaces DOMContentLoaded since the script loads dynamically
 */
async function initializePromotionsCRUD() {
  console.log('🎯 initializePromotionsCRUD');
  const configResponse = await fetch('config/tabs/promotions/promotions.json');
  const config = await configResponse.json();
  
  promotionsCrudManager = new CRUDManager(config, apiClient);
  promotionsCrudManager.initializeTable();
  
  // ✅ ADD THIS LINE - Make it available to TabManager
  window.promotionsCrudManager = promotionsCrudManager;
  
  // Keep this too for onclick handlers
  window.crudManager = promotionsCrudManager;

  // Generate form if needed (respects data-auto-generate attribute)
  promotionsCrudManager.generateFormIfNeeded();  

  await promotionsCrudManager.loadAll();
  promotionsCrudManager.setupFormSubmit('create');
}
