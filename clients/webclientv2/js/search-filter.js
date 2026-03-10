/**
 * Generic Search and Filter Manager
 * Handles client-side search and filtering operations
 * Works independently from CRUD operations
 */

class SearchFilter {
  /**
   * Initialize SearchFilter with configuration
   * @param {Object} config - Configuration object
   * @param {string} config.entityName - Name of entity (e.g., 'customer')
   * @param {Array} config.columns - Array of column definitions with searchable property
   * @param {string} config.defaultSearchField - Default field to search in
   * @param {boolean} config.enableSearch - Enable/disable search functionality
   * @param {UtilityHelper} utilityHelper - UtilityHelper instance
   * @param {UIController} uiController - UIController instance
   */
  constructor(config, utilityHelper, uiController) {
    this.config = config;
    this.utilityHelper = utilityHelper;
    this.uiController = uiController;
    this.currentFilteredData = null;
    this.isFiltered = false;
  }

  /**
   * Generate filter UI dynamically from config
   * Creates search field selector, input, and action buttons
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
   * @param {Array} data - Data to search in
   * @param {Function} onResults - Callback function with filtered results
   * @returns {Array} Filtered data
   */
  performSearch(data, onResults) {
    const { entityName } = this.config;
    const fieldSelect = document.getElementById(`${entityName}-search-field`);
    const searchInput = document.getElementById(`${entityName}-search-input`);

    if (!fieldSelect || !searchInput) {
      console.error('Filter elements not found');
      return [];
    }

    const searchField = fieldSelect.value;
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
      this.uiController.showMessage('Please enter a search term', 'warning');
      return [];
    }

    try {
      // Filter from provided data (client-side)
      const filteredData = this.filterData(data, searchField, searchTerm);
      
      this.currentFilteredData = filteredData;
      this.isFiltered = true;
      
      // Call the callback with filtered results
      if (onResults && typeof onResults === 'function') {
        onResults(filteredData);
      }
      
      if (filteredData.length === 0) {
        this.uiController.showMessage(
          `No ${this.config.entityName}(s) found matching "${searchTerm}"`,
          'info'
        );
      } else {
        this.uiController.showMessage(`Found ${filteredData.length} result(s)`, 'success');
      }
      
      return filteredData;
    } catch (error) {
      this.uiController.showMessage(`Search error: ${error.message}`, 'error');
      return [];
    }
  }

  /**
   * Filter data based on field and search term
   * Supports nested object properties
   * @param {Array} data - Data to filter
   * @param {string} field - Field to search in
   * @param {string} term - Search term
   * @returns {Array} Filtered data
   */
  filterData(data, field, term) {
    const lowerTerm = term.toLowerCase();
    
    return data.filter(item => {
      const value = this.utilityHelper.getNestedValue(item, field);
      
      if (value === null || value === undefined) {
        return false;
      }
      
      return String(value).toLowerCase().includes(lowerTerm);
    });
  }

  /**
   * Clear filter and reset to original data
   * @param {Array} originalData - Original unfiltered data
   * @param {Function} onResults - Callback function with original data
   */
  clearFilter(originalData, onResults) {
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
      this.currentFilteredData = null;
      this.isFiltered = false;
      
      // Call the callback with original data
      if (onResults && typeof onResults === 'function') {
        onResults(originalData);
      }
      
      this.uiController.showMessage('Filter cleared', 'info');
    } catch (error) {
      this.uiController.showMessage(`Error clearing filter: ${error.message}`, 'error');
    }
  }

  /**
   * Get current filter status
   * @returns {Object} Filter status object
   */
  getFilterStatus() {
    return {
      isFiltered: this.isFiltered,
      currentFilteredData: this.currentFilteredData,
      dataCount: this.currentFilteredData ? this.currentFilteredData.length : 0
    };
  }

  /**
   * Reset filter state completely
   */
  resetFilterState() {
    this.currentFilteredData = null;
    this.isFiltered = false;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SearchFilter;
}
