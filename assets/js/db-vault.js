/**
 * Free-of-Cost Hybrid Database Vault for Aditya Soni Portfolio
 * Multi-layer architecture:
 * 1. Persistent Browser Database: IndexedDB (`AdityaPortfolioDB` -> `contacts`)
 * 2. Redundant LocalStorage Vault: (`portfolio_contacts_vault`)
 * 3. Free Cloud Serverless Database & Real-Time Email Forwarding via FormSubmit AJAX (Zero-cost, no credit card required)
 * 4. Local SQLite / Python API sync fallback (/api/contact)
 * 5. Interactive Database Management Modal with CSV / JSON export
 */

(function initDatabaseVaultEngine() {
  'use strict';

  const DB_NAME = 'AdityaPortfolioDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'contacts';
  const LOCAL_STORAGE_KEY = 'portfolio_contacts_vault';
  const CLOUD_ENDPOINT = 'https://formsubmit.co/ajax/mradityasoni.cse@gmail.com';

  let dbInstance = null;

  // 1. Initialize IndexedDB
  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (dbInstance) return resolve(dbInstance);
      if (!window.indexedDB) {
        console.warn('[DB Vault] IndexedDB not supported; utilizing LocalStorage fallback.');
        return resolve(null);
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('email', 'email', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        dbInstance = e.target.result;
        resolve(dbInstance);
      };

      request.onerror = (e) => {
        console.error('[DB Vault] IndexedDB error:', e.target.error);
        resolve(null);
      };
    });
  }

  // 2. LocalStorage Fallback Helpers
  function getLocalStorageContacts() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      return [];
    }
  }

  function saveLocalStorageContacts(contacts) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
    } catch (err) {
      console.warn('[DB Vault] LocalStorage save error:', err);
    }
  }

  // 3. Save contact record to multi-layer database
  async function saveContactRecord(name, email, message, source = 'Contact Form') {
    const recordId = 'SEC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    const newRecord = {
      id: recordId,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      source: source,
      timestamp: timestamp,
      formattedDate: formattedDate,
      status: 'new'
    };

    // Layer 1: Save to IndexedDB
    try {
      const db = await openDatabase();
      if (db) {
        const tx = db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(newRecord);
      }
    } catch (err) {
      console.warn('[DB Vault] IndexedDB write failed:', err);
    }

    // Layer 2: Save to LocalStorage Redundant Vault
    const localList = getLocalStorageContacts();
    localList.unshift(newRecord);
    saveLocalStorageContacts(localList);

    // Layer 3: Free Cloud Database / Notification Sync (FormSubmit AJAX)
    try {
      fetch(CLOUD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Portfolio Inquiry from ${newRecord.name} [${newRecord.id}]`,
          name: newRecord.name,
          email: newRecord.email,
          message: newRecord.message,
          source: newRecord.source,
          timestamp: newRecord.formattedDate,
          record_id: newRecord.id
        })
      }).catch(e => console.log('[DB Vault] Cloud async sync dispatched'));
    } catch (e) {
      // Non-blocking
    }

    // Layer 4: Local Server API Sync (if local server is running)
    try {
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      }).catch(() => {});
    } catch (e) {}

    // Dispatch update event for UI
    window.dispatchEvent(new CustomEvent('db-contacts-updated', { detail: newRecord }));

    return newRecord;
  }

  // 4. Retrieve all records
  async function getAllContactRecords() {
    try {
      const db = await openDatabase();
      if (db) {
        return new Promise((resolve) => {
          const tx = db.transaction([STORE_NAME], 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.getAll();
          req.onsuccess = () => {
            const results = req.result || [];
            if (results.length > 0) {
              results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
              resolve(results);
            } else {
              resolve(getLocalStorageContacts());
            }
          };
          req.onerror = () => resolve(getLocalStorageContacts());
        });
      }
    } catch (err) {
      // Fallback
    }
    return getLocalStorageContacts();
  }

  // 5. Delete record
  async function deleteContactRecord(id) {
    try {
      const db = await openDatabase();
      if (db) {
        const tx = db.transaction([STORE_NAME], 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
      }
    } catch (err) {}

    const localList = getLocalStorageContacts().filter(item => item.id !== id);
    saveLocalStorageContacts(localList);
    window.dispatchEvent(new CustomEvent('db-contacts-updated'));
  }

  // 6. Export Utilities
  async function exportDatabaseJSON() {
    const records = await getAllContactRecords();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `aditya_portfolio_contacts_${Date.now()}.json`);
    dlAnchor.click();
  }

  async function exportDatabaseCSV() {
    const records = await getAllContactRecords();
    if (records.length === 0) {
      alert('No database records to export yet.');
      return;
    }
    const headers = ['ID', 'Date', 'Name', 'Email', 'Source', 'Message'];
    const rows = records.map(r => [
      `"${r.id}"`,
      `"${r.formattedDate || r.timestamp}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.source || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aditya_portfolio_contacts_${Date.now()}.csv`);
    link.click();
  }

  // 7. Inject Database Vault Modal UI into DOM
  function injectDatabaseVaultModal() {
    if (document.getElementById('db-vault-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'db-vault-modal';
    modal.className = 'fixed inset-0 z-[10002] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300';
    modal.innerHTML = `
      <div class="w-full max-w-4xl max-h-[85vh] bg-[#0c1019] border border-white/15 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transform scale-95 transition-transform duration-300" id="db-vault-dialog">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red">
              <span class="material-symbols-outlined text-xl">database</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display font-bold text-white text-lg">Contact Database Vault</h3>
                <span class="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Free Cloud &amp; Local DB
                </span>
              </div>
              <p class="font-mono text-xs text-slate-400">Persistent IndexedDB + FormSubmit Cloud Forwarding</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button id="db-export-csv" class="glass-pill px-3 py-1.5 font-mono text-xs text-white hover:text-emerald-400 flex items-center gap-1.5 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">table_view</span>
              <span>Export CSV</span>
            </button>
            <button id="db-export-json" class="glass-pill px-3 py-1.5 font-mono text-xs text-white hover:text-cyan-400 flex items-center gap-1.5 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">code</span>
              <span>JSON</span>
            </button>
            <button id="db-close-btn" class="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer" aria-label="Close">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        <!-- Filter / Stats Bar -->
        <div class="px-6 py-3 bg-white/[0.01] border-b border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div class="text-slate-300">
            Total Submissions: <span id="db-vault-count" class="font-bold text-accent-red">0</span>
          </div>
          <div class="flex items-center gap-2">
            <input type="text" id="db-search-input" placeholder="Search by name, email, or text..." class="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-white text-xs placeholder:text-white/30 focus:border-accent-red/50 outline-none w-64">
          </div>
        </div>

        <!-- Records List Container -->
        <div class="p-6 overflow-y-auto flex-1 space-y-3" id="db-records-list">
          <div class="text-center py-12 text-slate-500 font-mono text-xs">
            Loading database records...
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event Listeners for Modal
    document.getElementById('db-close-btn').addEventListener('click', closeDatabaseVaultModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeDatabaseVaultModal();
    });
    document.getElementById('db-export-csv').addEventListener('click', exportDatabaseCSV);
    document.getElementById('db-export-json').addEventListener('click', exportDatabaseJSON);
    document.getElementById('db-search-input').addEventListener('input', (e) => {
      renderRecordsInModal(e.target.value);
    });
  }

  async function renderRecordsInModal(query = '') {
    const listEl = document.getElementById('db-records-list');
    const countEl = document.getElementById('db-vault-count');
    if (!listEl) return;

    const records = await getAllContactRecords();
    if (countEl) countEl.textContent = records.length;

    const filtered = query.trim()
      ? records.filter(r => 
          (r.name || '').toLowerCase().includes(query.toLowerCase()) ||
          (r.email || '').toLowerCase().includes(query.toLowerCase()) ||
          (r.message || '').toLowerCase().includes(query.toLowerCase())
        )
      : records;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="text-center py-16 text-slate-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
          <span class="material-symbols-outlined text-4xl text-slate-600">inbox</span>
          <span>${records.length === 0 ? 'No messages received yet. Submit the contact form or use the AI Chatbot to see records appear here in real-time!' : 'No matching records found for query.'}</span>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(item => `
      <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-accent-red/40 transition-all flex flex-col gap-2 relative group">
        <div class="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="font-bold text-white text-sm">${escapeHtml(item.name)}</span>
            <span class="text-slate-400">&lt;${escapeHtml(item.email)}&gt;</span>
            <span class="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-cyan-300">${escapeHtml(item.source || 'Contact Form')}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-slate-500 text-[11px]">${escapeHtml(item.formattedDate || item.timestamp)}</span>
            <span class="text-[10px] font-mono text-white/30">#${item.id}</span>
            <button onclick="window.PortfolioDB.deleteContact('${item.id}')" class="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors" title="Delete from Local DB">
              <span class="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </div>
        <p class="font-body-md text-sm text-slate-300 whitespace-pre-wrap mt-1 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 font-light">
          ${escapeHtml(item.message)}
        </p>
      </div>
    `).join('');
  }

  function openDatabaseVaultModal() {
    injectDatabaseVaultModal();
    const modal = document.getElementById('db-vault-modal');
    const dialog = document.getElementById('db-vault-dialog');
    if (modal && dialog) {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      dialog.classList.remove('scale-95');
      dialog.classList.add('scale-100');
      renderRecordsInModal();
    }
  }

  function closeDatabaseVaultModal() {
    const modal = document.getElementById('db-vault-modal');
    const dialog = document.getElementById('db-vault-dialog');
    if (modal && dialog) {
      modal.classList.add('opacity-0', 'pointer-events-none');
      dialog.classList.remove('scale-100');
      dialog.classList.add('scale-95');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Keyboard shortcut: Alt+D to open Database Vault
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      openDatabaseVaultModal();
    }
  });

  // Expose global interface
  window.PortfolioDB = {
    saveContact: saveContactRecord,
    getAllContacts: getAllContactRecords,
    deleteContact: async (id) => {
      await deleteContactRecord(id);
      renderRecordsInModal();
    },
    exportJSON: exportDatabaseJSON,
    exportCSV: exportDatabaseCSV,
    openVault: openDatabaseVaultModal,
    closeVault: closeDatabaseVaultModal
  };

  // Pre-seed sample contact record if DB is completely empty so user immediately sees database structure
  setTimeout(async () => {
    const existing = await getAllContactRecords();
    if (existing.length === 0) {
      saveLocalStorageContacts([
        {
          id: 'SEC-DEMO-001',
          name: 'Sarah Jenkins (Tech Lead)',
          email: 'sarah.j@distributed-cloud.io',
          message: 'Hi Aditya, saw your Raft consensus cluster and 120 FPS raymarching shader. We have a Distributed Systems Architect role opening and would love to chat with you!',
          source: 'System Initializer',
          timestamp: new Date().toISOString(),
          formattedDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
          status: 'verified'
        }
      ]);
    }
  }, 1000);

})();
