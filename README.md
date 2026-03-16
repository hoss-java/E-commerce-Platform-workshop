# E-Commerce - Workshop v1

## E-Commerce Application Development Summary

### Project Overview

A **full-stack e-commerce application** was built with a Spring Boot backend and a web-based client frontend over approximately one week. The project demonstrates a structured approach to breaking down complex features, iterative refactoring, and systematic testing.

---

### Backend Architecture

| Layer | Components | Purpose |
|-------|-----------|---------|
| **Controllers** | 11 controllers (Address, Category, Customer, Order, Product, etc.) | Handle HTTP requests and route them to appropriate services |
| **Services** | 10 service classes | Contain business logic and orchestrate data operations |
| **Repositories** | 10 repository interfaces | Provide database access using Spring Data JPA |
| **Entities** | 11 entity classes with composite keys (ProductImageId, ProductPromotionId) | Represent database tables and relationships |
| **DTOs** | 8 data transfer objects | Facilitate communication between backend and frontend, especially for nested data |
| **Exception Handling** | GlobalExceptionHandler, ErrorResponse, CachedBodyFilter | Centralize error management and provide consistent API responses |

The backend follows a **three-tier architecture** with clear separation of concerns: controllers handle requests, services manage business logic, and repositories interact with the database.

---

### Frontend Client Evolution

#### Phase 1: RestTester (Initial Testing Tool)
**Purpose:** Simple HTTP client to test backend endpoints  
**Outcome:** Confirmed basic backend functionality for Address, UserProfile, and Customer entities

#### Phase 2: WebClientV1 (First Full Client)
**Purpose:** Unified web interface with 3 tabs for all customer-related operations  
**Features:** Address management, User Profile management, Customer management  
**Duration:** ~2 days  
**Limitation:** Became too large and difficult to maintain as more features were added

#### Phase 3: WebClientV2 (Refactored with Grouping)
**Purpose:** Reorganized client with a **group-based architecture**  
**Structure:** Each group (Customers, Products, Orders, Promotions) contains multiple tabs for related entities  
**Duration:** ~2 days for refactoring  
**Benefit:** Scalable design that accommodates new features without overwhelming the interface

---

### Development Timeline and Key Milestones

| Phase | Focus Area | Duration | Key Decisions |
|-------|-----------|----------|---------------|
| **Phase 1** | Address entity (backend + RestTester client) | ~1 day | Established basic backend-client communication pattern |
| **Phase 2** | User Profiles & Customers (WebClientV1) | ~1 day | Built initial web client with 3 tabs |
| **Phase 3** | Categories & Products | ~1 day | Introduced DTOs for complex nested data; identified scalability issues |
| **Refactoring** | WebClientV1 → WebClientV2 | ~2 days | Restructured client with group-based tabs for maintainability |
| **Entity Redesign** | Added primary keys to entities without them | ~1 day | Simplified client-backend communication by ensuring all entities had proper identifiers |
| **Promotions & Orders** | Final features + concurrent backend/frontend fixes | ~1 day | Coordinated backend and frontend updates to resolve integration issues |
| **Testing & Exception Handling** | Unit tests for controllers; global exception manager | ~1 day | Added test coverage and centralized error handling |

---

### Technical Challenges and Solutions

#### Challenge 1: Nested Data Objects
**Problem:** Communicating complex, hierarchical data between client and backend (e.g., Products with Categories, Images, and Promotions)  
**Solution:** **DTOs (Data Transfer Objects)** were created to flatten and structure nested data for API communication

#### Challenge 2: Composite Primary Keys
**Problem:** Entities like ProductImage and ProductPromotion had composite keys (ProductImageId, ProductPromotionId), making them difficult to manage and communicate with the frontend  
**Solution:** These entities were redesigned to include proper primary keys, significantly simplifying client-backend interactions

#### Challenge 3: Client Scalability
**Problem:** WebClientV1 became too large and unwieldy as more features were added  
**Solution:** The client was refactored into WebClientV2 with a **group-based architecture**, organizing related tabs under logical groups (Customers, Products, Orders, Promotions)

#### Challenge 4: Testing Complexity
**Problem:** Writing unit tests for controllers, especially ProductImageController, required complex initialization of nested objects  
**Solution:** AI tools were used to help generate test cases; partial test coverage was achieved (controllers tested, but ProductImage tests remain incomplete due to initialization complexity)

---

### Key Learnings

#### 1. Strategic Use of AI Tools
AI proved effective not just for code generation, but for:
- Breaking down large tasks into manageable subtasks
- Designing architecture and file structures
- Generating boilerplate code and test templates
- Debugging and refactoring existing code

