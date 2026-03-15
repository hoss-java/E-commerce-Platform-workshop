const API_BASE_URL = 'proxy.php';

const apiClient = {
  // Helper function to make proxy requests
  makeRequest: async (path, method = 'GET', data = null) => {
    // Build URL to proxy.php with correct path
    const url = new URL('proxy.php', window.location.href);
    url.searchParams.append('path', path);

    const fullUrl = url.toString();
    
    // Log API call
    let logMsg = `[API] ${method} ${path}`;
    if (data) {
      logMsg += ` - Data: ${JSON.stringify(data)}`;
    }
    console.log(logMsg);

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
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      let result = null;
      if (response.status !== 204 && response.headers.get('content-length') !== '0') {
        result = await response.json();
      }

      console.log(`[API] Response ${method} ${path} - Status: ${response.status}`);
      console.debug(`[DEBUG][API] Response Data:`, JSON.stringify(result, null, 2));  // ← ADD THIS
      return result;
      
    } catch (error) {
      console.log(`[API] Error ${method} ${path} - ${error.message}`);
      throw error;
    }
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
  },

  // CATEGURIES
  getCategories: async () => {
    return apiClient.makeRequest('categories', 'GET');
  },

  createCategory: async (data) => {
    return apiClient.makeRequest('categories', 'POST', data);
  },

  getCategoryById: async (id) => {
    return apiClient.makeRequest(`categories/${id}`, 'GET');
  },

  updateCategory: async (id, data) => {
    return apiClient.makeRequest(`categories/${id}`, 'PUT', data);
  },

  deleteCategory: async (id) => {
    return apiClient.makeRequest(`categories/${id}`, 'DELETE');
  },

  findCategoryByName: async (name) => {
    return apiClient.makeRequest(`categories/name/${name}`, 'GET');
  },

  // PRODUCTS
  getProducts: async () => {
    return apiClient.makeRequest('products', 'GET');
  },

  createProduct: async (data) => {
    return apiClient.makeRequest('products', 'POST', data);
  },

  getProductById: async (id) => {
    return apiClient.makeRequest(`products/${id}`, 'GET');
  },

  updateProduct: async (id, data) => {
    return apiClient.makeRequest(`products/${id}`, 'PUT', data);
  },

  deleteProduct: async (id) => {
    return apiClient.makeRequest(`products/${id}`, 'DELETE');
  },

  findProductByName: async (name) => {
    return apiClient.makeRequest(`products/name/${name}`, 'GET');
  },

  findProductByPrice: async (price) => {
    return apiClient.makeRequest(`products/price/${price}`, 'GET');
  },

  // PRODUCT-IMAGES
  getProductImages: async () => {
    return apiClient.makeRequest('images/all', 'GET');
  },

  createProductImage: async (data) => {
    return apiClient.makeRequest('images', 'POST', data);
  },

  getProductImageById: async (id) => {
    return apiClient.makeRequest(`images/by-id/${id}`, 'GET');
  },

  updateProductImage: async (id, data) => {
    return apiClient.makeRequest(`images/by-id/${id}`, 'PUT', data);
  },

  deleteProductImage: async (id) => {
    return apiClient.makeRequest(`images/by-id/${id}`, 'DELETE');
  },

  getProductImagesByProductId: async (productId) => {
    return apiClient.makeRequest(`images/products/${productId}`, 'GET');
  },

  addProductImage: async (productId, imageUrl) => {
    const data = { imageUrl };
    return apiClient.makeRequest(`images/products/${productId}`, 'POST', data);
  },

  addProductImages: async (productId, imageUrls) => {
    const data = { imageUrls };
    return apiClient.makeRequest(`images/products/${productId}/bulk`, 'POST', data);
  },

  deleteProductImageByUrl: async (productId, imageUrl) => {
    return apiClient.makeRequest(
      `images/products/${productId}?imageUrl=${encodeURIComponent(imageUrl)}`,
      'DELETE'
    );
  },

  deleteAllProductImages: async (productId) => {
    return apiClient.makeRequest(`images/products/${productId}/all`, 'DELETE');
  },

  updateProductImageUrl: async (productId, oldUrl, newUrl) => {
    const data = { oldUrl, newUrl };
    return apiClient.makeRequest(`images/products/${productId}`, 'PUT', data);
  },

  // PROMOTIONS
  getPromotions: async () => {
    return apiClient.makeRequest('promotions', 'GET');
  },

  createPromotion: async (data) => {
    return apiClient.makeRequest('promotions', 'POST', data);
  },

  getPromotionById: async (id) => {
    return apiClient.makeRequest(`promotions/${id}`, 'GET');
  },

  updatePromotion: async (id, data) => {
    return apiClient.makeRequest(`promotions/${id}`, 'PUT', data);
  },

  deletePromotion: async (id) => {
    return apiClient.makeRequest(`promotions/${id}`, 'DELETE');
  },

  getPromotionByCode: async (code) => {
    return apiClient.makeRequest(`promotions/code/${code}`, 'GET');
  },

  // PRODUCT-PROMOTIONS
  getProductPromotions: async () => {
    return apiClient.makeRequest('product-promotions/all', 'GET');
  },

  createProductPromotion: async (data) => {
    return apiClient.makeRequest('product-promotions', 'POST', data);
  },

  getProductPromotionById: async (id) => {
    return apiClient.makeRequest(`product-promotions/by-id/${id}`, 'GET');
  },

  updateProductPromotion: async (id, data) => {
    return apiClient.makeRequest(`product-promotions/by-id/${id}`, 'PUT', data);
  },

  deleteProductPromotion: async (id) => {
    return apiClient.makeRequest(`product-promotions/by-id/${id}`, 'DELETE');
  },

  // ORDERS
  getOrders: async () => {
    return apiClient.makeRequest('orders', 'GET');
  },

  createOrder: async (data) => {
    return apiClient.makeRequest('orders', 'POST', data);
  },

  getOrderById: async (id) => {
    return apiClient.makeRequest(`orders/${id}`, 'GET');
  },

  updateOrder: async (id, data) => {
    return apiClient.makeRequest(`orders/${id}`, 'PUT', data);
  },

  deleteOrder: async (id) => {
    return apiClient.makeRequest(`orders/${id}`, 'DELETE');
  },

  getOrdersByCustomerId: async (customerId) => {
    return apiClient.makeRequest(`orders/customer/${customerId}`, 'GET');
  },

  getOrdersByStatus: async (status) => {
    return apiClient.makeRequest(`orders/status/${status}`, 'GET');
  },

  getOrdersByDateRange: async (startDate, endDate) => {
    return apiClient.makeRequest(`orders/date-range?startDate=${startDate}&endDate=${endDate}`, 'GET');
  },

  getOrdersByCustomerIdAndStatus: async (customerId, status) => {
    return apiClient.makeRequest(`orders/customer/${customerId}/status/${status}`, 'GET');
  },

};
