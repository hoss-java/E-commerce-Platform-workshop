/**
 * DataManager Class
 * Handles all API communication and data caching for CRUD operations
 * Manages data lifecycle: loading, creating, updating, deleting entities
 */
class DataManager {
  /**
   * Initialize DataManager
   * @param {Object} config - Entity configuration object
   * @param {string} config.entityName - Name of entity (e.g., 'customer')
   * @param {string} config.apiEndpoint - API endpoint name (e.g., 'customers')
   * @param {Function} config.onLoadComplete - Optional callback after loading data
   * @param {Object} apiClient - API client instance for making requests
   * @param {Object} utilityHelper - UtilityHelper instance for utilities
   * @param {Object} uiController - UIController instance for user feedback
   */
  constructor(config, apiClient, utilityHelper, uiController) {
    this.config = config;
    this.apiClient = apiClient;
    this.utilityHelper = utilityHelper;
    this.uiController = uiController;
    
    this.data = [];
    this.currentEditingId = null;
  }

  /**
   * Load all entities from API
   * @returns {Promise<Array>} Array of entities
   */
  async loadAll() {
    const { tabName, apiEndpoint } = this.config;
    
    console.log('🚀 loadAll() started', { tabName, apiEndpoint });
    
    this.uiController.showLoading();
    try {
      const camelCaseEndpoint = this.utilityHelper.kebabToCamel(apiEndpoint);
      console.log('🔍 camelCaseEndpoint', camelCaseEndpoint);
      
      const methodName = `get${this.utilityHelper.capitalize(camelCaseEndpoint)}`;
      console.log('📍 methodName', methodName);
      
      console.log(`⏳ Calling API method...`);
      console.debug(`[DEBUG] methodName #${methodName}`);
      this.data = await this.apiClient[methodName]();
      console.log('✅ API response received', { dataLength: this.data.length, data: this.data });
      
      this.uiController.showMessage(
        `Successfully loaded ${this.data.length} ${this.config.entityName}(s)`,
        'success',
        {
          response: this.data,
          endpoint: methodName,
          timestamp: new Date().toISOString()
        }
      );

      // ✨ Call the onLoadComplete callback if it's defined
      if (this.config.onLoadComplete) {
        const callbackFunctionName = this.config.onLoadComplete;
        const callbackFunction = window[callbackFunctionName];
        
        if (typeof callbackFunction === 'function') {
          console.log(`🔔 Executing ${callbackFunctionName} callback...`);
          await callbackFunction(this.data);
        } else {
          console.warn(`⚠️ Callback function '${callbackFunctionName}' not found in window`);
        }
      }      

      console.log('✨ loadAll() completed successfully');
      return this.data;
    } catch (error) {
      console.log('❌ Error in loadAll()', error);
      this.uiController.handleError('Loading', error);
      throw error;
    } finally {
      console.log('🏁 loadAll() finally block - hiding loading');
      this.uiController.hideLoading();
    }
  }

  /**
   * Load single entity by ID
   * @param {number} id - Entity ID
   * @returns {Promise<Object>} Entity object
   */
  async loadById(id) {
    try {
      const camelCaseEntity = this.utilityHelper.kebabToCamel(this.config.entityName);
      console.error(`[DEBUG] camelCaseEntity #${camelCaseEntity}`);
      const methodName = `get${this.utilityHelper.capitalize(camelCaseEntity)}ById`;
      console.error(`[DEBUG] methodName #${methodName}`);
      const entity = await this.apiClient[methodName](id);
      return entity;
    } catch (error) {
      this.uiController.handleError('Loading single entity', error);
      throw error;
    }
  }