#### 2. Iterative Refactoring
The transition from WebClientV1 to WebClientV2 demonstrated the value of **recognizing scalability issues early** and refactoring before they become blocking problems. This approach saved time and prevented technical debt accumulation.

#### 3. Backend-First Development
Starting with the backend (Address entity) and building a simple test client first provided a solid foundation. Each subsequent feature could build on proven patterns.

#### 4. Data Transfer Objects (DTOs)
**DTOs became critical** when dealing with nested, relational data. They serve as a contract between frontend and backend, making the API clearer and more maintainable.

#### 5. Entity Design as Foundation
Ensuring all entities have proper primary keys from the start would have prevented redesign work later. This foundational decision ripples through the entire application.

---

### Project Statistics

- **Total Duration:** ~1 week (approximately 40–50 hours at 8 hours/day)
- **Backend Components:** 11 controllers, 10 services, 10 repositories, 11 entities, 8 DTOs
- **Frontend Iterations:** 2 major versions (RestTester → WebClientV1 → WebClientV2)
- **Features Implemented:** 4 major domains (Customers, Products, Promotions, Orders) with 8–11 related entities
- **Test Coverage:** Controllers fully tested; some complex entities (ProductImage) partially tested

---

### Conclusion

This project demonstrates **professional full-stack development practices**: proper layering, iterative design, scalability thinking, and the strategic use of AI tools to accelerate development. The refactoring decisions and architecture choices reflect the importance of recognizing when to redesign for maintainability rather than pushing forward with technical debt.

# Quick Guide: Adding New Groups and Entities

## Backend Implementation

### Step 1: Create Entity Classes
Create entity files in `src/main/java/com/ecommerce/entity/`

```java
@Entity
@Table(name = "your_entities")
public class YourEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "field_name")
    private String fieldName;
    
    // Getters and setters
}
```

**Key Points:**
- Always include a **primary key** (`@Id`)
- Use **`@GeneratedValue`** for auto-increment
- Define relationships with **`@OneToMany`**, **`@ManyToOne`**, etc.

---

### Step 2: Create DTO Class
Create DTO file in `src/main/java/com/ecommerce/dto/`

```java
public class YourEntityDTO {
    private Long id;
    private String fieldName;
    
    // Getters and setters
}
```

**Purpose:** Flatten nested data for API communication

---

### Step 3: Create Repository
Create repository in `src/main/java/com/ecommerce/repository/`

```java
@Repository
public interface YourEntityRepository extends JpaRepository<YourEntity, Long> {
    // Add custom query methods if needed
}
```

---

### Step 4: Create Service
Create service in `src/main/java/com/ecommerce/service/`

```java
@Service
public class YourEntityService {
    @Autowired
    private YourEntityRepository repository;
    
    public List<YourEntityDTO> getAll() {
        // Implementation
    }
    
    public YourEntityDTO getById(Long id) {
        // Implementation
    }
    
    public YourEntityDTO create(YourEntityDTO dto) {
        // Implementation
    }
    
    public YourEntityDTO update(Long id, YourEntityDTO dto) {
        // Implementation
    }
    
    public void delete(Long id) {
        // Implementation
    }
}
```

---

### Step 5: Create Controller
Create controller in `src/main/java/com/ecommerce/controller/`

```java
@RestController
@RequestMapping("/api/your-entities")
@CrossOrigin(origins = "*")
public class YourEntityController {
    @Autowired
    private YourEntityService service;
    
    @GetMapping
    public ResponseEntity<List<YourEntityDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<YourEntityDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
    
    @PostMapping
    public ResponseEntity<YourEntityDTO> create(@RequestBody YourEntityDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<YourEntityDTO> update(@PathVariable Long id, @RequestBody YourEntityDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

### Step 6: Create Unit Tests
Create test in `src/test/java/com/ecommerce/controller/`

```java
@SpringBootTest
@AutoConfigureMockMvc
public class YourEntityControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/your-entities"))
               .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
