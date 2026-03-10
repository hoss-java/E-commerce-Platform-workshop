/**
 * Application Initialization
 * Define all groups and tabs here
 */

const groupsConfig = [
  {
    id: 'customers',
    label: 'Customers',
    tabs: [
      { id: 'customers', label: 'Customers' },
      { id: 'user-profiles', label: 'User Profiles' },
      { id: 'addresses', label: 'Addresses' },
    ]
  },
  {
    id: 'products',
    label: 'Products',
    tabs: [
      { id: 'categories', label: 'Categories' },
      { id: 'products', label: 'Products' },
      { id: 'product-images', label: 'Product images' },
    ]
//  },
//  {
//    id: 'orders',
//    label: 'Orders',
//    tabs: [
//      { id: 'orders', label: 'Orders' }    ]
  }
];

// Initialize when DOM is ready AND tabManager is available
document.addEventListener('DOMContentLoaded', async () => {
  // Wait for tabManager to be defined
  let attempts = 0;
  while (!window.tabManager && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (window.tabManager) {
    await window.tabManager.initializeGroups(groupsConfig);
  } else {
    console.error('❌ TabManager failed to load');
  }
});

