/**
 * Form Builder Class
 * Responsible for dynamically generating form HTML from configuration
 * Handles all form field types and form structure generation
 */

class FormBuilder {
  /**
   * Initialize FormBuilder with dependencies
   * @param {Object} config - Entity configuration object
   * @param {UtilityHelper} utilityHelper - Utility helper instance
   * @param {UIController} uiController - UI controller instance
   */
  constructor(config, utilityHelper, uiController) {
    this.config = config;
    this.utilityHelper = utilityHelper;
    this.uiController = uiController;
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
    const formTitle = this.utilityHelper.capitalizeFirstLetter(this.config.entityName);
    
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
   * Build HTML5 pattern attribute from field definition
   * Patterns from JSON are already in correct format - no escaping needed
   * @param {Object} field - Field configuration
   * @returns {string} Pattern attribute string or empty string
   */
  buildHtml5Pattern(field) {
    if (!field.pattern) return '';
    
    // Pattern from JSON is already correct for HTML5 attributes
    // Example: "[a-zA-Z0-9\\s,.-]*" in JSON becomes [a-zA-Z0-9\s,.-]* in HTML
    // Do NOT escape the pattern - it will break the regex
    return field.pattern;
  }

  /**
   * Build RegExp from field pattern for JavaScript validation
   * @param {Object} field - Field configuration
   * @returns {RegExp|null} Compiled RegExp or null if invalid
   */
  buildRegExp(field) {
    if (!field.pattern) return null;
    
    try {
      // Wrap with anchors to match entire input
      return new RegExp(`^${field.pattern}$`);
    } catch (e) {
      console.error(`❌ Invalid regex pattern for field "${field.label}":`, field.pattern, e);
      return null;
    }
  }

  /**
   * Get user-friendly pattern validation message
   * @param {Object} field - Field configuration
   * @returns {string} Validation message describing allowed format
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
    
    if (placeholder) attributes += ` placeholder="${this.escapeHtml(placeholder)}"`;
    if (required) attributes += ` required`;
    
    // Add pattern attribute - DO NOT escape it
    if (pattern) {
      attributes += ` pattern="${pattern}"`;
    }
    
    if (maxLength) attributes += ` maxlength="${maxLength}"`;
    if (minLength) attributes += ` minlength="${minLength}"`;

    return `
      <div class="form-group">
        <label for="${id}">${this.escapeHtml(label)}${required ? ' <span class="required">*</span>' : ''}</label>
        <input ${attributes}>
      </div>
    `;
  }

  /**
   * Escape HTML special characters to prevent issues with attribute values
   * IMPORTANT: This is NOT used for pattern attributes - patterns need to be unescaped
   * @param {string} text - Text to escape
   * @returns {string} Escaped text safe for HTML attributes
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return String(text).replace(/[&<>"']/g, char => map[char]);
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
    
    if (placeholder) attributes += ` placeholder="${this.escapeHtml(placeholder)}"`;
    if (required) attributes += ` required`;
    if (maxLength) attributes += ` maxlength="${maxLength}"`;

    return `
      <div class="form-group">
        <label for="${id}">${this.escapeHtml(label)}${required ? ' <span class="required">*</span>' : ''}</label>
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
        .map(opt => `<option value="${opt.value}">${this.escapeHtml(opt.label)}</option>`)
        .join('\n');
    }

    return `
      <div class="form-group">
        <label for="${id}">${this.escapeHtml(label)}${required ? ' <span class="required">*</span>' : ''}</label>
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
        <label for="${id}">${this.escapeHtml(label)}</label>
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
            <label for="${radioId}">${this.escapeHtml(opt.label)}</label>
          </div>
        `;
      })
      .join('\n');

    return `
      <div class="form-group radio-group">
        <label>${this.escapeHtml(label)}${required ? ' <span class="required">*</span>' : ''}</label>
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
        <label for="${id}">${this.escapeHtml(label)}${required ? ' <span class="required">*</span>' : ''}</label>
        <input ${attributes}>
      </div>
    `;
  }

  /**
   * Build form action buttons HTML
   * @returns {string} HTML string for buttons
   */
  buildFormButtonsHTML() {
    const buttonsHTML = `
      <div class="button-group">
        <button type="submit" class="btn-primary">Save ${this.utilityHelper.capitalizeFirstLetter(this.config.entityName)}</button>
        <button type="button" class="btn-secondary" onclick="${this.config.crudId}CrudManager.toggleFormVisibility(false);">
          Cancel
        </button>
      </div>
    `;
    console.log(`⚠️ buildFormButtonsHTML "${this.config.crudId}"`);
    return buttonsHTML;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormBuilder;
}