```

---

## Frontend Implementation

### Step 1: Create Configuration File
Create `config/tabs/your-group/your-entity.json`

```json
{
  "entityName": "yourEntity",
  "apiEndpoint": "your-entities",
  "tableId": "your-entity-table",
  "tabName": "your-entity",
  "formId": "your-entity-form",
  "formContainerId": "yourEntityForm",
  "onLoadComplete": "onYourEntityLoaded",
  "crudId": "yourEntity",
  
  "defaultSearchField": "fieldName",
  "enableSearch": true,
  
  "columns": [
    {
      "key": "id",
      "label": "ID",
      "display": true,
      "searchable": false
    },
    {
      "key": "fieldName",
      "label": "Field Name",
      "display": true,
      "searchable": true
    }
  ],
  
  "formFields": [
    {
      "id": "your-entity-fieldName",
      "key": "fieldName",
      "label": "Field Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter field name",
      "maxLength": 100
    }
  ]
}
```

**Configuration Properties:**

| Property | Purpose |
|----------|---------|
| `entityName` | Camel case name of entity |
| `apiEndpoint` | Backend API route (plural form) |
| `tableId` | HTML table element ID |
| `formId` | Form element ID |
| `crudId` | Unique identifier for CRUD manager |
| `columns` | Table column definitions with display and search settings |
| `formFields` | Form input field definitions |

---

### Step 2: Create HTML Tab File
Create `html/tabs/your-group/your-entity.html`

```html
<div id="your-entity-tab" class="tab-content">
  <!-- Messages and Loading State -->
  <div id="your-entity-message" class="message"></div>
  <div id="your-entity-loading" class="loading">Loading your entities...</div>

  <!-- Add Button -->
  <div id="addYourEntityButtonGroup" class="button-group" style="margin-bottom: 20px;">
    <button class="btn-primary" onclick="yourEntityCrudManager.toggleFormVisibility(true);">
      + Add New Your Entity
    </button>
  </div>

  <!-- Form (Hidden by Default) -->
  <div id="yourEntityForm" class="form-section hidden" data-auto-generate="true">
    <!-- Form will be generated here -->
  </div>

  <!-- List Section -->
  <div class="list-container">    
    <!-- Filter Row -->
    <div id="your-entity-filter-row-container" class="filter-row">
      <!-- Filter UI will be generated here dynamically -->
    </div>
    
    <!-- Table -->
    <table id="your-entity-table">
      <thead>
        <!-- Headers will be generated here dynamically -->
      </thead>
      <tbody>
        <!-- Data rows will be generated here dynamically -->
      </tbody>
    </table>
  </div>
</div>
```

---

### Step 3: Create JavaScript Module
Create `js/tabs/your-group/your-entity.js`

```javascript
/**
 * Your Entity Module
 * Initializes CRUD manager for your entities
 */

let yourEntityCrudManager = null;

/**
 * Initialize function called by tab-manager when tab is loaded
 */
async function initializeYourEntityCRUD() {
  console.log('📍 initializeYourEntityCRUD - START');
  
  try {
    // Load configuration
    const configResponse = await fetch('config/tabs/your-group/your-entity.json');  
    const config = await configResponse.json();
    
    // Initialize CRUDManager
    yourEntityCrudManager = new CRUDManager(config, apiClient);
    
    // Initialize table
    yourEntityCrudManager.initializeTable();

    // Make available globally
    window.yourEntityCrudManager = yourEntityCrudManager;

    // Generate form if needed
    yourEntityCrudManager.generateFormIfNeeded();
    
    // Setup callbacks
    setupYourEntityCallbacks();

    // Load all data
    await yourEntityCrudManager.loadAll();
    
    // Setup form submission
    yourEntityCrudManager.setupFormSubmit('create');

    // Load dropdown options (if needed)
    await loadYourEntityDropdownOptions();  
  } catch (error) {
    console.error('❌ initializeYourEntityCRUD - ERROR', {
      message: error.message,
      stack: error.stack,
      error
    });
    throw error;
  }
}

/**
 * Setup custom callbacks
 */
function setupYourEntityCallbacks() {
  console.log('📍 Setting up your entity callbacks');
  
  window.onYourEntityLoaded = async (data) => {
    console.log('✅ Your entities loaded successfully!', data);
    await loadYourEntityDropdownOptions();
  };
}

/**
 * Load dropdown options (if entity has relationships)
 */
async function loadYourEntityDropdownOptions() {
  try {
    // Example: if entity has relationships
    // const relatedData = await apiClient.getRelatedEntities();
    // populateRelatedDropdown(relatedData);
  } catch (error) {
    console.error('Error loading dropdown options:', error);
    yourEntityCrudManager.showMessage('Error loading dropdown options', 'error');
  }
}
```

---

### Step 4: Register Tab in Tab Manager
Edit `js/tab-manager.js` and add to the tabs configuration:

```javascript
{
  name: 'Your Entity',
  id: 'your-entity-tab',
  group: 'Your Group',
  htmlFile: 'html/tabs/your-group/your-entity.html',
  jsFile: 'js/tabs/your-group/your-entity.js',
  initFunction: 'initializeYourEntityCRUD'
}
```

---

### Step 5: Update API Client (if needed)
Edit `js/api-client.js` and add methods:

```javascript
async getYourEntities() {
  return this.get('/your-entities');
}

