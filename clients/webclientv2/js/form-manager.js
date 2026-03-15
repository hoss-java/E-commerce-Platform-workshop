/**
 * Generic Form Manager
 * Handles form interaction, validation, population, and submission
 * Works independently from CRUD operations
 */

class FormManager {
  /**
   * Initialize FormManager with configuration
   * @param {Object} config - Configuration object
   * @param {string} config.entityName - Name of entity (e.g., 'customer')
   * @param {string} config.formContainerId - ID of form container element
   * @param {string} config.buttonGroupId - ID of button group element
   * @param {Array} config.formFields - Array of form field definitions
   * @param {UtilityHelper} utilityHelper - UtilityHelper instance
   * @param {UIController} uiController - UIController instance
   * @param {DataManager} dataManager - DataManager instance for CRUD operations
   * @param {TableRenderer} tableRenderer - TableRenderer instance for CRUD operations
   */
  constructor(config, utilityHelper, uiController, dataManager, tableRenderer) {
    this.config = config;
    this.utilityHelper = utilityHelper;
    this.uiController = uiController;
    this.dataManager = dataManager;
    this.uiController = uiController;
    this.tableRenderer = tableRenderer;
    this.currentEditingId = null;
    this.currentMode = 'create'; // 'create' or 'update'
  }

  /**
   * Edit entity - load data and populate form
   * @param {number} id - Entity ID
   * @param {Function} onEditComplete - Callback when edit is loaded
   */
  async editEntity(id, onEditComplete) {
    try {
      const entity = await this.dataManager.loadById(id);
      this.currentEditingId = id;
      this.currentMode = 'update';
      
      this.populateForm(entity);
      this.hideButton();
      this.showForm();
      this.setupFormSubmit('update');
      
      if (onEditComplete && typeof onEditComplete === 'function') {
        onEditComplete(entity);
      }
    } catch (error) {
      this.uiController.showMessage(
        `Error loading ${this.config.entityName}: ${error.message}`,
        'error'
      );
    }
  }

  /**
   * Populate form with entity data
   * Supports nested object properties
   * @param {Object} entity - Entity data to populate
   */
  populateForm(entity) {
    const { formFields } = this.config;
    
    formFields.forEach(field => {
      const input = document.getElementById(field.id);
      if (!input) {
        console.warn(`Form field not found: ${field.id}`);
        return;
      }
      
      const value = this.utilityHelper.getNestedValue(entity, field.key);
      
      if (field.type === 'select') {
        // For relationship fields, get the ID
        input.value = value?.id || value || '';
      } else if (field.type === 'checkbox') {
        input.checked = Boolean(value);
      } else if (field.type === 'radio') {
        const radioButtons = document.querySelectorAll(`input[name="${field.id}"]`);
        radioButtons.forEach(radio => {
          radio.checked = radio.value === String(value);
        });
      } else {
        input.value = value || '';
      }
    });
  }

  /**
   * Get form data from all form fields
   * @returns {Object} Form data object with field keys and values
   */
  getFormData() {
    const { formFields } = this.config;
    const formData = {};
    
    formFields.forEach(field => {
      const input = document.getElementById(field.id);
      if (!input) {
        console.warn(`Form field not found: ${field.id}`);
        return;
      }
      
      let value;
      
      if (field.type === 'checkbox') {
        value = input.checked;
      } else if (field.type === 'radio') {
        const checkedRadio = document.querySelector(`input[name="${field.id}"]:checked`);
        value = checkedRadio ? checkedRadio.value : '';
      } else if (field.type === 'select' && field.relationship) {
        // For relationship fields, store as object with id
        value = input.value ? { id: input.value } : null;
      } else {
        value = input.value;
      }
      
      formData[field.key] = value;
    });
    
    return formData;
  }

  /**
   * Build HTML5 pattern attribute from field definition
   * Converts JSON pattern string to valid HTML5 pattern
   * @param {Object} field - Field definition object
   * @returns {string} HTML5-safe pattern string
   */
  buildHtml5Pattern(field) {
    if (!field.pattern) return '';
    
    // The pattern from JSON is already in the correct format for both HTML5 and RegExp
    // Just return it as-is
    return field.pattern;
  }

