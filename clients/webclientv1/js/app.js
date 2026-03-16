let currentTab = 'customers';
let customersData = [];
let userProfilesData = [];
let addressesData = [];

document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
  loadCustomers();
});

function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  currentTab = tabName;
  
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');

  if (tabName === 'customers') {
    loadCustomers();
  } else if (tabName === 'user-profiles') {
    loadUserProfiles();
  } else if (tabName === 'addresses') {
    loadAddresses();
  }
}

// CUSTOMERS FUNCTIONS
async function loadCustomers() {
  showLoading('customers');
  try {
    customersData = await apiClient.getCustomers();
    displayCustomers(customersData);
    showMessage(
      'customers',
      `Successfully loaded ${customersData.length} customers`,
      'success',
      {
        response: customersData,
        endpoint: 'getCustomers',
        timestamp: new Date().toISOString()
      }
    );
    hideLoading('customers');
  } catch (error) {
    const errorDetails = {
      message: error.message,
      type: error.name,
      status: error.status,
      response: error.response,
      timestamp: new Date().toISOString(),
      endpoint: 'getCustomers'
    };
    showMessage(
      'customers', 
      'Error loading customers: ' + error.message, 
      'error',
      errorDetails
    );
    hideLoading('customers');
    console.error('Load customers error:', errorDetails);
  }
}