async getYourEntityById(id) {
  return this.get(`/your-entities/${id}`);
}

async createYourEntity(data) {
  return this.post('/your-entities', data);
}

async updateYourEntity(id, data) {
  return this.put(`/your-entities/${id}`, data);
}

async deleteYourEntity(id) {
  return this.delete(`/your-entities/${id}`);
}
```

---

## Creating a New Group

### Step 1: Create Backend Group Folder
Create folder: `src/main/java/com/ecommerce/your-group/`

Add entity, DTO, repository, service, and controller files following the same patterns above.

### Step 2: Create Frontend Group Folder
Create folders:
- `config/tabs/your-group/`
- `html/tabs/your-group/`
- `js/tabs/your-group/`

### Step 3: Add Configuration Files
Create JSON files in `config/tabs/your-group/` for each entity in the group.

### Step 4: Register Group in Tab Manager
Add group configuration to `js/tab-manager.js`:

```javascript
{
  groupName: 'Your Group',
  tabs: [
    {
      name: 'Entity 1',
      id: 'entity-1-tab',
      htmlFile: 'html/tabs/your-group/entity-1.html',
      jsFile: 'js/tabs/your-group/entity-1.js',
      initFunction: 'initializeEntity1CRUD'
    },
    {
      name: 'Entity 2',
      id: 'entity-2-tab',
      htmlFile: 'html/tabs/your-group/entity-2.html',
      jsFile: 'js/tabs/your-group/entity-2.js',
      initFunction: 'initializeEntity2CRUD'
    }
  ]
}
```

---

## Summary Checklist

### Backend
- [ ] Create Entity class with `@Id` and `@GeneratedValue`
- [ ] Create DTO class
- [ ] Create Repository extending `JpaRepository`
- [ ] Create Service with CRUD methods
- [ ] Create Controller with REST endpoints
- [ ] Create unit tests for Controller
- [ ] Test all endpoints with Postman or RestTester

### Frontend
- [ ] Create JSON configuration file
- [ ] Create HTML tab file
- [ ] Create JavaScript module with initialization function
- [ ] Add API client methods
- [ ] Register tab in Tab Manager
- [ ] Test CRUD operations in browser

## webClient 2 - Refactoring Plan for CRUDManager Class
* Estimated time 1 week, 
 
### Current State Analysis (using Claude Haiku 4.5)

**Current Class Size:** ~800+ lines with **40+ methods** handling 6 distinct responsibilities.

**Main Problems:**
- **Single Responsibility Principle violated** - one class doing too much
- **Hard to test** - tightly coupled concerns
- **Difficult to maintain** - changes in one area affect others
- **Code reuse limited** - can't use form generation without CRUD operations
- **Readability poor** - have to scroll through 800 lines to find related methods

---

### Proposed Architecture: 5 Specialized Classes

| **Class Name** | **Responsibility** | **Methods** | **Purpose** |
|---|---|---|---|
| **DataManager** | API communication & data caching | loadAll, loadById, createEntity, updateEntity, deleteEntity, data property | Handle all backend communication |
| **TableRenderer** | HTML table generation & display | displayTable, createTableRow, generateTableHeaders, initializeTable | Render and manage table UI |
| **FormBuilder** | Form HTML generation from config | generateFormIfNeeded, buildFormHTML, buildFormFieldHTML, buildInputField, buildTextareaField, buildSelectField, buildCheckboxField, buildRadioField, buildDateTimeField, buildFormButtonsHTML | Dynamically create form elements |
| **FormManager** | Form interaction & submission | populateForm, validateFormData, prepareEntityData, getFormData, resetForm, setupFormSubmit, editEntity, showForm, hideForm, toggleFormVisibility | Handle form logic & submission |
| **SearchFilter** | Search & filtering operations | generateFilterUI, performSearch, filterData, clearFilter | Client-side search functionality |
| **UIController** | User feedback & loading states | showLoading, hideLoading, showMessage, handleError, escapeHtml | Handle all UI feedback |
| **UtilityHelper** | String transformations & helpers | kebabToCamel, capitalize, capitalizeFirstLetter, getNestedValue | Reusable utility functions |
| **CRUDManager** | Orchestrator (refactored) | Constructor, initialization, coordinate between classes | Tie everything together |

---

### Detailed Breakdown

#### **1. UtilityHelper Class**
**Purpose:** Reusable utility functions (no dependencies)

```
Methods:
- kebabToCamel(str)
- capitalize(str)
- capitalizeFirstLetter(str)
- getNestedValue(obj, path)
```

---

#### **2. UIController Class**
**Purpose:** All user-facing feedback and loading indicators

```
Methods:
- showLoading()
- hideLoading()
- showMessage(message, type, details)
- handleError(operation, error, context)
- escapeHtml(text)

