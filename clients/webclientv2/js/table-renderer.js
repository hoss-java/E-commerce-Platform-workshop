/**
 * TableRenderer Class
 * Handles all HTML table generation, display, and rendering
 * Responsible for creating table headers, rows, and managing table DOM elements
 */
class TableRenderer {
  /**
   * Initialize TableRenderer
   * @param {Object} config - Entity configuration object
   * @param {string} config.tableId - HTML table ID (e.g., 'customers-table')
   * @param {string} config.entityName - Name of entity (e.g., 'customer')
   * @param {Array} config.columns - Array of column definitions
   * @param {Object} utilityHelper - UtilityHelper instance for utilities
   * @param {Object} dataManager - DataManager instance for data access
   */
  constructor(config, utilityHelper, dataManager) {
    this.config = config;
    this.utilityHelper = utilityHelper;
    this.dataManager = dataManager;
  }

  /**
   * Initialize table with dynamic headers
   * Call this after loading config
   */
  initializeTable() {
    console.log('📊 Initializing table...');
    this.generateTableHeaders();
    console.info('✅ Table initialized');
  }

  /**
   * Generate table headers dynamically from config
   */
  generateTableHeaders() {
    console.log(`generateTableHeaders`);
    const { tableId, columns } = this.config;
    const thead = document.querySelector(`#${tableId} thead`);
    
    if (!thead) {
      console.error(`❌ Table thead not found for #${tableId}`);
      return;
    }

    console.info(`📋 Generating headers for table #${tableId}`);

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
    
    console.info(`✅ Headers generated successfully`);
  }

  /**
   * Display entities in table
   * @param {Array} data - Array of entities to display
   */
  displayTable(data) {
    console.log(`displayTable`);
    const { tableId, columns } = this.config;
    const tbody = document.querySelector(`#${tableId} tbody`);
    
    if (!tbody) {
      console.error(`❌ Table tbody not found for #${tableId}`);
      return;
    }

    console.info(`📊 Displaying ${data.length} row(s) in table #${tableId}`);

    tbody.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      const colCount = columns.filter(c => c.display !== false).length + 1; // +1 for actions
      tbody.innerHTML = `<tr><td colspan="${colCount}" class="no-data">No ${this.config.entityName}(s) found</td></tr>`;
      console.warn(`⚠️ No data to display`);
      return;
    }

    data.forEach(entity => {
      const row = this.createTableRow(entity);
      tbody.appendChild(row);
    });

    console.info(`✅ Table rendered with ${data.length} row(s)`);
  }

  /**
   * Create a table row for an entity
   * @param {Object} entity - Entity data
   * @returns {HTMLTableRowElement} Table row element
   */
  createTableRow(entity) {
    console.log(`createTableRow ${entity}`);
    const { columns, primaryKeyConfig } = this.config;
    
    // Generate ID: use primaryKeyConfig if available, otherwise fallback to entity.id
    let rowId;
    if (primaryKeyConfig) {
      rowId = IdGenerator.generateId(entity, primaryKeyConfig);
    } else {
      rowId = entity.id;
    }
    
    // Store the ID on the entity for later use
    entity._clientId = rowId;
    
    const row = document.createElement('tr');
    
    // Add data columns
    columns.forEach(column => {
      if (column.display === false) return;
      
      const cell = document.createElement('td');
      const value = this.utilityHelper.getNestedValue(entity, column.key);
      
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

    // Add action buttons column - pass the generated ID
    const actionCell = document.createElement('td');
    actionCell.innerHTML = this.buildActionButtons(rowId);
    row.appendChild(actionCell);

    return row;
  }

  /**
   * Build action buttons HTML for a row
   * @param {number} entityId - Entity ID
   * @returns {string} HTML string for action buttons
   */
  buildActionButtons(id) {
    return `
      <div class="action-buttons">
        <button class="btn-secondary" onclick="${this.config.crudId}CrudManager.editEntity('${id}')">Edit</button>
        <button class="btn-danger" onclick="${this.config.crudId}CrudManager.deleteEntity('${id}')">Delete</button>
      </div>
    `;
  }

  /**
   * Refresh table display with current data
   */
  refresh() {
    console.log('🔄 Refreshing table display...');
    const data = this.dataManager.getData();
    this.displayTable(data);
  }

  /**
   * Get table element
   * @returns {HTMLTableElement|null} Table element or null if not found
   */
  getTableElement() {
    const { tableId } = this.config;
    return document.querySelector(`#${tableId}`);
  }

  /**
   * Check if table exists in DOM
   * @returns {boolean} True if table exists
   */
  tableExists() {
    return this.getTableElement() !== null;
  }

  /**
   * Clear all table rows
   */
  clearTable() {
    const { tableId } = this.config;
    const tbody = document.querySelector(`#${tableId} tbody`);
    
    if (tbody) {
      tbody.innerHTML = '';
      console.info(`🗑️ Table cleared`);
    }
  }

  /**
   * Show empty state message
   * @param {string} message - Message to display
   */
  showEmptyState(message = null) {
    const { tableId, columns } = this.config;
    const tbody = document.querySelector(`#${tableId} tbody`);
    
    if (!tbody) return;

    const colCount = columns.filter(c => c.display !== false).length + 1;
    const displayMessage = message || `No ${this.config.entityName}(s) found`;
    
    tbody.innerHTML = `<tr><td colspan="${colCount}" class="no-data">${displayMessage}</td></tr>`;
    console.log(`📭 Empty state displayed: ${displayMessage}`);
  }

  /**
   * Add a single row to the table
   * @param {Object} entity - Entity data
   */
  addRow(entity) {
    const { tableId } = this.config;
    const tbody = document.querySelector(`#${tableId} tbody`);
    
    if (!tbody) return;

    // If showing empty state, clear it first
    const emptyRow = tbody.querySelector('.no-data');
    if (emptyRow) {
      tbody.innerHTML = '';
    }

    const row = this.createTableRow(entity);
    tbody.appendChild(row);
    console.info(`✅ Row added for entity ID: ${entity.id}`);
  }

  /**
   * Remove a row from the table by entity ID
   * @param {number} entityId - Entity ID
   */
  removeRow(entityId) {
    const { tableId } = this.config;
    const tbody = document.querySelector(`#${tableId} tbody`);
    
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      const editButton = row.querySelector(`button[onclick*="editEntity(${entityId})"]`);
      if (editButton) {
        row.remove();
        console.log(`🗑️ Row removed for entity ID: ${entityId}`);
      }
    });
  }

  /**
   * Update a single row in the table
   * @param {Object} entity - Updated entity data
   */
  updateRow(entity) {
    this.removeRow(entity.id);
    this.addRow(entity);
    console.log(`🔄 Row updated for entity ID: ${entity.id}`);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TableRenderer;
}
