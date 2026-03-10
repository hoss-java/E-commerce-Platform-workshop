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
    this.config = config;
    this.apiClient = apiClient;
    this.currentEditingId = null;
    this.data = [];
    this.onLoadComplete = config.onLoadComplete || null; // Store the callback
  }

  /**
   * Convert kebab-case to camelCase
   * @param {string} str - String in kebab-case format
   * @returns {string} String in camelCase format
   */
  kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  /**
   * Load all entities from API
   * @returns {Promise<Array>} Array of entities
   */
  async loadAll() {
    const { tabName, apiEndpoint} = this.config;
    
    console.log('🚀 loadAll() started', { tabName, apiEndpoint });
    
    this.showLoading();
    try {
      const camelCaseEndpoint = this.kebabToCamel(apiEndpoint);
      console.log('🔍 camelCaseEndpoint', camelCaseEndpoint);
      
      const methodName = `get${this.capitalize(camelCaseEndpoint)}`;
      console.log('📍 methodName', methodName);
      
      console.log('⏳ Calling API method...');
      this.data = await this.apiClient[methodName]();
      console.log('✅ API response received', { dataLength: this.data.length, data: this.data });
      
      console.log('📊 Displaying table...');
      this.displayTable(this.data);
      
      console.log('💬 Showing success message...');
      this.showMessage(
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
      this.handleError('Loading', error);
      throw error;
    } finally {
      console.log('🏁 loadAll() finally block - hiding loading');
      this.hideLoading();
    }
  }

  /**
   * Load single entity by ID
   * @param {number} id - Entity ID
   * @returns {Promise<Object>} Entity object
   */
  async loadById(id) {
    try {
      const camelCaseEntity = this.kebabToCamel(this.config.entityName);
      console.error(`[DEBUG] camelCaseEntity #${camelCaseEntity}`);
      const methodName = `get${this.capitalize(camelCaseEntity)}ById`;
      console.error(`[DEBUG] methodName #${methodName}`);
      const entity = await this.apiClient[methodName](id);
      return entity;
    } catch (error) {
      this.handleError('Loading single entity', error);
      throw error;
    }
  }

  /**
   * Display entities in table
   * @param {Array} data - Array of entities to display
   */
  displayTable(data) {
    const { tableId, columns } = this.config;
    const tbody = document.querySelector(`#${tableId} tbody`);
    
    if (!tbody) {
      console.error(`Table tbody not found for #${tableId}`);
      return;
    }

    tbody.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      const colCount = columns.filter(c => c.display !== false).length + 1; // +1 for actions
      tbody.innerHTML = `<tr><td colspan="${colCount}" class="no-data">No ${this.config.entityName}(s) found</td></tr>`;
      return;
    }

    data.forEach(entity => {
      const row = this.createTableRow(entity);
      tbody.appendChild(row);
    });
  }

  /**
   * Create a table row for an entity
   * @param {Object} entity - Entity data
   * @returns {HTMLTableRowElement} Table row element
   */
  createTableRow(entity) {
    const { columns, entityName } = this.config;
    const row = document.createElement('tr');
    
    // Add data columns
    columns.forEach(column => {
      if (column.display === false) return;
      
      const cell = document.createElement('td');
      const value = this.getNestedValue(entity, column.key);
      
      if (column.formatter) {
        const formatterFn = window[column.formatter];
        if (typeof formatterFn === 'function') {
          cell.innerHTML = formatterFn(value, entity);
        } else {
          cell.textContent = value || '-';
        }
      } else {
        cell.textContent = value || '-';
      }
      
      row.appendChild(cell);
    });

    // Add action buttons column
    const actionCell = document.createElement('td');
    actionCell.innerHTML = `
      <div class="action-buttons">
        <button class="btn-secondary" onclick="window.crudManager.editEntity(${entity.id})">Edit</button>
        <button class="btn-danger" onclick="window.crudManager.deleteEntity(${entity.id})">Delete</button>
      </div>
    `;
    row.appendChild(actionCell);

    return row;
  }

  /**
   * Initialize table with dynamic headers and filters
   * Call this after loading config
   */
  initializeTable() {
    this.generateTableHeaders();
    this.generateFilterUI();
    this.loadAll();
  }

  /**
   * Generate table headers dynamically from config
   */
  generateTableHeaders() {
    const { tableId, columns } = this.config;
    const thead = document.querySelector(`#${tableId} thead`);
    
    if (!thead) {
      console.error(`Table thead not found for #${tableId}`);
      return;
    }

    const headerRow = document.createElement('tr');
    
    // Add column headers
    columns.forEach(column => {
      if (column.display === false) return;
      
      const th = document.createElement('th');
      th.textContent = column.label;
      headerRow.appendChild(th);
    });

    // Add Actions header
    const actionTh = document.createElement('th');
    actionTh.textContent = 'Actions';
    headerRow.appendChild(actionTh);

    thead.innerHTML = '';
    thead.appendChild(headerRow);
  }

  /**
   * Generate filter UI dynamically from config
   */
  generateFilterUI() {
    const { columns, enableSearch, entityName } = this.config;
    const filterContainer = document.getElementById(`${entityName}-filter-row-container`);
    
    if (!filterContainer) {
      console.error('Filter container not found');
      return;
    }

    // Don't generate if search is disabled
    if (enableSearch === false) {
      filterContainer.innerHTML = '';
      return;
    }

    filterContainer.innerHTML = '';

    // Get searchable columns
    const searchableColumns = columns.filter(col => col.display !== false && col.searchable !== false);
    
    if (searchableColumns.length === 0) {
      console.warn(`No searchable columns defined for ${entityName}`);
      return;
    }

    // Create search field selector
    const fieldSelect = document.createElement('select');
    fieldSelect.id = `${entityName}-search-field`;
    fieldSelect.className = 'filter-select';
    
    searchableColumns.forEach(column => {
      const option = document.createElement('option');
      option.value = column.key;
      option.textContent = column.label;
      fieldSelect.appendChild(option);
    });

    // Set default search field if specified
    if (this.config.defaultSearchField) {
      fieldSelect.value = this.config.defaultSearchField;
    }

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = `${entityName}-search-input`;
    searchInput.className = 'filter-input';
    searchInput.placeholder = 'Enter search term';
    
    // Allow Enter key to trigger search
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });

    // Create search button
    const searchBtn = document.createElement('button');
    searchBtn.className = 'btn-primary';
    searchBtn.textContent = 'Search';
    searchBtn.onclick = () => this.performSearch();

    // Create clear button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = 'Clear';
    clearBtn.onclick = () => this.clearFilter();

    // Append all elements
    filterContainer.appendChild(fieldSelect);
    filterContainer.appendChild(searchInput);
    filterContainer.appendChild(searchBtn);
    filterContainer.appendChild(clearBtn);
  }

  /**
   * Perform search based on selected field and input value
   */
  async performSearch() {
    const { entityName } = this.config;
    const fieldSelect = document.getElementById(`${entityName}-search-field`);
    const searchInput = document.getElementById(`${entityName}-search-input`);

    if (!fieldSelect || !searchInput) {
      console.error('Filter elements not found');
      return;
    }

    const searchField = fieldSelect.value;
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
      this.showMessage('Please enter a search term', 'warning');
      return;
    }

    try {
      // Filter from cached data (client-side)
      const filteredData = this.filterData(this.data, searchField, searchTerm);
      
      this.displayTable(filteredData);
      
      if (filteredData.length === 0) {
        this.showMessage(`No ${this.config.entityName}(s) found matching "${searchTerm}"`, 'info');
      } else {
        this.showMessage(`Found ${filteredData.length} result(s)`, 'success');
      }
    } catch (error) {
      this.showMessage(`Search error: ${error.message}`, 'error');
    }
  }

  /**
   * Filter data based on field and search term
   * @param {Array} data - Data to filter
   * @param {string} field - Field to search in
   * @param {string} term - Search term
   * @returns {Array} Filtered data
   */
  filterData(data, field, term) {
    const lowerTerm = term.toLowerCase();
    
    return data.filter(item => {
      const value = this.getNestedValue(item, field);
      
      if (value === null || value === undefined) {
        return false;
      }
      
      return String(value).toLowerCase().includes(lowerTerm);
    });
  }

  /**
   * Clear filter and reload all data
   */
  async clearFilter() {
    const { entityName } = this.config;
    const fieldSelect = document.getElementById(`${entityName}-search-field`);
    const searchInput = document.getElementById(`${entityName}-search-input`);

    if (fieldSelect) {
      fieldSelect.value = this.config.defaultSearchField || fieldSelect.options[0].value;
    }
    if (searchInput) {
      searchInput.value = '';
    }

    try {
      this.displayTable(this.data);
      this.showMessage('Filter cleared', 'info');
    } catch (error) {
      this.showMessage(`Error clearing filter: ${error.message}`, 'error');
    }
  }

  /**
   * Get nested property value from object
   * Supports dot notation (e.g., 'address.city')
   * @param {Object} obj - Object to query
   * @param {string} path - Property path
   * @returns {*} Property value or undefined
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Edit entity - load data and populate form
   * @param {number} id - Entity ID
   */
  async editEntity(id) {
    try {
      const entity = await this.loadById(id);
      this.currentEditingId = id;
      this.populateForm(entity);
      this.showForm();
      this.setupFormSubmit('update');
    } catch (error) {
      this.showMessage(`Error loading ${this.config.entityName}: ${error.message}`, 'error');
    }
  }

  /**
   * Create new entity
   * @param {Object} formData - Form data object
   */
  async createEntity(formData) {
    try {
      this.validateFormData(formData);
      
      const sentData = this.prepareEntityData(formData, 'create');
      const camelCaseEntity = this.kebabToCamel(this.config.entityName);
      const methodName = `create${this.capitalize(camelCaseEntity)}`;
      
      const response = await this.apiClient[methodName](sentData);
      
      this.showMessage(
        `${this.capitalize(camelCaseEntity)} created successfully`,
        'success',
        {
          sentData,
          response,
          endpoint: methodName,
          timestamp: new Date().toISOString()
        }
      );
      
      this.resetForm();
      this.hideForm();
      await this.loadAll();
    } catch (error) {
      this.handleError('Creating', error, formData);
    }
  }

  /**
   * Update existing entity
   * @param {number} id - Entity ID
   * @param {Object} formData - Form data object
   */
  async updateEntity(id, formData) {
    try {
      this.validateFormData(formData);
      
      const sentData = this.prepareEntityData(formData, 'update');
      const camelCaseEntity = this.kebabToCamel(this.config.entityName);
      const methodName = `update${this.capitalize(camelCaseEntity)}`;
      
      const response = await this.apiClient[methodName](id, sentData);
      
      this.showMessage(
        `${this.capitalize(camelCaseEntity)} updated successfully`,
        'success',
        {
          sentData,
          response,
          endpoint: methodName,
          timestamp: new Date().toISOString()
        }
      );
      
      this.resetForm();
      this.hideForm();
      this.currentEditingId = null;
      await this.loadAll();
    } catch (error) {
      this.handleError('Updating', error, formData);
    }
  }

  /**
   * Delete entity
   * @param {number} id - Entity ID
   */
  async deleteEntity(id) {
    const camelCaseEntity = this.kebabToCamel(this.config.entityName);
    
    if (!confirm(`Are you sure you want to delete this ${camelCaseEntity}?`)) {
      return;
    }

    try {
      const methodName = `delete${this.capitalize(camelCaseEntity)}`;
      await this.apiClient[methodName](id);
      
      this.showMessage(
        `${this.capitalize(camelCaseEntity)} deleted successfully`,
        'success'
      );
      
      await this.loadAll();
    } catch (error) {
      this.handleError('Deleting', error, { id });
    }
  }

  /**
   * Populate form with entity data
   * @param {Object} entity - Entity data
   */
  populateForm(entity) {
    const { formFields } = this.config;
    
    formFields.forEach(field => {
      const input = document.getElementById(field.id);
      if (!input) return;
      
      const value = this.getNestedValue(entity, field.key);
      
      if (field.type === 'select') {
        // For relationship fields, get the ID
        input.value = value?.id || value || '';
      } else {
        input.value = value || '';
      }
    });
  }

  /**
   * Validate form data based on field definitions
   * @param {Object} formData - Form data to validate
   * @throws {Error} If validation fails
   */
  validateFormData(formData) {
    const { formFields, entityName } = this.config;
    const requiredFields = formFields.filter(f => f.required);
    
    const missingFields = requiredFields.filter(f => !formData[f.key] || formData[f.key] === '');
    
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(f => f.label).join(', ');
      throw new Error(`Please fill in required fields: ${fieldNames}`);
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
   * Get form data from form inputs
   * @returns {Object} Form data object
   */
  getFormData() {
    const { formFields } = this.config;
    const formData = {};
    
    formFields.forEach(field => {
      const input = document.getElementById(field.id);
      if (input) {
        formData[field.key] = input.value;
      }
    });
    
    return formData;
  }

  /**
   * Reset form to empty state
   */
  resetForm() {
    const formId = `${this.config.entityName}-form`;
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
    }
    this.currentEditingId = null;
  }

  /**
   * Show form container
   */
  showForm() {
    const camelCaseEntity = this.kebabToCamel(this.config.entityName);
    const formContainerId = this.config.formContainerId || `${camelCaseEntity}Form`;
    console.log('🔍 showForm() called');
    console.log('   formContainerId:', formContainerId);
    console.log('   config.formContainerId:', this.config.formContainerId);
    console.log('   config.entityName:', this.config.entityName);
    
    const formContainer = document.getElementById(formContainerId);
    console.log('   formContainer element found:', !!formContainer);
    console.log('   formContainer:', formContainer);
    
    if (formContainer) {
      console.log('   Current classes:', formContainer.className);
      formContainer.classList.remove('hidden');
      console.log('   Classes after remove:', formContainer.className);
    } else {
      console.error(`   ❌ ERROR: Element with id="${formContainerId}" not found in DOM!`);
    }
  }

  /**
   * Hide form container
   */
  hideForm() {
    const camelCaseEntity = this.kebabToCamel(this.config.entityName);
    const formContainerId = this.config.formContainerId || `${camelCaseEntity}Form`;
    console.log('🔍 hideForm() called');
    console.log('   formContainerId:', formContainerId);
    
    const formContainer = document.getElementById(formContainerId);
    console.log('   formContainer element found:', !!formContainer);
    
    if (formContainer) {
      console.log('   Current classes:', formContainer.className);
      formContainer.classList.add('hidden');
      console.log('   Classes after add:', formContainer.className);
    } else {
      console.error(`   ❌ ERROR: Element with id="${formContainerId}" not found in DOM!`);
    }
  }


  /**
   * Show loading indicator
   */
  showLoading() {
    const loadingEl = document.getElementById(`${this.config.tabName}-loading`);
    if (loadingEl) {
      loadingEl.classList.add('show');
    }
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    const loadingEl = document.getElementById(`${this.config.tabName}-loading`);
    if (loadingEl) {
      loadingEl.classList.remove('show');
    }
  }

  /**
   * Show message to user as a toast notification
   * @param {string} message - Message text
   * @param {string} type - 'success', 'error', 'info'
   * @param {Object} details - Optional details for logging
   */
  showMessage(message, type = 'info', details = null) {
    // Get or create toast container
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon"></span>
      <span class="toast-message">${this.escapeHtml(message)}</span>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;

    // Add to container
    container.appendChild(toast);

    // Handle close button
    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener('click', removeToast);

    // Log details if provided
    if (details) {
      console.log(`[${type.toUpperCase()}]`, details);
    }

    // Auto-dismiss after 5 seconds (only if not an error)
    if (type !== 'error') {
      setTimeout(removeToast, 5000);
    }
  }

  /**
   * Handle and log errors
   * @param {string} operation - Operation name (e.g., 'Creating', 'Updating')
   * @param {Error} error - Error object
   * @param {Object} context - Additional context data
   */
  handleError(operation, error, context = {}) {
    const errorDetails = {
      message: error.message,
      type: error.name,
      status: error.status,
      response: error.response,
      context,
      timestamp: new Date().toISOString(),
      operation
    };

    this.showMessage(
      `Error ${operation.toLowerCase()} ${this.config.entityName}: ${error.message}`,
      'error',
      errorDetails
    );

    console.error(`${operation} error:`, errorDetails);
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Capitalize first letter of string
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Setup form submission handler
   * @param {string} mode - 'create' or 'update'
   */
  setupFormSubmit(mode = 'create') {
    const formId = `${this.config.entityName}-form`;
    console.log(`📋 setupFormSubmit() - mode: ${mode}, looking for form: ${formId}`);
    
    const form = document.getElementById(formId);
    console.log(`📋 Form element found?`, form ? 'YES' : 'NO');
    
    if (!form) {
      console.warn(`⚠️  Form not found with ID: ${formId}`);
      const allForms = Array.from(document.querySelectorAll('form')).map(f => ({
        id: f.id,
        name: f.name,
        class: f.className
      }));
      console.log(`📋 Available forms in DOM:`, allForms);
      console.log(`📋 Total forms found:`, allForms.length);
      return;
    }

    console.log(`📋 Setting up form submission handler for mode: ${mode}`);
    
    form.onsubmit = (e) => {
      console.log(`📋 Form submitted - mode: ${mode}`);
      e.preventDefault();
      console.log(`📋 Form submission prevented`);
      
      const formData = this.getFormData();
      console.log(`📋 Form data retrieved:`, formData);
      
      if (mode === 'create') {
        console.log(`📋 Creating new entity with data:`, formData);
        this.createEntity(formData);
      } else if (mode === 'update') {
        console.log(`📋 Updating entity ID ${this.currentEditingId} with data:`, formData);
        this.updateEntity(this.currentEditingId, formData);
      } else {
        console.warn(`⚠️  Unknown mode: ${mode}`);
      }
    };
    
    console.log(`✅ Form submission handler attached successfully`);
  }

  /**
   * Generate form HTML from config and inject into the page
   * Checks if form already exists and respects data-auto-generate attribute
   * Default behavior: assumes data-auto-generate="false" (manual form)
   */
  generateFormIfNeeded() {
    const formId = this.config.formId || `${this.config.entityName}-form`;
    const containerId = this.config.formContainerId;
    
    console.log(`📋 generateFormIfNeeded() - checking form: ${formId}`);
    
    // Check if form already exists in DOM
    const existingForm = document.getElementById(formId);
    if (existingForm) {
      console.log(`✅ Form already exists in DOM with ID: ${formId}`);
      
      // Check data-auto-generate attribute (default: false)
      const autoGenerate = existingForm.getAttribute('data-auto-generate');
      if (autoGenerate !== 'true') {
        console.log(`✅ Form is manual (data-auto-generate is not 'true') - using existing form`);
        return;
      }
      
      console.log(`📋 Form marked for auto-generation (data-auto-generate="true") - regenerating`);
      // Continue to regenerate if explicitly marked as true
    }
    
    // Check if container exists
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`⚠️  Form container not found with ID: ${containerId}`);
      return;
    }
    
    // Check container's data-auto-generate attribute (default: false)
    const autoGenerate = container.getAttribute('data-auto-generate');
    if (autoGenerate !== 'true') {
      console.log(`⚠️  Container is manual (data-auto-generate is not 'true') - skipping generation`);
      return;
    }
    
    console.log(`📋 Generating form dynamically for: ${this.config.entityName}`);
    
    // Build form HTML from config
    const formHTML = this.buildFormHTML(formId);
    
    // Inject into container
    container.innerHTML = formHTML;
    console.log(`✅ Form injected into container: ${containerId}`);
  }

  /**
   * Build form HTML string from formFields config
   * @param {string} formId - The ID for the form element
   * @returns {string} HTML string for the form
   */
  buildFormHTML(formId) {
    const formTitle = this.capitalizeFirstLetter(this.config.entityName);
    
    // Build form fields from config
    const fieldsHTML = this.config.formFields
      .map(field => this.buildFormFieldHTML(field))
      .join('\n');
    
    // Build form buttons
    const buttonsHTML = this.buildFormButtonsHTML();
    
    // Combine into complete form
    const formHTML = `
      <form id="${formId}">
        <h3>Create New ${formTitle}</h3>
        ${fieldsHTML}
        ${buttonsHTML}
      </form>
    `;
    
    return formHTML;
  }

  /**
   * Build form action buttons HTML
   * @returns {string} HTML string for buttons
   */
  buildFormButtonsHTML() {
    const buttonsHTML = `
      <div class="button-group">
        <button type="submit" class="btn-primary">Save ${this.capitalizeFirstLetter(this.config.entityName)}</button>
        <button type="button" class="btn-secondary" onclick="${this.config.crudId}CrudManager.toggleFormVisibility(false);">
          Cancel
        </button>
      </div>
    `;
    return buttonsHTML;
  }

  /**
   * Build individual form field HTML based on field type
   * @param {Object} field - Field configuration object
   * @returns {string} HTML string for the field
   */
  buildFormFieldHTML(field) {
    const {
      id,
      label,
      type = 'text',
      required = false,
      relationshipKey = null
    } = field;

    let fieldHTML = '';

    switch (type) {
      case 'text':
      case 'email':
      case 'number':
      case 'password':
      case 'tel':
      case 'url':
        fieldHTML = this.buildInputField(field);
        break;

      case 'textarea':
        fieldHTML = this.buildTextareaField(field);
        break;

      case 'select':
        fieldHTML = this.buildSelectField(field);
        break;

      case 'checkbox':
        fieldHTML = this.buildCheckboxField(field);
        break;

      case 'radio':
        fieldHTML = this.buildRadioField(field);
        break;

      case 'date':
      case 'time':
      case 'datetime-local':
        fieldHTML = this.buildDateTimeField(field);
        break;

      default:
        console.warn(`⚠️ Unknown field type: ${type} - defaulting to text input`);
        fieldHTML = this.buildInputField(field);
    }

    return fieldHTML;
  }

  /**
   * Build standard input field (text, email, number, etc.)
   * @param {Object} field - Field configuration
   * @returns {string} HTML string
   */
  buildInputField(field) {
    const {
      id,
      label,
      type = 'text',
      placeholder = '',
      required = false,
      pattern = '',
      maxLength = '',
      minLength = ''
    } = field;

    let attributes = `type="${type}" id="${id}" name="${field.key}"`;
    
    if (placeholder) attributes += ` placeholder="${placeholder}"`;
    if (required) attributes += ` required`;
    if (pattern) attributes += ` pattern="${pattern}"`;
    if (maxLength) attributes += ` maxlength="${maxLength}"`;
    if (minLength) attributes += ` minlength="${minLength}"`;

    return `
      <div class="form-group">
        <label for="${id}">${label}${required ? ' <span class="required">*</span>' : ''}</label>
        <input ${attributes}>
      </div>
    `;
  }

  /**
   * Build textarea field
   * @param {Object} field - Field configuration
   * @returns {string} HTML string
   */
  buildTextareaField(field) {
    const {
      id,
      label,
      placeholder = '',
      required = false,
      maxLength = '',
      rows = 4
    } = field;

    let attributes = `id="${id}" name="${field.key}" rows="${rows}"`;
    
    if (placeholder) attributes += ` placeholder="${placeholder}"`;
    if (required) attributes += ` required`;
    if (maxLength) attributes += ` maxlength="${maxLength}"`;

    return `
      <div class="form-group">
        <label for="${id}">${label}${required ? ' <span class="required">*</span>' : ''}</label>
        <textarea ${attributes}></textarea>
      </div>
    `;
  }

  /**
   * Build select dropdown field
   * @param {Object} field - Field configuration
   * @returns {string} HTML string
   */
  buildSelectField(field) {
    const {
      id,
      label,
      required = false,
      relationshipKey = null,
      options = []
    } = field;

    let attributes = `id="${id}" name="${field.key}"`;
    
    if (required) attributes += ` required`;

    // Build option elements
    let optionsHTML = '<option value="">-- Select an option --</option>';
    
    if (relationshipKey) {
      // If relationshipKey exists, options will be loaded dynamically
      optionsHTML += `<!-- Options will be loaded from API: ${relationshipKey} -->`;
    } else if (options && options.length > 0) {
      // Use provided options array
      optionsHTML = options
        .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
        .join('\n');
    }

    return `
      <div class="form-group">
        <label for="${id}">${label}${required ? ' <span class="required">*</span>' : ''}</label>
        <select ${attributes}>
          ${optionsHTML}
        </select>
      </div>
    `;
  }

  /**
   * Build checkbox field
   * @param {Object} field - Field configuration
   * @returns {string} HTML string
   */
  buildCheckboxField(field) {
    const {
      id,
      label,
      required = false
    } = field;

    let attributes = `type="checkbox" id="${id}" name="${field.key}"`;
    
    if (required) attributes += ` required`;

    return `
      <div class="form-group checkbox-group">
        <input ${attributes}>
        <label for="${id}">${label}</label>
      </div>
    `;
  }

  /**
   * Build radio button field
   * @param {Object} field - Field configuration
   * @returns {string} HTML string
   */
  buildRadioField(field) {
    const {
      id,
      label,
      required = false,
      options = []
    } = field;

    if (!options || options.length === 0) {
      console.warn(`⚠️ Radio field "${label}" has no options defined`);
      return '';
    }

    const radioHTML = options
      .map((opt, index) => {
        const radioId = `${id}-${index}`;
        return `
          <div class="radio-option">
            <input type="radio" id="${radioId}" name="${field.key}" value="${opt.value}"${required ? ' required' : ''}>
            <label for="${radioId}">${opt.label}</label>
          </div>
        `;
      })
      .join('\n');

    return `
      <div class="form-group radio-group">
        <label>${label}${required ? ' <span class="required">*</span>' : ''}</label>
        ${radioHTML}
      </div>
    `;
  }

  /**
   * Build date/time field
   * @param {Object} field - Field configuration
   * @returns {string} HTML string
   */
  buildDateTimeField(field) {
    const {
      id,
      label,
      type = 'date',
      required = false,
      min = '',
      max = ''
    } = field;

    let attributes = `type="${type}" id="${id}" name="${field.key}"`;
    
    if (required) attributes += ` required`;
    if (min) attributes += ` min="${min}"`;
    if (max) attributes += ` max="${max}"`;

    return `
      <div class="form-group">
        <label for="${id}">${label}${required ? ' <span class="required">*</span>' : ''}</label>
        <input ${attributes}>
      </div>
    `;
  }


  /**
   * Capitalize first letter of string
   * @param {string} str - Input string
   * @returns {string} String with first letter capitalized
   */
  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Toggle visibility of form and add button
   * @param {boolean} show - True to show form and hide button, false to hide form and show button
   */
  toggleFormVisibility(show) {
    const camelCaseEntity = this.kebabToCamel(this.config.entityName);
    console.log(`🔍 toggleFormVisibility - entityName: ${this.config.entityName}, camelCase: ${camelCaseEntity}`);
    
    const formContainerId = this.config.formContainerId || `${camelCaseEntity}Form`;
    const buttonGroupId = this.config.buttonGroupId || `add${this.capitalize(camelCaseEntity)}ButtonGroup`;
    
    console.log(`🔍 Looking for buttonGroupId: ${buttonGroupId}`);
    
    // Check what button groups exist
    const allButtonGroups = document.querySelectorAll('[id*="ButtonGroup"]');
    console.log(`🔍 ALL button groups in DOM:`, Array.from(allButtonGroups).map(el => el.id));
    
    const form = document.getElementById(formContainerId);
    const buttonGroup = document.getElementById(buttonGroupId);
    
    console.log(`🔍 Button group found?`, buttonGroup ? 'YES' : 'NO');
    
    if (show) {
      if (form) form.classList.remove('hidden');
      if (buttonGroup) buttonGroup.classList.add('hidden');
      this.showForm();
      this.resetForm();
      this.setupFormSubmit('create');
    } else {
      if (form) form.classList.add('hidden');
      if (buttonGroup) buttonGroup.classList.remove('hidden');
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CRUDManager;
}