Dependencies: UtilityHelper
```

---

#### **3. DataManager Class**
**Purpose:** All API communication and data caching

```
Methods:
- loadAll()
- loadById(id)
- createEntity(formData)
- updateEntity(id, formData)
- deleteEntity(id)
- (internal) buildApiMethodName(operation, entityName)

Properties:
- data (cached data)
- currentEditingId

Dependencies: UtilityHelper, UIController, apiClient
```

---

#### **4. TableRenderer Class**
**Purpose:** HTML table generation and display

```
Methods:
- initializeTable()
- generateTableHeaders()
- displayTable(data)
- createTableRow(entity)
- (internal) buildActionButtons(entityId)

Dependencies: UtilityHelper, config
```

---

#### **5. FormBuilder Class**
**Purpose:** Dynamically generate form HTML from config

```
Methods:
- generateFormIfNeeded()
- buildFormHTML(formId)
- buildFormFieldHTML(field)
- buildInputField(field)
- buildTextareaField(field)
- buildSelectField(field)
- buildCheckboxField(field)
- buildRadioField(field)
- buildDateTimeField(field)
- buildFormButtonsHTML()

Dependencies: UtilityHelper, UIController
```

---

#### **6. FormManager Class**
**Purpose:** Form interaction, validation, and submission

```
Methods:
- populateForm(entity)
- validateFormData(formData)
- prepareEntityData(formData, operation)
- getFormData()
- resetForm()
- setupFormSubmit(mode)
- showForm()
- hideForm()
- toggleFormVisibility(show)
- editEntity(id)

Dependencies: UtilityHelper, UIController, DataManager
```

---

#### **7. SearchFilter Class**
**Purpose:** Client-side search and filtering

```
Methods:
- generateFilterUI()
- performSearch()
- filterData(data, field, term)
- clearFilter()

Dependencies: UtilityHelper, UIController
```

---

#### **8. CRUDManager Class (Refactored)**
**Purpose:** Orchestrator - coordinates all components

```
Constructor:
- Initialize all helper classes
- Store config and apiClient

Methods:
- (public) initializeTable()
- (public) loadAll()
- (public) editEntity(id)
- (public) createEntity(formData)
- (public) updateEntity(id, formData)
- (public) deleteEntity(id)
- (public) showForm()
- (public) hideForm()
- (public) toggleFormVisibility(show)
- (public) performSearch()