function displayCustomers(data) {
  const tbody = document.querySelector('#customers-table tbody');
  tbody.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="no-data">No customers found</td></tr>';
    return;
  }

  data.forEach(customer => {
    const address = customer.address || {};
    const profile = customer.userProfile || {};

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${customer.id || '-'}</td>
      <td>${customer.firstName || '-'}</td>
      <td>${customer.lastName || '-'}</td>
      <td>${customer.email || '-'}</td>
      <td>${address.city || '-'}</td>
      <td>${address.street || '-'}</td>
      <td>${address.zipCode || '-'}</td>
      <td>${profile.nickname || '-'}</td>
      <td>${profile.phoneNumber || '-'}</td>
      <td>${customer.createdAt || '-'}</td>
    `;
    tbody.appendChild(row);
  });
}



// Load addresses and profiles for the dropdowns
async function loadAddressesAndProfiles() {
  try {
    const [addresses, profiles] = await Promise.all([
      apiClient.getAddresses(),
      apiClient.getUserProfiles()
    ]);

    populateAddressDropdown(addresses);
    populateProfileDropdown(profiles);
  } catch (error) {
    console.error('Error loading addresses and profiles:', error);
    showMessage('customers', 'Error loading addresses and profiles', 'error');
  }
}


// Update your initialization function to load addresses and profiles
async function initializeCustomersPage() {
  await loadAddressesAndProfiles(); // Load dropdowns first
  await loadCustomers(); // Then load customers list
  
  // Setup form toggle
  document.getElementById('addCustomerBtn').addEventListener('click', () => {
    document.getElementById('customerForm').classList.remove('hidden');
    document.getElementById('customer-form').reset();
    document.getElementById('customer-id').value = '';
    
    // Reset form submission to create mode
    const form = document.getElementById('customer-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      createCustomer();
    };
  });

  document.getElementById('cancelFormBtn').addEventListener('click', () => {
    document.getElementById('customerForm').classList.add('hidden');
    document.getElementById('customer-form').reset();
  });
}

// Call this on page load
document.addEventListener('DOMContentLoaded', initializeCustomersPage);

// Populate address dropdown
function populateAddressDropdown(addresses) {
  const addressSelect = document.getElementById('customer-address');
  
  // Keep the default option
  const defaultOption = addressSelect.querySelector('option[value=""]');
  addressSelect.innerHTML = '';
  addressSelect.appendChild(defaultOption);

  if (!Array.isArray(addresses) || addresses.length === 0) {
    const noOption = document.createElement('option');
    noOption.value = '';
    noOption.textContent = '-- No addresses available --';
    noOption.disabled = true;
    addressSelect.appendChild(noOption);
    return;
  }

  addresses.forEach(address => {
    const option = document.createElement('option');
    option.value = address.id;
    option.textContent = `${address.street}, ${address.city} ${address.zipCode}`;
    addressSelect.appendChild(option);
  });
}

// Populate profile dropdown
function populateProfileDropdown(profiles) {
  const profileSelect = document.getElementById('customer-profile');
  
  // Keep the default option
  const defaultOption = profileSelect.querySelector('option[value=""]');
  profileSelect.innerHTML = '';
  profileSelect.appendChild(defaultOption);

  if (!Array.isArray(profiles) || profiles.length === 0) {
    return; // No profiles available, just keep the "No Profile" option
  }

  profiles.forEach(profile => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = `${profile.nickname} (${profile.phoneNumber || 'No phone'})`;
    profileSelect.appendChild(option);
  });
}

async function createCustomer() {
  const firstName = document.getElementById('customer-firstName').value;
  const lastName = document.getElementById('customer-lastName').value;
  const email = document.getElementById('customer-email').value;
  const addressId = document.getElementById('customer-address').value;
  const profileId = document.getElementById('customer-profile').value;

  // Validation: Check required fields
  if (!firstName || !lastName || !email || !addressId) {
    showMessage('customers', 'Please fill in all required fields (First Name, Last Name, Email, and Address)', 'error');
    return;
  }

  // Build the request object
  const sentData = {
    firstName,
    lastName,
    email,
    address: parseInt(addressId),
    createdAt: new Date().toISOString()
  };

  // Add userProfile only if selected
  if (profileId) {
    sentData.userProfile = parseInt(profileId);
  }

  try {
    const response = await apiClient.createCustomer(sentData);
    showMessage(
      'customers',
      'Customer created successfully',
      'success',
      {
        sentData: sentData,
        response: response,
        endpoint: 'createCustomer',
        timestamp: new Date().toISOString()
      }
    );
    document.getElementById('customer-form').reset();
    loadAddressesAndProfiles(); // Refresh dropdowns
    loadCustomers(); // Refresh customer list
  } catch (error) {
    const errorDetails = {
      message: error.message,
      type: error.name,
      status: error.status,
      sentData: sentData,
      response: error.response,
      timestamp: new Date().toISOString(),
      endpoint: 'createCustomer'
    };
    showMessage(
      'customers',
      'Error creating customer: ' + error.message,
      'error',
      errorDetails
    );
    console.error('Create customer error:', errorDetails);
  }
}



// Updated editCustomer function (if you have one)
async function editCustomer(customerId) {
  try {
    const customer = await apiClient.getCustomerById(customerId);
    
    // Populate form fields
    document.getElementById('customer-id').value = customer.id;
    document.getElementById('customer-firstName').value = customer.firstName;
    document.getElementById('customer-lastName').value = customer.lastName;
    document.getElementById('customer-email').value = customer.email;
    
    // Set address dropdown
    if (customer.address) {
      document.getElementById('customer-address').value = customer.address.id;
    }
    
    // Set profile dropdown
    if (customer.profile) {
      document.getElementById('customer-profile').value = customer.profile.id;
    }
    
    // Show form
    document.getElementById('customerForm').classList.remove('hidden');
    
    // Change submit button behavior for update
    const form = document.getElementById('customer-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      updateCustomer(customerId);
    };
  } catch (error) {
    showMessage('customers', 'Error loading customer: ' + error.message, 'error');
    console.error('Edit customer error:', error);
  }
}

// Update customer function
async function updateCustomer(customerId) {
  const firstName = document.getElementById('customer-firstName').value;
  const lastName = document.getElementById('customer-lastName').value;
  const email = document.getElementById('customer-email').value;
  const addressId = document.getElementById('customer-address').value;
  const profileId = document.getElementById('customer-profile').value;

  if (!firstName || !lastName || !email || !addressId) {
    showMessage('customers', 'Please fill in all required fields', 'error');
    return;
  }

  const sentData = {
    firstName,
    lastName,
    email,
    address: {
      id: parseInt(addressId)
    }
  };

  if (profileId) {
    sentData.profile = {
      id: parseInt(profileId)
    };
  }

  try {
    const response = await apiClient.updateCustomer(customerId, sentData);
    showMessage('customers', 'Customer updated successfully', 'success');
    document.getElementById('customer-form').reset();
    document.getElementById('customerForm').classList.add('hidden');
    loadCustomers();
  } catch (error) {
    showMessage('customers', 'Error updating customer: ' + error.message, 'error');
    console.error('Update customer error:', error);
  }
}

async function deleteCustomerRecord(id) {
  if (confirm('Are you sure you want to delete this customer?')) {
    try {
      await apiClient.deleteCustomer(id);
      showMessage('customers', 'Customer deleted successfully', 'success');
      loadCustomers();
    } catch (error) {
      const errorDetails = {
        message: error.message,
        type: error.name,
        status: error.status,
        customerId: id,
        timestamp: new Date().toISOString(),
        endpoint: 'deleteCustomer'
      };
      showMessage(
        'customers', 
        'Error deleting customer: ' + error.message, 
        'error',
        errorDetails
      );
      console.error('Delete customer error:', errorDetails);
    }
  }
}

async function searchCustomerByEmail() {
  const email = document.getElementById('search-customer-email').value;
  if (!email) {
    showMessage('customers', 'Please enter an email', 'error');
    return;
  }

  showLoading('customers');
  try {
    const result = await apiClient.findCustomerByEmail(email);
    displayCustomers([result]);
    hideLoading('customers');
  } catch (error) {
    const errorDetails = {
      message: error.message,
      type: error.name,
      status: error.status,
      searchEmail: email,
      timestamp: new Date().toISOString(),
      endpoint: 'findCustomerByEmail'
    };
    showMessage(
      'customers', 
      'Error searching customer: ' + error.message, 
      'error',
      errorDetails
    );
    hideLoading('customers');
    console.error('Search customer error:', errorDetails);
  }
}

async function searchCustomerByLastName() {
  const lastName = document.getElementById('search-customer-lastName').value;
  if (!lastName) {
    showMessage('customers', 'Please enter a last name', 'error');
    return;
  }

  showLoading('customers');
  try {
    const result = await apiClient.findCustomerByLastName(lastName);
    displayCustomers(Array.isArray(result) ? result : [result]);
    hideLoading('customers');
  } catch (error) {
    showMessage('customers', 'Error searching customer: ' + error.message, 'error');
    hideLoading('customers');
  }
}

async function searchCustomerByCity() {
  const city = document.getElementById('search-customer-city').value;
  if (!city) {
    showMessage('customers', 'Please enter a city', 'error');
    return;
  }

  showLoading('customers');
  try {
    const result = await apiClient.findCustomerByCity(city);
    displayCustomers(Array.isArray(result) ? result : [result]);
    hideLoading('customers');
  } catch (error) {
    showMessage('customers', 'Error searching customer: ' + error.message, 'error');
    hideLoading('customers');
  }
}

// USER PROFILES FUNCTIONS
async function loadUserProfiles() {
  showLoading('user-profiles');
  try {
    userProfilesData = await apiClient.getUserProfiles();
    // Transform phone_number to phone for display consistency
    const transformedData = userProfilesData.map(profile => ({
      ...profile,
      phone: profile.phone_number
    }));
    displayUserProfiles(transformedData);
    showMessage(
      'user-profiles',
      `Successfully loaded ${userProfilesData.length} user profiles`,
      'success',
      {
        response: userProfilesData,
        endpoint: 'getUserProfiles',
        timestamp: new Date().toISOString()
      }
    );
    hideLoading('user-profiles');
  } catch (error) {
    const errorDetails = {
      message: error.message,
      type: error.name,
      status: error.status,
      response: error.response,
      timestamp: new Date().toISOString(),
      endpoint: 'getUserProfiles'
    };
    showMessage(
      'user-profiles',
      'Error loading user profiles: ' + error.message,
      'error',
      errorDetails
    );
    hideLoading('user-profiles');
    console.error('Load user profiles error:', errorDetails);
  }
}


function displayUserProfiles(data) {
  const tbody = document.querySelector('#user-profiles-table tbody');
  tbody.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">No user profiles found</td></tr>';
    return;
  }

  data.forEach(profile => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${profile.id || '-'}</td>
      <td>${profile.nickname || '-'}</td>
      <td>${profile.phoneNumber || '-'}</td>
      <td>${profile.bio ? profile.bio.substring(0, 50) + '...' : '-'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-secondary" onclick="editUserProfile(${profile.id})">Edit</button>
          <button class="btn-danger" onclick="deleteUserProfileRecord(${profile.id})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function createUserProfile() {
  const nickname = document.getElementById('profile-nickname').value;
  const phone = document.getElementById('profile-phone').value;
  const bio = document.getElementById('profile-bio').value;

  if (!nickname || !phone) {
    showMessage('user-profiles', 'Please fill in required fields', 'error');
    return;
  }

  const sentData = { nickname, phoneNumber: phone, bio };

  try {
    const response = await apiClient.createUserProfile(sentData);
    showMessage(
      'user-profiles',
      'User profile created successfully',
      'success',
      {
        sentData: sentData,
        response: response,
        endpoint: 'createUserProfile',
        timestamp: new Date().toISOString()
      }
    );
    document.getElementById('profile-form').reset();
    await loadUserProfiles();
    await loadAddressesAndProfiles(); // Reload dropdown options
    await loadCustomers(); // Reload customers table
  } catch (error) {
    const errorDetails = {
      message: error.message,
      type: error.name,
      status: error.status,
      sentData: sentData,
      response: error.response,
      timestamp: new Date().toISOString(),
      endpoint: 'createUserProfile'
    };
    showMessage(
      'user-profiles',
      'Error creating profile: ' + error.message,
      'error',
      errorDetails
    );
    console.error('Create user profile error:', errorDetails);
  }
}

async function deleteUserProfileRecord(id) {
  if (confirm('Are you sure you want to delete this profile?')) {
    try {
      await apiClient.deleteUserProfile(id);
      showMessage('user-profiles', 'User profile deleted successfully', 'success');
      await loadUserProfiles();
      await loadAddressesAndProfiles(); // Reload dropdown options
      await loadCustomers(); // Reload customers table
    } catch (error) {
      showMessage('user-profiles', 'Error deleting profile: ' + error.message, 'error');
    }
  }
}


async function searchUserProfileByNickname() {
  const nickname = document.getElementById('search-profile-nickname').value;
  if (!nickname) {
    showMessage('user-profiles', 'Please enter a nickname', 'error');
    return;
  }

  showLoading('user-profiles');
  try {
    const result = await apiClient.findUserProfileByNickname(nickname);
    displayUserProfiles([result]);
    hideLoading('user-profiles');
  } catch (error) {
    showMessage('user-profiles', 'Error searching profile: ' + error.message, 'error');
    hideLoading('user-profiles');
  }
}

async function searchUserProfileByPhone() {
  const phone = document.getElementById('search-profile-phone').value;
  if (!phone) {
    showMessage('user-profiles', 'Please enter a phone number', 'error');
    return;
  }

  showLoading('user-profiles');
  try {
    const result = await apiClient.searchUserProfileByPhone(phone);
    displayUserProfiles(Array.isArray(result) ? result : [result]);
    hideLoading('user-profiles');
  } catch (error) {
    showMessage('user-profiles', 'Error searching profile: ' + error.message, 'error');
    hideLoading('user-profiles');
  }
}

// ADDRESSES FUNCTIONS
async function loadAddresses() {
  showLoading('addresses');
  try {
    addressesData = await apiClient.getAddresses();
    displayAddresses(addressesData);
    showMessage(
      'addresses',
      `Successfully loaded ${addressesData.length} addresses`,
      'success',
      {
        response: addressesData,
        endpoint: 'getAddresses',
        timestamp: new Date().toISOString()
      }
    );
    hideLoading('addresses');
  } catch (error) {
    const errorDetails = {
      message: error.message,
      type: error.name,
      status: error.status,
      response: error.response,
      timestamp: new Date().toISOString(),
      endpoint: 'getAddresses'
    };
    showMessage(
      'addresses',
      'Error loading addresses: ' + error.message,
      'error',
      errorDetails
    );
    hideLoading('addresses');
    console.error('Load addresses error:', errorDetails);
  }
}

function displayAddresses(data) {
  const tbody = document.querySelector('#addresses-table tbody');
  tbody.innerHTML = '';

  if (!Array.isArray(data) || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No addresses found</td></tr>';
    return;
  }

  data.forEach(address => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${address.id || '-'}</td>
      <td>${address.street || '-'}</td>
      <td>${address.city || '-'}</td>
      <td>${address.zipCode || '-'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-secondary" onclick="editAddress(${address.id})">Edit</button>
          <button class="btn-danger" onclick="deleteAddressRecord(${address.id})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

  async function createAddress() {
    const street = document.getElementById('address-street').value;
    const city = document.getElementById('address-city').value;
    const zipCode = document.getElementById('address-zipCode').value;

    if (!street || !city || !zipCode) {
      showMessage('addresses', 'Please fill in all fields', 'error');
      return;
    }

    const data = { street, city, zipCode};

    try {
      await apiClient.createAddress(data);
      showMessage('addresses', 'Address created successfully', 'success');
      document.getElementById('address-form').reset();
      await loadAddresses();
      await loadAddressesAndProfiles(); // Reload dropdown options
      await loadCustomers(); // Reload customers table
    } catch (error) {
      showMessage('addresses', 'Error creating address: ' + error.message, 'error');
    }
  }

  async function deleteAddressRecord(id) {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await apiClient.deleteAddress(id);
        showMessage('addresses', 'Address deleted successfully', 'success');
        await loadAddresses();
        await loadAddressesAndProfiles(); // Reload dropdown options
        await loadCustomers(); // Reload customers table
      } catch (error) {
        showMessage('addresses', 'Error deleting address: ' + error.message, 'error');
      }
    }
  }

async function searchAddressByZipCode() {
  const zipCode = document.getElementById('search-address-zipCode').value;
  if (!zipCode) {
    showMessage('addresses', 'Please enter a zip code', 'error');
    return;
  }

  showLoading('addresses');
  try {
    const result = await apiClient.findAddressByZipCode(zipCode);
    displayAddresses(Array.isArray(result) ? result : [result]);
    hideLoading('addresses');
  } catch (error) {
    showMessage('addresses', 'Error searching address: ' + error.message, 'error');
    hideLoading('addresses');
  }
}

async function searchAddressByCity() {
  const city = document.getElementById('search-address-city').value;
  if (!city) {
    showMessage('addresses', 'Please enter a city', 'error');
    return;
  }

  showLoading('addresses');
  try {
    const result = await apiClient.findAddressByCity(city);
    displayAddresses(Array.isArray(result) ? result : [result]);
    hideLoading('addresses');
  } catch (error) {
    showMessage('addresses', 'Error searching address: ' + error.message, 'error');
    hideLoading('addresses');
  }
}

async function searchAddressByStreet() {
  const street = document.getElementById('search-address-street').value;
  if (!street) {
    showMessage('addresses', 'Please enter a street', 'error');
    return;
  }

  showLoading('addresses');
  try {
    const result = await apiClient.findAddressByStreet(street);
    displayAddresses(Array.isArray(result) ? result : [result]);
    hideLoading('addresses');
  } catch (error) {
    showMessage('addresses', 'Error searching address: ' + error.message, 'error');
    hideLoading('addresses');
  }
}

// ENHANCED UTILITY FUNCTIONS
function showMessage(tabName, message, type, details = null) {
  const messageEl = document.getElementById(`${tabName}-message`);
  messageEl.textContent = message;
  messageEl.className = `message ${type} show`;
  
  if (type === 'error') {
    messageEl.classList.add('persistent');
    
    if (details) {
      const detailsEl = document.createElement('div');
      detailsEl.className = 'error-details';
      
      // Build the details HTML with sent data and response
      let detailsHtml = '<strong>API Communication Details:</strong>';
      
      if (details.sentData) {
        detailsHtml += `
          <div class="api-section">
            <strong>📤 Sent Payload:</strong>
            <pre>${escapeHtml(JSON.stringify(details.sentData, null, 2))}</pre>
          </div>
        `;
      }
      
      if (details.response) {
        detailsHtml += `
          <div class="api-section">
            <strong>📥 Response Received:</strong>
            <pre>${escapeHtml(JSON.stringify(details.response, null, 2))}</pre>
          </div>
        `;
      }
      
      if (details.endpoint) {
        detailsHtml += `
          <div class="api-section">
            <strong>Endpoint:</strong> ${escapeHtml(details.endpoint)}
          </div>
        `;
      }
      
      if (details.status) {
        detailsHtml += `
          <div class="api-section">
            <strong>Status Code:</strong> ${details.status}
          </div>
        `;
      }
      
      if (details.timestamp) {
        detailsHtml += `
          <div class="api-section">
            <strong>Timestamp:</strong> ${details.timestamp}
          </div>
        `;
      }
      
      detailsHtml += `<button onclick="dismissMessage('${tabName}')" class="btn-close">Dismiss</button>`;
      
      detailsEl.innerHTML = detailsHtml;
      messageEl.appendChild(detailsEl);
    }
  } else if (type === 'success') {
    // Success messages with optional request/response details
    messageEl.classList.remove('persistent');
    
    if (details) {
      const detailsEl = document.createElement('div');
      detailsEl.className = 'success-details';
      
      let detailsHtml = '<strong>✓ Operation Details:</strong>';
      
      if (details.sentData) {
        detailsHtml += `
          <div class="api-section">
            <strong>📤 Sent:</strong>
            <pre>${escapeHtml(JSON.stringify(details.sentData, null, 2))}</pre>
          </div>
        `;
      }
      
      if (details.response) {
        detailsHtml += `
          <div class="api-section">
            <strong>📥 Response:</strong>
            <pre>${escapeHtml(JSON.stringify(details.response, null, 2))}</pre>
          </div>
        `;
      }
      
      detailsEl.innerHTML = detailsHtml;
      messageEl.appendChild(detailsEl);
    }
    
    setTimeout(() => {
      messageEl.classList.remove('show');
    }, 4000);
  }
}


function dismissMessage(tabName) {
  const messageEl = document.getElementById(`${tabName}-message`);
  messageEl.classList.remove('show');
  messageEl.innerHTML = '';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


function showLoading(tabName) {
  const loadingEl = document.getElementById(`${tabName}-loading`);
  loadingEl.classList.add('show');
}

function hideLoading(tabName) {
  const loadingEl = document.getElementById(`${tabName}-loading`);
  loadingEl.classList.remove('show');
}

function editUserProfile(id) {
  alert('Edit functionality for profile ' + id + ' coming soon');
}

function editAddress(id) {
  alert('Edit functionality for address ' + id + ' coming soon');
}