  /**
   * Build RegExp from field pattern
   * Safely converts JSON pattern string to RegExp object
   * @param {Object} field - Field definition object
   * @returns {RegExp|null} Compiled RegExp or null if pattern is invalid
   */
  buildRegExp(field) {
    if (!field.pattern) return null;
    
    try {
      // Wrap with anchors to match entire input
      return new RegExp(`^${field.pattern}$`);
    } catch (e) {
      console.error(`Invalid regex pattern for field "${field.label}":`, field.pattern, e);
      return null;
    }
  }

  /**
   * Get pattern validation message
   * @param {Object} field - Field definition object
   * @returns {string} User-friendly validation message
   */
  getPatternValidationMessage(field) {
    const patterns = {
      '[a-zA-Z0-9\\s,.-]*': 'letters, numbers, spaces, commas, periods, and hyphens',
      '[a-zA-Z\\s]*': 'letters and spaces only',
      '[0-9\\-]*': 'numbers and hyphens only',
      '[0-9]*': 'numbers only',
      '[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}': 'valid email format'
    };
    
    return patterns[field.pattern] || 'invalid format';
  }

  /**
   * Validate form data based on field definitions
   * @param {Object} formData - Form data to validate
   * @throws {Error} If validation fails
   * @returns {boolean} True if validation passes
   */
  validateFormData(formData) {
    const { formFields, entityName } = this.config;
    const errors = [];
    
    formFields.forEach(field => {
      const value = formData[field.key];
      
      // Check required fields
      if (field.required && (!value || value === '')) {
        errors.push(`${field.label} is required`);
        return; // Skip further validation for empty required fields
      }
      
      // Skip validation for empty optional fields
      if (!value || value === '') {
        return;
      }
      
      // Check minimum length
      if (field.minLength && String(value).length < field.minLength) {
        errors.push(`${field.label} must be at least ${field.minLength} characters`);
      }
      
      // Check maximum length
      if (field.maxLength && String(value).length > field.maxLength) {
        errors.push(`${field.label} must not exceed ${field.maxLength} characters`);
      }
      
      // Check pattern (using builder method)
      if (field.pattern && value) {
        const regex = this.buildRegExp(field);
        if (regex && !regex.test(String(value))) {
          const patternMsg = this.getPatternValidationMessage(field);
          errors.push(`${field.label} must contain only ${patternMsg}`);
        }
      }
      
      // Check email format
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${field.label} must be a valid email address`);
        }
      }
      
      // Check number format
      if (field.type === 'number' && value) {
        if (isNaN(Number(value))) {
          errors.push(`${field.label} must be a valid number`);
        }
        
        if (field.min !== undefined && Number(value) < field.min) {
          errors.push(`${field.label} must be at least ${field.min}`);
        }
        
        if (field.max !== undefined && Number(value) > field.max) {
          errors.push(`${field.label} must not exceed ${field.max}`);
        }
      }
    });
    
    if (errors.length > 0) {
      this.uiController.showMessage(errors, "error");
      return false;
    }
    
    return true;
  }


  /**
   * Prepare entity data for API submission
   * Applies any necessary transformations
   * @param {Object} formData - Form data from getFormData()
   * @param {string} operation - 'create' or 'update'
   * @returns {Object} Prepared data for API
   */
  prepareEntityData(formData, operation) {
    const preparedData = { ...formData };
    
    // Apply field-level transformations if defined
    this.config.formFields.forEach(field => {
      if (field.transform && typeof field.transform === 'function') {
        preparedData[field.key] = field.transform(preparedData[field.key]);
      }
    });
    
    // Remove fields that shouldn't be sent to API
    this.config.formFields.forEach(field => {
      if (field.excludeFromSubmit) {
        delete preparedData[field.key];
      }
    });
    
    return preparedData;
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
    this.currentMode = 'create';
  }

  /**
   * Show form container
   */
  showForm() {
    const camelCaseEntity = this.utilityHelper.kebabToCamel(this.config.entityName);
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
    const camelCaseEntity = this.utilityHelper.kebabToCamel(this.config.entityName);
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
   * Show button group
   */
  showButton() {
    const camelCaseEntity = this.utilityHelper.kebabToCamel(this.config.entityName);
    const buttonGroupId = this.config.buttonGroupId || `add${this.utilityHelper.capitalize(camelCaseEntity)}ButtonGroup`;
    
    console.log('🔍 showButton() called');
    console.log('   buttonGroupId:', buttonGroupId);
    
    const buttonGroup = document.getElementById(buttonGroupId);
    console.log('   buttonGroup element found:', !!buttonGroup);
    
    if (buttonGroup) {
      console.log('   Current classes:', buttonGroup.className);
      buttonGroup.classList.remove('hidden');
      console.log('   Classes after remove:', buttonGroup.className);
    } else {
      console.error(`   ❌ ERROR: Element with id="${buttonGroupId}" not found in DOM!`);
    }
  }

  /**
   * Hide button group
   */
  hideButton() {
    const camelCaseEntity = this.utilityHelper.kebabToCamel(this.config.entityName);
    const buttonGroupId = this.config.buttonGroupId || `add${this.utilityHelper.capitalize(camelCaseEntity)}ButtonGroup`;
    
    console.log('🔍 hideButton() called');
    console.log('   buttonGroupId:', buttonGroupId);
    
    const buttonGroup = document.getElementById(buttonGroupId);
    console.log('   buttonGroup element found:', !!buttonGroup);
    
    if (buttonGroup) {
      console.log('   Current classes:', buttonGroup.className);
      buttonGroup.classList.add('hidden');
      console.log('   Classes after add:', buttonGroup.className);
    } else {
      console.error(`   ❌ ERROR: Element with id="${buttonGroupId}" not found in DOM!`);
    }
  }

  /**
   * Toggle visibility of form and add button
   * @param {boolean} show - True to show form and hide button, false to hide form and show button
   */
  toggleFormVisibility(show) {
    const camelCaseEntity = this.utilityHelper.kebabToCamel(this.config.entityName);
    console.log(`🔍 toggleFormVisibility - entityName: ${this.config.entityName}, camelCase: ${camelCaseEntity}`);
    
    if (show) {
      this.showForm();
      this.hideButton();
      this.resetForm();
      this.setupFormSubmit('create');
    } else {
      this.hideForm();
      this.showButton();
    }
  }

  /**
   * Setup form submission handler
   * @param {string} mode - 'create' or 'update'
   * @param {Function} onSubmitSuccess - Callback on successful submission
   */
  setupFormSubmit(mode = 'create', onSubmitSuccess) {
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
      e.preventDefault();
      
      try {
        const formData = this.getFormData();
        this.validateFormData(formData);
        const preparedData = this.prepareEntityData(formData, mode);
        
        let entityPromise;
        
        if (mode === 'create') {
          entityPromise = this.dataManager.createEntity(preparedData);
        } else if (mode === 'update') {
          entityPromise = this.dataManager.updateEntity(this.currentEditingId, preparedData);
        }
        
        // Handle success after entity operation completes
        if (entityPromise) {
          entityPromise.then(() => {
            this.tableRenderer.refresh();

            if (onSubmitSuccess && typeof onSubmitSuccess === 'function') {
              onSubmitSuccess(preparedData);
            }
            this.toggleFormVisibility(false);
          }).catch(error => {
            console.error(`Form submission error:`, error.message);
            this.uiController.showMessage(error.message, 'error');
          });
        }
      } catch (error) {
        console.error(`Form submission error:`, error.message);
        this.uiController.showMessage(error.message, 'error');
      }
    };
    
    console.log(`✅ Form submission handler attached successfully`);
  }

  /**
   * Get current form state
   * @returns {Object} Current form state
   */
  getFormState() {
    return {
      currentEditingId: this.currentEditingId,
      currentMode: this.currentMode,
      isEditing: this.currentMode === 'update',
      isCreating: this.currentMode === 'create'
    };
  }

  /**
   * Set form to create mode
   */
  setCreateMode() {
    this.currentMode = 'create';
    this.currentEditingId = null;
    this.resetForm();
  }

  /**
   * Set form to update mode
   * @param {number} id - Entity ID being updated
   */
  setUpdateMode(id) {
    this.currentMode = 'update';
    this.currentEditingId = id;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormManager;
}
