// Initialize User Profiles CRUD Manager
let userProfilesCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 * This replaces DOMContentLoaded since the script loads dynamically
 */
async function initializeUserProfilesCRUD() {
  console.log('📍 initializeUserProfilesCRUD');
  // Load configuration
  const configResponse = await fetch('config/tabs/customers/user-profiles.json');
  const config = await configResponse.json();
  
  // Initialize CRUD Manager
  userProfilesCrudManager = new CRUDManager(config, apiClient);
  userProfilesCrudManager.initializeTable();
  
  // Make it available to TabManager
  window.userProfilesCrudManager = userProfilesCrudManager;
  
  // Store globally for onclick handlers in HTML
  window.crudManager = userProfilesCrudManager;
  
  // Generate form if needed (respects data-auto-generate attribute)
  userProfilesCrudManager.generateFormIfNeeded();  

  // Setup custom formatters
  setupUserProfileFormatters();
  
  // Load initial data
  await userProfilesCrudManager.loadAll();
  userProfilesCrudManager.setupFormSubmit('create');
}

/**
 * Setup custom formatters for user profiles
 */
function setupUserProfileFormatters() {
  console.log('📍 add truncateBio');
  // Formatter for truncating bio
  window.truncateBio = (bio) => {
    if (!bio) return '-';
    const result = bio.length > 50 ? bio.substring(0, 50) + '...' : bio;
    return result;
  };  
}
