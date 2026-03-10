/**
 * Generic CRUD Operations Manager
 * Handles all CRUD operations (Create, Read, Update, Delete) for any entity
 * Configuration-driven approach using entity config objects
 */
/**
 * Generic CRUD Operations Manager
 * Handles all CRUD operations (Create, Read, Update, Delete) for any entity
 * Configuration-driven approach using entity config objects
 */

class CRUDManager {
  /**
   * Initialize CRUD Manager with entity configuration
   * @param {Object} config - Entity configuration object
   * @param {string} config.entityName - Name of entity (e.g., 'customer')
   * @param {string} config.apiEndpoint - API endpoint name (e.g., 'customers')
   * @param {string} config.tableId - HTML table ID (e.g., 'customers-table')
   * @param {string} config.tabName - Tab identifier (e.g., 'customers')
   * @param {Array} config.columns - Array of column definitions
   * @param {Array} config.formFields - Array of form field definitions
   * @param {Object} apiClient - API client instance
   */
  constructor(config, apiClient) {
    console.log('🔧 CRUDManager.constructor() - START', {
      entityName: config.entityName,
      apiEndpoint: config.apiEndpoint,
      tableId: config.tableId,
      tabName: config.tabName,
      columnsCount: config.columns?.length || 0,
      formFieldsCount: config.formFields?.length || 0
    });

    try {
      this.config = config;
      this.apiClient = apiClient;
      this.currentEditingId = null;
      this.data = [];
      this.onLoadComplete = config.onLoadComplete || null;

      this.utilityHelper = new UtilityHelper();
      this.uiController = new UIController(config);
      this.dataManager = new DataManager(config, apiClient, this.utilityHelper, this.uiController);
      this.tableRenderer = new TableRenderer(config, this.utilityHelper, this.dataManager);
      this.formBuilder = new FormBuilder(config, this.utilityHelper, this.uiController);
      this.searchFilter = new SearchFilter(config, this.utilityHelper, this.uiController);
      this.formManager = new FormManager(config, this.utilityHelper, this.uiController, this.dataManager, this.tableRenderer);
      console.log('✨ CRUDManager.constructor() - COMPLETED SUCCESSFULLY');
    } catch (error) {
      console.error('❌ CRUDManager.constructor() - ERROR OCCURRED', {
        message: error.message,
        stack: error.stack,
        error
      });
      throw error;
    }
  }

  /**
   * Toggle visibility of form and add button
   * @param {boolean} show - True to show form and hide button, false to hide form and show button
   */
  toggleFormVisibility(show) {
    console.log('🔄 CRUDManager.toggleFormVisibility() - START', { show });

    try {
      console.log('📋 Delegating to FormManager.toggleFormVisibility()');
      this.formManager.toggleFormVisibility(show);
    } catch (error) {
      console.error('❌ CRUDManager.toggleFormVisibility() - ERROR OCCURRED', {
        show,
        message: error.message,
        stack: error.stack,
        error
      });
      throw error;
    }
  }

  /**
   * Initialize table with dynamic headers
   * Call this after loading config
   */
  initializeTable() {
    try {
      this.searchFilter.generateFilterUI();
      this.tableRenderer.initializeTable();
    } catch (error) {
      console.error('❌ CRUDManager.initializeTable() - ERROR OCCURRED', {
        tableId: this.config.tableId,
        message: error.message,
        stack: error.stack,
        error
      });
      throw error;
    }
  }

  /**
   * Generate form HTML from config and inject into the page
   * Checks if form already exists and respects data-auto-generate attribute
   * Default behavior: assumes data-auto-generate="false" (manual form)
   */
  generateFormIfNeeded() {
    try {
      this.formBuilder.generateFormIfNeeded();
    } catch (error) {
      console.error('❌ CRUDManager.generateFormIfNeeded() - ERROR OCCURRED', {
        entityName: this.config.entityName,
        message: error.message,
        stack: error.stack,
        error
      });
      throw error;
    }
  }

  /**
   * Display entities in table
   * @param {Array} data - Array of entities to display
   */
  displayTable(data) {
    this.tableRenderer.displayTable(data);
  }

  /**
   * Load all entities from API
   * @returns {Promise<Array>} Array of entities
   */
  async loadAll() {
    try {
      this.dataManager.loadAll()
        .then(() => {
          this.tableRenderer.refresh();
        })
        .catch(error => {
          console.error(`Failed to refresh:`, error);
        });
    } catch (error) {
      console.error('❌ CRUDManager.loadAll() - ERROR OCCURRED', {
        entityName: this.config.entityName,
        apiEndpoint: this.config.apiEndpoint,
        message: error.message,
        stack: error.stack,
        error
      });
      throw error;
    }
  }

  /**
   * Setup form submission handler
   * @param {string} mode - 'create' or 'update'
   * @param {Function} onSubmitSuccess - Callback on successful submission
   */
  setupFormSubmit(mode = 'create', onSubmitSuccess) {
    try {
      this.formManager.setupFormSubmit(mode, onSubmitSuccess);
    } catch (error) {
      console.error('❌ CRUDManager.setupFormSubmit() - ERROR OCCURRED', {
        mode,
        entityName: this.config.entityName,
        message: error.message,
        stack: error.stack,
        error
      });
      throw error;
    }
  }

  /**
   * Edit entity - load data and populate form
   * @param {number} id - Entity ID
   * @param {Function} onEditComplete - Callback when edit is loaded
   */
  async editEntity(id, onEditComplete) {
    this.formManager.editEntity(id, onEditComplete)
      .then(() => {
        this.tableRenderer.refresh();
      })
      .catch(error => {
        console.error(`Failed to edit entity ${id}:`, error);
      });  
  }

  /**
   * Delete entity
   * @param {number} id - Entity ID
   * @returns {void}
   */
  deleteEntity(id) {
    this.dataManager.deleteEntity(id)
      .then(() => {
        this.tableRenderer.refresh();
      })
      .catch(error => {
        console.error(`Failed to delete entity ${id}:`, error);
      });
  }
}
// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CRUDManager;
}