Properties:
- tableRenderer
- formBuilder
- formManager
- searchFilter
- dataManager
- uiController
```

---

### Benefits of This Refactoring

✅ **Single Responsibility** - Each class has one clear job  
✅ **Testability** - Can test each class independently  
✅ **Reusability** - Use FormBuilder without DataManager, for example  
✅ **Maintainability** - Find related code in one place  
✅ **Scalability** - Easy to add new features (e.g., export, bulk operations)  
✅ **Readability** - Each file is 100-150 lines instead of 800+  

---

### Implementation Order

1. **UtilityHelper** (no dependencies - start here)
2. **UIController** (depends on UtilityHelper)
3. **FormBuilder** (depends on UtilityHelper, UIController)
4. **TableRenderer** (depends on UtilityHelper)
5. **SearchFilter** (depends on UtilityHelper, UIController)
6. **DataManager** (depends on UtilityHelper, UIController, apiClient)
7. **FormManager** (depends on UtilityHelper, UIController, DataManager)
8. **CRUDManager** (orchestrates all classes)

---
## webClient 2 - Setup Guide

### Adding a New Group and Tabs

#### Step 1: Create the Group Folder Structure

Create a new folder inside `config/tabs/` and `html/tabs/` with your group name:

```
config/tabs/your-group-name/
html/tabs/your-group-name/
js/tabs/your-group-name/
```

#### Step 2: Create Configuration Files

For each tab in your group, create a **`.json` file** in `config/tabs/your-group-name/`:

```json
{
  "entityName": "your-entity",
  "apiEndpoint": "your-entities",
  "tableId": "your-entity-table",
  "tabName": "your-entity",
  "formId": "your-entity-form",
  "formContainerId": "your-entityForm",
  "crudId": "your-entities",
  "defaultSearchField": "name",
  "enableSearch": true,
  "columns": [
    {
      "key": "id",
      "label": "ID",
      "display": true,
      "searchable": false
    },
    {
      "key": "name",
      "label": "Name",
      "display": true,
      "searchable": true
    }
  ],
  "formFields": [
    {
      "id": "your-entity-name",
      "key": "name",
      "label": "Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter name",
      "pattern": "[a-zA-Z\\s]*",
      "maxLength": 100
    }
  ]
}
```

**Key fields to customize:**
- **`entityName`** – Singular entity name (e.g., `"product"`)
- **`apiEndpoint`** – REST API endpoint (e.g., `"products"`)
- **`tableId`** – Unique HTML table ID
- **`tabName`** – Display name for the tab
- **`formId`** – Unique form ID
- **`formContainerId`** – Container div ID for the form
- **`columns`** – Table columns with `key`, `label`, `display`, `searchable`
- **`formFields`** – Form input fields with validation rules

#### Step 3: Create HTML File

Create a **`.html` file** in `html/tabs/your-group-name/`:

```html
<div id="your-entity-tab" class="tab-content">
  <!-- Messages and Loading States -->
  <div id="your-entity-message" class="message"></div>
  <div id="your-entity-loading" class="loading">Loading your entities...</div>

  <!-- Add New Button -->
  <div id="addYourEntityButtonGroup" class="button-group" style="margin-bottom: 20px;">
    <button class="btn-primary" onclick="your-entityCrudManager.toggleFormVisibility(true);">
      + Add New Your Entity
    </button>
  </div>

  <!-- Form (Hidden by Default) -->
  <div id="your-entityForm" class="form-section hidden" data-auto-generate="true">
    <!-- Form will be generated here -->
  </div>

  <!-- List Container -->
  <div class="list-container">
    <!-- Dynamic Filter Row -->
    <div id="your-entity-filter-row-container" class="filter-row">
      <!-- Filter UI generated dynamically -->
    </div>
    <!-- Table -->
    <table id="your-entity-table">
      <thead>
        <!-- Headers generated dynamically -->
      </thead>
      <tbody>
        <!-- Data rows generated dynamically -->
      </tbody>
    </table>
  </div>
</div>
```

**Key naming conventions:**
- Replace `your-entity` with your actual entity name (e.g., `product`, `category`)
- Use kebab-case for IDs (e.g., `product-table`, `productForm`)
- Use camelCase for JavaScript variable names (e.g., `productCrudManager`)

#### Step 4: Create JavaScript File

Create a **`.js` file** in `js/tabs/your-group-name/`:

```javascript
// Initialize Your Entity CRUD Manager
let your-entityCrudManager;

/**
 * Initialize function called by tab-manager when tab is loaded
 */
async function initializeYourEntityCRUD() {
  console.log('📍 initializeYourEntityCRUD');
  const configResponse = await fetch('config/tabs/your-group-name/your-entity.json');
  const config = await configResponse.json();
  
  your-entityCrudManager = new CRUDManager(config, apiClient);
  your-entityCrudManager.initializeTable();
  
  // Make it available globally
  window.your-entityCrudManager = your-entityCrudManager;
  window.crudManager = your-entityCrudManager;

  // Generate form if needed
  your-entityCrudManager.generateFormIfNeeded();  

  await your-entityCrudManager.loadAll();
  your-entityCrudManager.setupFormSubmit('create');
}
```

**Important:** Replace `your-entity` with your actual entity name, using camelCase for variable names.

---

### Adding a New Theme

#### Step 1: Create Theme CSS Folder

Create a new folder in `css/` with your theme name:

```
css/your-theme-name/
```

#### Step 2: Create CSS Files

Create the following **`.css` files** in `css/your-theme-name/`:

```
css/your-theme-name/
├── header.css
├── layout.css
├── tabs.css
├── forms.css
├── buttons.css
├── tables.css
├── messages.css
├── utilities.css
├── responsive.css
├── console.css
├── toast.css
└── list.css
```

You can copy and modify the existing theme files (e.g., from `css/default/` or `css/dark/`) as a starting point.

#### Step 3: Update Theme Manager

Open `js/theme-manager.js` and update the **`availableThemes`** array:

```javascript
class ThemeManager {
  constructor() {
    this.storageKey = 'selectedTheme';
    this.defaultTheme = 'default';
    this.availableThemes = ['default', 'dark', 'your-theme-name']; // ← ADD YOUR THEME HERE
    this.currentTheme = null;
  }
  
