/**
 * Customers Module
 * Initializes CRUD manager for customers and handles customer-specific operations
 */

let customersCrudManager = null;

/**
 * Initialize function called by tab-manager when tab is loaded
 */
/**
 * Initialize function called by tab-manager when tab is loaded
 */
async function initializeCustomersCRUD() {
  console.log('📍 initializeCustomersCRUD - START');
  
  try {
    // Load customer configuration
    const configResponse = await fetch('config/tabs/customers/customers.json');  
    const config = await configResponse.json();
    
    // Initialize CRUDManager
    customersCrudManager = new CRUDManager(config, apiClient);
    
    // Initialize table
    customersCrudManager.initializeTable();

    // Make available to TabManager and onclick handlers
    window.customersCrudManager = customersCrudManager;

    // Generate form if needed
    customersCrudManager.generateFormIfNeeded();
    
    // Setup callbacks
    setupCustomersCallbacks();

    // Load all data
    await customersCrudManager.loadAll();
    
    // Setup form submission
    customersCrudManager.setupFormSubmit('create');

    // Load dropdown options
    await loadCustomersDropdownOptions();  
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
 * Setup custom callbacks for customers module
 */
function setupCustomersCallbacks() {
  console.log('📍 Setting up customers callbacks');
  
  // Callback function that runs after customers are loaded
  window.onCustomersLoaded = async (data) => {
    console.log('✅ Customers loaded successfully!', data);
    // Load dropdown options (addresses and profiles)
    await loadCustomersDropdownOptions();
  };
}

/**
 * Load dropdown options (addresses and profiles) for customer form
 */
async function loadCustomersDropdownOptions() {
  try {
    const [addresses, profiles] = await Promise.all([
      apiClient.getAddresses(),
      apiClient.getUserProfiles()
    ]);

    populateAddressDropdown(addresses);
    populateProfileDropdown(profiles);
  } catch (error) {
    console.error('Error loading dropdown options:', error);
    customersCrudManager.showMessage('Error loading dropdown options', 'error');
  }
}

/**
 * Populate address dropdown
 * @param {Array} addresses - Array of address objects
 */
function populateAddressDropdown(addresses) {
  const addressSelect = document.getElementById('customer-address');
  const defaultOption = addressSelect.querySelector('option[value=""]');
  
  addressSelect.innerHTML = '';
  addressSelect.appendChild(defaultOption);

  if (!Array.isArray(addresses) || addresses.length === 0) {
    return;
  }

  addresses.forEach(address => {
    const option = document.createElement('option');
    option.value = address.id;
    option.textContent = `${address.street}, ${address.city} ${address.zipCode}`;
    addressSelect.appendChild(option);
  });
}

/**
 * Populate profile dropdown
 * @param {Array} profiles - Array of profile objects
 */
function populateProfileDropdown(profiles) {
  const profileSelect = document.getElementById('customer-profile');
  const defaultOption = profileSelect.querySelector('option[value=""]');
  
  profileSelect.innerHTML = '';
  profileSelect.appendChild(defaultOption);

  if (!Array.isArray(profiles) || profiles.length === 0) {
    return;
  }

  profiles.forEach(profile => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = `${profile.nickname} (${profile.phoneNumber || 'No phone'})`;
    profileSelect.appendChild(option);
  });
}
