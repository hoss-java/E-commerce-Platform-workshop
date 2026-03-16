class IdGenerator {
  
  /**
   * Generate ID based on configuration
   * @param {Object} entity - The data row
   * @param {Object} primaryKeyConfig - Configuration for ID generation
   * @returns {string} - Generated ID
   */
  static generateId(entity, primaryKeyConfig) {
    if (!primaryKeyConfig) {
      // Fallback: use entity.id if no config provided
      return entity.id || this.generateUUID();
    }

    const { type, field, fields } = primaryKeyConfig;

    switch (type) {
      case 'single':
        return this.generateSingleId(entity, field);
      
      case 'composite':
        return this.generateCompositeId(entity, fields);
      
      case 'hash':
        return this.generateHashId(entity, fields);
      
      default:
        return entity.id || this.generateUUID();
    }
  }

  /**
   * Single field ID (standard primary key)
   */
  static generateSingleId(entity, field) {
    const value = this.getNestedValue(entity, field);
    if (!value) {
      console.warn(`Field "${field}" not found in entity`);
      return this.generateUUID();
    }
    return String(value);
  }

  /**
   * Composite ID: concatenate multiple field values
   */
  static generateCompositeId(entity, fields) {
    try {
      const keyValues = {};
      fields.forEach(field => {
        const value = this.getNestedValue(entity, field);
        if (value === null || value === undefined) {
          throw new Error(`Field "${field}" not found`);
        }
        keyValues[field] = value; // Add as key-value pair
      });
      const jsonString = JSON.stringify(keyValues);
      return btoa(jsonString); // Single Base64 string
    } catch (error) {
      console.warn('Composite ID generation failed:', error.message);
      return this.generateUUID();
    }
  }


  /**
   * Hash ID: create hash from multiple field values
   * More compact than composite, handles identical rows
   */
  static generateHashId(entity, fields) {
    try {
      const values = fields.map(field => 
        this.getNestedValue(entity, field)
      );
      const content = JSON.stringify(values);
      return this.simpleHash(content);
    } catch (error) {
      console.warn('Hash ID generation failed:', error.message);
      return this.generateUUID();
    }
  }

  /**
   * Get nested value from object using dot notation
   * Example: getNestedValue(obj, 'product.id')
   */
  static getNestedValue(obj, path) {
    if (!path) return undefined;
    return path.split('.').reduce((current, key) => 
      current?.[key], obj
    );
  }

  /**
   * Simple hash function for composite IDs
   */
  static simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `hash_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Generate UUID as fallback
   */
  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Attach generated ID to entity
   */
  static enrichEntity(entity, primaryKeyConfig) {
    const generatedId = this.generateId(entity, primaryKeyConfig);
    return {
      ...entity,
      _clientId: generatedId
    };
  }
}