  // ... rest of the code
}
```

#### Step 4: Update Theme File List (if needed)

In the `loadThemeStylesheets()` method, verify the theme files match your created files:

```javascript
loadThemeStylesheets(themeName) {
  // Remove ALL old theme stylesheets first
  const links = document.querySelectorAll('link[data-theme]');
  links.forEach(link => link.remove());

  const themeFiles = [
    'header.css',
    'layout.css',
    'tabs.css',
    'forms.css',
    'buttons.css',
    'tables.css',
    'messages.css',
    'utilities.css',
    'responsive.css',
    'console.css',
    'toast.css',
    'list.css'
  ];

  themeFiles.forEach(file => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `css/${themeName}/${file}`;
    link.setAttribute('data-theme', themeName);
    document.head.appendChild(link);
  });
}
```

---

### CSS Files Explained

| File | Purpose |
|------|---------|
| **header.css** | Header styling, navigation bar, logo |
| **layout.css** | Main layout grid, containers, spacing |
| **tabs.css** | Tab navigation and tab content styling |
| **forms.css** | Form elements, inputs, labels, validation |
| **buttons.css** | Button styles, hover states, sizes |
| **tables.css** | Table styling, rows, cells, borders |
| **messages.css** | Alert, error, success, info message styles |
| **utilities.css** | Utility classes, margins, padding, display |
| **responsive.css** | Media queries, mobile/tablet adjustments |
| **console.css** | Developer console/debug panel styling |
| **toast.css** | Toast notification styling |
| **list.css** | List containers and item styling |

---

### Quick Reference: File Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| **Entity Name** | kebab-case | `product`, `user-profile`, `order-item` |
| **IDs (HTML)** | kebab-case | `product-table`, `product-form` |
| **Variables (JS)** | camelCase | `productCrudManager`, `orderItemCrudManager` |
| **Functions** | camelCase | `initializeProductCRUD()` |
| **Config Files** | kebab-case.json | `products.json`, `user-profiles.json` |
| **CSS Classes** | kebab-case | `btn-primary`, `form-section` |

---

### Complete Example: Adding a "Suppliers" Group with "Suppliers" Tab

#### 1. Create Folders
```
config/tabs/suppliers/
html/tabs/suppliers/
js/tabs/suppliers/
```

#### 2. Create `config/tabs/suppliers/suppliers.json`
```json
{
  "entityName": "supplier",
  "apiEndpoint": "suppliers",
  "tableId": "suppliers-table",
  "tabName": "suppliers",
  "formId": "supplier-form",
  "formContainerId": "supplierForm",
  "crudId": "suppliers",
  "defaultSearchField": "name",
  "enableSearch": true,
  "columns": [
    {
      "key": "id",
      "label": "ID",
      "display": true,
      "searchable": false
    },
    {
      "key": "name",
      "label": "Supplier Name",
      "display": true,
      "searchable": true
    },
    {
      "key": "email",
      "label": "Email",
      "display": true,
      "searchable": true
    },
    {
      "key": "phone",
      "label": "Phone",
      "display": true,
      "searchable": false
    }
  ],
  "formFields": [
    {
      "id": "supplier-name",
      "key": "name",
      "label": "Supplier Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter supplier name",
      "pattern": "[a-zA-Z0-9\\s,.\\-]*",
      "maxLength": 100
    },
    {
      "id": "supplier-email",
      "key": "email",
      "label": "Email",
      "type": "email",
      "required": true,
      "placeholder": "Enter email address"
    },
    {
      "id": "supplier-phone",
      "key": "phone",
      "label": "Phone",
      "type": "text",
      "required": false,
      "placeholder": "Enter phone number",
      "pattern": "[0-9\\-\\+\\s]*",
      "maxLength": 20
    }
  ]
}
```

#### 3. Create `html/tabs/suppliers/suppliers.html`
```html
<div id="suppliers-tab" class="tab-content">
  <div id="suppliers-message" class="message"></div>
  <div id="suppliers-loading" class="loading">Loading suppliers...</div>

  <div id="addSupplierButtonGroup" class="button-group" style="margin-bottom: 20px;">
    <button class="btn-primary" onclick="suppliersCrudManager.toggleFormVisibility(true);">
      + Add New Supplier
    </button>
  </div>

  <div id="supplierForm" class="form-section hidden" data-auto-generate="true">
    <!-- Form will be generated here -->
  </div>

  <div class="list-container">
    <div id="supplier-filter-row-container" class="filter-row">
      <!-- Filter UI generated dynamically -->
    </div>
    <table id="suppliers-table">
      <thead></thead>
      <tbody></tbody>
    </table>
  </div>
</div>
```

#### 4. Create `js/tabs/suppliers/suppliers.js`
```javascript
let suppliersCrudManager;

