/**
 * UtilityHelper Class
 * Provides reusable utility functions for string transformations and object operations
 * No external dependencies - can be used standalone
 */
class UtilityHelper {
  /**
   * Convert kebab-case to camelCase
   * @param {string} str - String in kebab-case format
   * @returns {string} String in camelCase format
   * @example
   * kebabToCamel('user-profile') // returns 'userProfile'
   * kebabToCamel('customers') // returns 'customers'
   */
  kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  /**
   * Capitalize first letter of string
   * @param {string} str - Input string
   * @returns {string} String with first letter capitalized
   * @example
   * capitalize('hello') // returns 'Hello'
   * capitalize('world') // returns 'World'
   */
  capitalize(str) {
    if (!str || typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Capitalize first letter of string (alias for capitalize)
   * @param {string} str - Input string
   * @returns {string} String with first letter capitalized
   * @example
   * capitalizeFirstLetter('customer') // returns 'Customer'
   */
  capitalizeFirstLetter(str) {
    return this.capitalize(str);
  }

  /**
   * Get nested property value from object using dot notation
   * Safely handles null/undefined values without throwing errors
   * @param {Object} obj - Object to query
   * @param {string} path - Property path using dot notation
   * @returns {*} Property value or undefined if path doesn't exist
   * @example
   * getNestedValue({user: {address: {city: 'NYC'}}}, 'user.address.city') // returns 'NYC'
   * getNestedValue({user: null}, 'user.name') // returns undefined (no error)
   * getNestedValue({id: 1}, 'name') // returns undefined
   */
  getNestedValue(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UtilityHelper;
}
