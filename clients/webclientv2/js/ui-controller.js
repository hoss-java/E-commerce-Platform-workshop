/**
 * UIController Class
 * Handles all user-facing feedback, notifications, and loading states
 * Responsible for: toast notifications, loading indicators, error handling, and HTML escaping
 */

class UIController {
  /**
   * Initialize UIController
   * @param {Object} config - Configuration object
   * @param {string} config.tabName - Tab identifier for loading element ID
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Show loading indicator
   * Adds 'show' class to loading element with ID: {tabName}-loading
   */
  showLoading() {
    const loadingEl = document.getElementById(`${this.config.tabName}-loading`);
    if (loadingEl) {
      loadingEl.classList.add('show');
    }
  }

  /**
   * Hide loading indicator
   * Removes 'show' class from loading element with ID: {tabName}-loading
   */
  hideLoading() {
    const loadingEl = document.getElementById(`${this.config.tabName}-loading`);
    if (loadingEl) {
      loadingEl.classList.remove('show');
    }
  }

  /**
   * Show message to user as a toast notification
   * Creates a toast container if it doesn't exist and appends toast element
   * Auto-dismisses after 5 seconds (except for error messages)
   * 
   * @param {string} message - Message text to display
   * @param {string} type - Toast type: 'success', 'error', 'info', 'warning'
   * @param {Object} details - Optional details object for console logging
   */
  showMessage(message, type = 'info', details = null) {
    console.debug('[MESSAGE] ' + message);
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
   * Displays error message as toast and logs detailed error information to console
   * 
   * @param {string} operation - Operation name (e.g., 'Creating', 'Updating', 'Loading')
   * @param {Error} error - Error object
   * @param {Object} context - Additional context data for debugging
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
      `Error ${operation.toLowerCase()}: ${error.message}`,
      'error',
      errorDetails
    );

    console.error(`${operation} error:`, errorDetails);
  }

  /**
   * Escape HTML to prevent XSS attacks
   * Converts HTML special characters to their entity equivalents
   * 
   * @param {string} text - Text to escape
   * @returns {string} Escaped HTML-safe string
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIController;
}