async function initializeSuppliersCRUD() {
  console.log('📍 initializeSuppliersCRUD');
  const configResponse = await fetch('config/tabs/suppliers/suppliers.json');
  const config = await configResponse.json();
  
  suppliersCrudManager = new CRUDManager(config, apiClient);
  suppliersCrudManager.initializeTable();
  
  window.suppliersCrudManager = suppliersCrudManager;
  window.crudManager = suppliersCrudManager;

  suppliersCrudManager.generateFormIfNeeded();  

  await suppliersCrudManager.loadAll();
  suppliersCrudManager.setupFormSubmit('create');
}
```

---

### Checklist for Adding New Tabs

- [ ] Create folder: `config/tabs/group-name/`
- [ ] Create folder: `html/tabs/group-name/`
- [ ] Create folder: `js/tabs/group-name/`
- [ ] Create `config/tabs/group-name/entity-name.json`
- [ ] Create `html/tabs/group-name/entity-name.html`
- [ ] Create `js/tabs/group-name/entity-name.js`
- [ ] Verify all IDs are unique across the application
- [ ] Test API endpoint exists on Spring Boot server
- [ ] Load the tab in the tab manager

---

### Checklist for Adding New Themes

- [ ] Create folder: `css/theme-name/`
- [ ] Create all 12 CSS files in the theme folder
- [ ] Copy and customize CSS from existing theme
- [ ] Update `availableThemes` array in `js/theme-manager.js`
- [ ] Test theme switching in browser
- [ ] Verify all colors and styles are consistent
- [ ] Test responsive design on mobile/tablet


### webClient v2 folders' map

```
.
├── config
│   └── tabs
│       ├── customers
│       │   ├── addresses.json
│       │   ├── customers.json
│       │   └── user-profiles.json
│       ├── orders
│       │   ├── order-items.json
│       │   └── orders.json
│       ├── products
│       │   ├── categories.json
│       │   ├── product-images.json
│       │   └── products.json
│       └── promotions
│           ├── product-promotions.json
│           └── promotions.json
├── css
│   ├── base.css
│   ├── dark
│   │   ├── buttons.css
│   │   ├── console.css
│   │   ├── forms.css
│   │   ├── header.css
│   │   ├── layout.css
│   │   ├── list.css
│   │   ├── messages.css
│   │   ├── responsive.css
│   │   ├── tables.css
│   │   ├── tabs.css
│   │   ├── toast.css
│   │   └── utilities.css
│   ├── default
│   │   ├── buttons.css
│   │   ├── console.css
│   │   ├── forms.css
│   │   ├── header.css
│   │   ├── layout.css
│   │   ├── list.css
│   │   ├── messages.css
│   │   ├── responsive.css
│   │   ├── tables.css
│   │   ├── tabs.css
│   │   ├── toast.css
│   │   └── utilities.css
│   ├── style.css
│   ├── theme-switcher.css
│   └── toast-base.css
├── html
│   └── tabs
│       ├── customers
│       │   ├── addresses.html
│       │   ├── customers.html
│       │   └── user-profiles.html
│       ├── orders
│       │   ├── order-items.html
│       │   └── orders.html
│       ├── products
│       │   ├── categories.html
│       │   ├── product-images.html
│       │   └── products.html
│       └── promotions
│           ├── product-promotions.html
│           └── promotions.html
├── index.html
├── js
│   ├── api-client.js
│   ├── app-init.js
│   ├── console.js
│   ├── console-logger.js
│   ├── crud-manager.js
│   ├── data-manager.js
│   ├── form-builder.js
│   ├── form-manager.js
│   ├── id-generator.js
│   ├── search-filter.js
│   ├── table-renderer.js
│   ├── tab-manager.js
│   ├── tabs
│   │   ├── customers
│   │   │   ├── addresses.js
│   │   │   ├── customers.js
│   │   │   └── user-profiles.js
│   │   ├── orders
│   │   │   ├── order-items.js
│   │   │   └── orders.js
│   │   ├── products
│   │   │   ├── categories.js
│   │   │   ├── product-images.js
│   │   │   └── products.js
│   │   └── promotions
│   │       ├── product-promotions.js
│   │       └── promotions.js
│   ├── theme-manager.js
│   ├── ui-controller.js
│   └── utility-helper.js
└── proxy.php
```

## ScreenShots

### webClient v2

![webclient2](screenshots/screenshot-webclient2-1.png)

![webclient2](screenshots/screenshot-webclient2-2.png)

![webclient2](screenshots/screenshot-webclient2-3.png)

### webClient v1

![webclient](screenshots/screenshot3.png)

![webclient](screenshots/screenshot4.png)

![webclient](screenshots/screenshot2.png)

### Resttester v1

![webclient](screenshots/screenshot1.png)
