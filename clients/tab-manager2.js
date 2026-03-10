/**
 * Generic Tab Manager
 * Handles:
 * - Dynamic group and tab loading
 * - Tab switching
 * - localStorage persistence (remembers last active tab)
 * - Dynamic script loading for each tab
 */

class TabManager {
  constructor() {
    this.groups = [];
    this.currentGroup = null;
    this.currentTab = null;
    this.storageKey = 'activeTabState';
    this.loadedTabs = new Set();
  }

  async initializeGroups(groupsConfig) {
    this.groups = groupsConfig;
    console.log('🚀 Initializing Tab Manager with groups:', this.groups);
    
    await this.loadGroupsUI();
    this.createTabContainers();
    this.restoreLastActiveTab();
    this.attachGroupListeners();
    this.attachTabListeners();
    
    console.log('✅ Tab Manager initialization complete');
  }

  async loadGroupsUI() {
    const groupsContainer = document.getElementById('groups-container');
    
    for (const group of this.groups) {
      const path = `html/groups/${group.id}-group.html`;
      console.log(`📂 Loading group HTML: ${path}`);
      
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const html = await response.text();
        groupsContainer.insertAdjacentHTML('beforeend', html);
        console.log(`✅ Loaded group: ${group.id}`);
      } catch (error) {
        console.error(`❌ Failed to load group: ${group.id} - ${error.message}`);
      }
    }
  }

  createTabContainers() {
    const container = document.getElementById('tabs-container');
    console.log('📋 Creating tab containers...');
    
    for (const group of this.groups) {
      for (const tab of group.tabs) {
        const tabElement = document.createElement('div');
        tabElement.setAttribute('data-tab-content', tab.id);
        tabElement.classList.add('hidden');
        container.appendChild(tabElement);
        console.log(`  ✓ Created container for tab: ${tab.id} (group: ${group.id})`);
      }
    }
    
    console.log(`✅ Tab containers created. Total: ${container.children.length}`);
  }

  attachGroupListeners() {
    const buttons = document.querySelectorAll('[data-group]');
    console.log(`🔗 Attaching listeners to ${buttons.length} group buttons`);
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        console.log(`👆 Group button clicked: ${e.target.dataset.group}`);
        this.switchGroup(e.target.dataset.group);
      });
    });
  }

  attachTabListeners() {
    const buttons = document.querySelectorAll('[data-tab]');
    console.log(`🔗 Attaching listeners to ${buttons.length} tab buttons`);
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabId = e.target.dataset.tab;
        const groupId = e.target.closest('[data-group-id]')?.dataset.groupId;
        console.log(`👆 Tab button clicked: ${tabId} (group: ${groupId})`);
        this.switchTab(tabId, groupId);
      });
    });
  }

  async switchGroup(groupId) {
    console.log(`🔄 Switching to group: ${groupId}`);
    this.currentGroup = groupId;
    
    document.querySelectorAll('[data-group]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.group === groupId);
    });

    const group = this.groups.find(g => g.id === groupId);
    if (group && group.tabs.length > 0) {
      console.log(`  → Switching to first tab of group: ${group.tabs[0].id}`);
      this.switchTab(group.tabs[0].id, groupId);
    }

    this.saveActiveTab();
  }

  async switchTab(tabId, groupId = this.currentGroup) {
    console.log(`🔄 Switching to tab: ${tabId} (group: ${groupId})`);
    this.currentTab = tabId;
    this.currentGroup = groupId;

    document.querySelectorAll('[data-tab-content]').forEach(el => {
      el.classList.add('hidden');
    });

    const activeTab = document.querySelector(`[data-tab-content="${tabId}"]`);
    if (activeTab) {
      activeTab.classList.remove('hidden');
      console.log(`  ✅ Tab element found and shown`);
    } else {
      console.error(`  ❌ Tab element NOT found for: ${tabId}`, 'error');
    }

    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    await this.loadTabContent(tabId, groupId);

    // ← ADD THIS: Call loadAll() for the current CRUD manager
    this.reloadTabData(tabId, groupId);

    this.saveActiveTab();
  }

  async reloadTabData(tabId, groupId) {
    const crudManagerName = `${this.capitalizeTabId(tabId)}CrudManager`;
    
    // DEBUG: Log all CRUD managers in window
    console.log(`🔍 Looking for: ${crudManagerName}`);
    console.log(`   Available in window:`, Object.keys(window).filter(key => key.includes('CrudManager') || key.includes('crudManager')));
    
    const crudManager = window[crudManagerName];
    
    if (crudManager && typeof crudManager.loadAll === 'function') {
      console.log(`🔄 Calling loadAll() for ${crudManagerName}`);
      await crudManager.loadAll();
    } else {
      console.warn(`⚠️  CRUD manager not found: ${crudManagerName}`);
      console.warn(`   crudManager value: ${crudManager}`);
    }
  }

  capitalizeTabId(tabId) {
    return tabId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }


  async loadTabContent(tabId, groupId) {
    const tabKey = `${groupId}/${tabId}`;
    
    if (this.loadedTabs.has(tabKey)) {
      console.log(`  ⚡ Tab already loaded (cached): ${tabKey}`);
      return;
    }

    const tabElement = document.querySelector(`[data-tab-content="${tabId}"]`);
    const htmlPath = `html/tabs/${groupId}/${tabId}.html`;

    console.log(`📂 Loading tab HTML: ${htmlPath}`);

    try {
      const response = await fetch(htmlPath);
      console.log(`  📡 Fetch response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - File not found or server error`);
      }
      
      const html = await response.text();
      console.log(`  ✅ HTML fetched successfully, size: ${html.length} bytes`);
      
      if (tabElement) {
        tabElement.innerHTML = html;
        console.log(`  ✅ HTML injected into tab element`);
      } else {
        console.log, 'error'(`  ❌ Tab element container not found for: ${tabId}`);
      }

      this.loadedTabs.add(tabKey);
      await this.loadTabScript(tabId, groupId);
    } catch (error) {
      console.error(`❌ Failed to load tab HTML: ${htmlPath}`);
      console.error(`   Error: ${error.message}`);
      
      if (tabElement) {
        tabElement.innerHTML = `
          <div style="padding: 20px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">
            <strong>❌ Error loading tab content</strong><br>
            Path: <code>${htmlPath}</code><br>
            Error: ${error.message}
          </div>
        `;
      }
    }
  }

  async loadTabScript(tabId, groupId) {
    const scriptPath = `js/${groupId}/${tabId}.js`;
    const initFunctionName = `initialize${this.capitalizeTabId(tabId)}CRUD`;
    
    console.log(`📄 Loading tab script: ${scriptPath}`);

    // If script already loaded, just call init function
    if (document.querySelector(`script[src="${scriptPath}"]`)) {
      console.log(`  ⚡ Script already loaded (cached): ${scriptPath}`);
      if (typeof window[initFunctionName] === 'function') {
        console.log(`  🔄 Calling cached init function: ${initFunctionName}`);
        await window[initFunctionName]();
      }
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = scriptPath;
        script.async = true;
        script.onload = async () => {  // ← ADD async here
          console.log(`✅ Script loaded: ${scriptPath}`);
          
          if (typeof window[initFunctionName] === 'function') {
            console.log(`  🔄 Calling init function: ${initFunctionName}`);
            await window[initFunctionName]();
          }
          resolve();
        };
        script.onerror = () => {
          console.warn(`⚠️  Script not found or failed to load: ${scriptPath}`);
          resolve();
        };
        document.head.appendChild(script);
      } catch (error) {
        console.warn(`⚠️  Failed to create script element: ${scriptPath}`);
        reject(error);
      }
    });
  }

  saveActiveTab() {
    const state = {
      group: this.currentGroup,
      tab: this.currentTab,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(state));
    console.log(`💾 Saved active tab state: ${state.group}/${state.tab}`);
  }

  restoreLastActiveTab() {
    const saved = localStorage.getItem(this.storageKey);
    
    if (saved) {
      try {
        const state = JSON.parse(saved);
        console.log(`📖 Restoring saved tab state: ${state.group}/${state.tab}`);
        
        const group = this.groups.find(g => g.id === state.group);
        
        if (group && group.tabs.find(t => t.id === state.tab)) {
          this.switchGroup(state.group);
          return;
        } else {
          console.warn(`⚠️  Saved tab state not found in config, using default`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to restore tab state: ${error.message}`);
      }
    }

    if (this.groups.length > 0) {
      console.log(`📖 Using default: first group and tab`);
      this.switchGroup(this.groups[0].id);
    }
  }

  clearTabState() {
    localStorage.removeItem(this.storageKey);
    console.log(`🗑️  Cleared saved tab state`);
  }
}

window.tabManager = new TabManager();