  /**
   * Create new entity
   * @param {Object} formData - Form data object
   * @returns {Promise<Object>} Created entity response
   */
  async createEntity(formData) {
    try {
      const camelCaseEntity = this.utilityHelper.kebabToCamel(this.config.entityName);
      const methodName = `create${this.utilityHelper.capitalize(camelCaseEntity)}`;
      
      const sentData = this.prepareEntityData(formData, 'create');
      console.debug(`[DEBUG] methodName #${methodName} - ${sentData}`);
      const response = await this.apiClient[methodName](sentData);
      
      this.uiController.showMessage(
        `${this.utilityHelper.capitalizeFirstLetter(camelCaseEntity)} created successfully`,
        'success',
        {
          sentData,
          response,
          endpoint: methodName,
          timestamp: new Date().toISOString()
        }
      );
      
      // Refresh data cache
      await this.loadAll();
      return response;
    } catch (error) {
      this.uiController.handleError('Creating', error, formData);
      throw error;
    }
  }

  /**
   * Update existing entity
   * @param {number} id - Entity ID
   * @param {Object} formData - Form data object
   * @returns {Promise<Object>} Updated entity response
   */
  async updateEntity(id, formData) {
    try {
      const camelCaseEntity = this.utilityHelper.kebabToCamel(this.config.entityName);
      const methodName = `update${this.utilityHelper.capitalize(camelCaseEntity)}`;
      
      const sentData = this.prepareEntityData(formData, 'update');
      console.debug(`[DEBUG] methodName #${methodName} - ${sentData}`);
      const response = await this.apiClient[methodName](id, sentData);
      
      this.uiController.showMessage(
        `${this.utilityHelper.capitalizeFirstLetter(camelCaseEntity)} updated successfully`,
        'success',
        {
          sentData,
          response,
          endpoint: methodName,
          timestamp: new Date().toISOString()
        }
      );
      
      // Refresh data cache
      await this.loadAll();
      this.currentEditingId = null;
      return response;
    } catch (error) {
      this.uiController.handleError('Updating', error, formData);
      throw error;
    }
  }

  /**
   * Delete entity
   * @param {number} id - Entity ID
   * @returns {Promise<void>}
   */
  async deleteEntity(id) {
    const camelCaseEntity = this.utilityHelper.kebabToCamel(this.config.entityName);
    
    if (!confirm(`Are you sure you want to delete this ${camelCaseEntity}?`)) {
      return;
    }

    try {
      const methodName = `delete${this.utilityHelper.capitalize(camelCaseEntity)}`;
      console.debug(`[DEBUG] methodName #${methodName} - ${id}`);
      await this.apiClient[methodName](id);
      
      this.uiController.showMessage(
        `${this.utilityHelper.capitalizeFirstLetter(camelCaseEntity)} deleted successfully`,
        'success'
      );
      
      // Refresh data cache
      await this.loadAll();
    } catch (error) {
      this.uiController.handleError('Deleting', error, { id });
      throw error;
    }
  }

  /**
   * Prepare entity data for API submission
   * Handles field mapping and relationship conversion
   * @param {Object} formData - Raw form data
   * @param {string} operation - 'create' or 'update'
   * @returns {Object} Prepared data for API
   */
  prepareEntityData(formData, operation = 'create') {
    const { formFields } = this.config;
    const sentData = {};
    
    formFields.forEach(field => {
      const value = formData[field.key];
      
      if (value === null || value === undefined || value === '') {
        return;
      }

      if (field.type === 'select') {
        // Handle relationship fields
        if (field.relationshipKey) {
          sentData[field.relationshipKey] = {
            id: parseInt(value)
          };
        } else {
          sentData[field.key] = parseInt(value);
        }
      } else if (field.type === 'number') {
        sentData[field.key] = parseInt(value);
      } else {
        sentData[field.key] = value;
      }
    });

    // Add timestamp for create operation
    if (operation === 'create') {
      sentData.createdAt = new Date().toISOString();
    }

    return sentData;
  }

  /**
   * Get cached data
   * @returns {Array} Current data array
   */
  getData() {
    console.debug(this.data);
    return this.data;
  }

  /**
   * Set editing ID
   * @param {number} id - Entity ID being edited
   */
  setCurrentEditingId(id) {
    this.currentEditingId = id;
  }

  /**
   * Get current editing ID
   * @returns {number|null} Current editing ID or null
   */
  getCurrentEditingId() {
    return this.currentEditingId;
  }

  /**
   * Clear current editing ID
   */
  clearCurrentEditingId() {
    this.currentEditingId = null;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataManager;
}
