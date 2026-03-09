const API_BASE_URL = 'proxy.php';

const apiClient = {
  // Helper function to make proxy requests
  makeRequest: async (path, method = 'GET', data = null) => {
    // Build URL to proxy.php with correct path
    const url = new URL('proxy.php', window.location.href);
    url.searchParams.append('path', path);

    const fullUrl = url.toString();
    console.log('📡 Calling proxy:', fullUrl);
    console.log('📍 Backend path:', path);
    console.log('🔧 Method:', method);
    if (data) {
      console.log('📦 Data sent:', data);
    }

    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, options);
      
      console.log('✅ Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📥 Response received:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error calling:', fullUrl);
      console.error('❌ Error details:', error);
      throw error;
    }
  },


  // Usage:
  getCustomers: async () => {
    return apiClient.makeRequest('/customers', 'GET');
  },

  // CUSTOMERS
  getCustomers: async () => {
    return apiClient.makeRequest('customers', 'GET');
  },

  createCustomer: async (data) => {
    return apiClient.makeRequest('customers', 'POST', data);
  },

  getCustomerById: async (id) => {
    return apiClient.makeRequest(`customers/${id}`, 'GET');
  },

  updateCustomer: async (id, data) => {
    return apiClient.makeRequest(`customers/${id}`, 'PUT', data);
  },

  deleteCustomer: async (id) => {
    return apiClient.makeRequest(`customers/${id}`, 'DELETE');
  },

  findCustomerByEmail: async (email) => {
    return apiClient.makeRequest(`customers/email/${email}`, 'GET');
  },

  findCustomerByLastName: async (lastName) => {
    return apiClient.makeRequest(`customers/last-name/${lastName}`, 'GET');
  },

  findCustomerByCity: async (city) => {
    return apiClient.makeRequest(`customers/city/${city}`, 'GET');
  },

  searchCustomerEmail: async (keyword) => {
    return apiClient.makeRequest(`customers/search/email?keyword=${keyword}`, 'GET');
  },

  findCustomersCreatedAfter: async (date) => {
    return apiClient.makeRequest(`customers/created-after?date=${date}`, 'GET');
  },

  findCustomersCreatedBetween: async (startDate, endDate) => {
    return apiClient.makeRequest(`customers/created-between?startDate=${startDate}&endDate=${endDate}`, 'GET');
  },

  countCustomersByCity: async (city) => {
    return apiClient.makeRequest(`customers/count/city/${city}`, 'GET');
  },

  checkCustomerExists: async (email) => {
    return apiClient.makeRequest(`customers/exists/${email}`, 'GET');
  },

  // USER PROFILES
  getUserProfiles: async () => {
    return apiClient.makeRequest('user-profiles', 'GET');
  },

  createUserProfile: async (data) => {
    return apiClient.makeRequest('user-profiles', 'POST', data);
  },

  getUserProfileById: async (id) => {
    return apiClient.makeRequest(`user-profiles/${id}`, 'GET');
  },

  updateUserProfile: async (id, data) => {
    return apiClient.makeRequest(`user-profiles/${id}`, 'PUT', data);
  },

  deleteUserProfile: async (id) => {
    return apiClient.makeRequest(`user-profiles/${id}`, 'DELETE');
  },

  findUserProfileByNickname: async (nickname) => {
    return apiClient.makeRequest(`user-profiles/nickname/${nickname}`, 'GET');
  },

  searchUserProfileByPhone: async (phonePartial) => {
    return apiClient.makeRequest(`user-profiles/search/phone?phonePartial=${phonePartial}`, 'GET');
  },

  getUserProfilesWithBio: async () => {
    return apiClient.makeRequest('user-profiles/with-bio', 'GET');
  },

  findUserProfileByNicknamePrefix: async (prefix) => {
    return apiClient.makeRequest(`user-profiles/nickname-prefix/${prefix}`, 'GET');
  },

  countUserProfilesByPhonePrefix: async (prefix) => {
    return apiClient.makeRequest(`user-profiles/count/phone-prefix/${prefix}`, 'GET');
  },

  // ADDRESSES
  getAddresses: async () => {
    return apiClient.makeRequest('addresses', 'GET');
  },

  createAddress: async (data) => {
    return apiClient.makeRequest('addresses', 'POST', data);
  },

  getAddressById: async (id) => {
    return apiClient.makeRequest(`addresses/${id}`, 'GET');
  },

  updateAddress: async (id, data) => {
    return apiClient.makeRequest(`addresses/${id}`, 'PUT', data);
  },

  deleteAddress: async (id) => {
    return apiClient.makeRequest(`addresses/${id}`, 'DELETE');
  },

  findAddressByZipCode: async (zipCode) => {
    return apiClient.makeRequest(`addresses/zip-code/${zipCode}`, 'GET');
  },

  findAddressByCity: async (city) => {
    return apiClient.makeRequest(`addresses/city/${city}`, 'GET');
  },

  findAddressByStreet: async (street) => {
    return apiClient.makeRequest(`addresses/street/${street}`, 'GET');
  },

  countAddressesByZipCode: async (zipCode) => {
    return apiClient.makeRequest(`addresses/count/zip-code/${zipCode}`, 'GET');
  },

  findAddressesByZipCodePrefix: async (prefix) => {
    return apiClient.makeRequest(`addresses/zip-code-prefix/${prefix}`, 'GET');
  }
};
