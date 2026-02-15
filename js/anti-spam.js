// ANTI-SPAM SYSTEM GLOBAL - Professional Edition
// Untuk semua halaman dan semua kalkulator

const AntiSpamSystem = {
    // State untuk setiap tipe kalkulator
    states: {
        bmi: {
            isCalculating: false,
            lastCalculationTime: 0,
            lastCalculationData: null,
            calculationCount: 0,
            totalCalculations: 0
        },
        carbon: {
            isCalculating: false,
            lastCalculationTime: 0,
            lastCalculationData: null,
            calculationCount: 0,
            totalCalculations: 0
        },
        bmr: {
            isCalculating: false,
            lastCalculationTime: 0,
            lastCalculationData: null,
            calculationCount: 0,
            totalCalculations: 0
        },
        ideal: {
            isCalculating: false,
            lastCalculationTime: 0,
            lastCalculationData: null,
            calculationCount: 0,
            totalCalculations: 0
        },
        save: {
            lastSaveTime: 0,
            lastSaveData: null,
            saveCount: 0
        },
        history: {
            lastSaveTime: 0,
            lastSaveData: null,
            saveCount: 0
        }
    },

    // Konfigurasi
    config: {
        MIN_CALCULATION_INTERVAL: 2000,        // 2 detik antar kalkulasi
        MIN_SAVE_INTERVAL: 5000,                // 5 detik antar save
        MIN_HISTORY_INTERVAL: 3000,             // 3 detik antar history
        MAX_DAILY_CALCULATIONS: 100,             // Maksimal 100 kalkulasi per hari
        MAX_HISTORY_RECORDS: 30,                  // Maksimal 30 records di history
        ENABLE_DEBUG: false                        // Debug mode
    },

    // Inisialisasi
    init: function() {
        console.log('🛡️ Anti-Spam System initialized');
        this.loadDailyStats();
        this.setupEventListeners();
    },

    // Load statistik harian dari localStorage
    loadDailyStats: function() {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('antiSpamStats');
        
        if (saved) {
            const stats = JSON.parse(saved);
            if (stats.date === today) {
                this.states.bmi.totalCalculations = stats.bmi || 0;
                this.states.carbon.totalCalculations = stats.carbon || 0;
                this.states.bmr.totalCalculations = stats.bmr || 0;
                this.states.ideal.totalCalculations = stats.ideal || 0;
            }
        }
    },

    // Simpan statistik harian
    saveDailyStats: function() {
        const stats = {
            date: new Date().toDateString(),
            bmi: this.states.bmi.totalCalculations,
            carbon: this.states.carbon.totalCalculations,
            bmr: this.states.bmr.totalCalculations,
            ideal: this.states.ideal.totalCalculations
        };
        localStorage.setItem('antiSpamStats', JSON.stringify(stats));
    },

    // CEK SPAM: Bolehkah melakukan kalkulasi?
    canCalculate: function(type, inputData) {
        const state = this.states[type];
        if (!state) return false;

        const now = Date.now();

        // Debug log
        if (this.config.ENABLE_DEBUG) {
            console.log(`Checking ${type}:`, {
                isCalculating: state.isCalculating,
                timeSinceLast: now - state.lastCalculationTime,
                minInterval: this.config.MIN_CALCULATION_INTERVAL,
                dailyCount: state.totalCalculations,
                maxDaily: this.config.MAX_DAILY_CALCULATIONS
            });
        }

        // CEK 1: Apakah sedang calculating?
        if (state.isCalculating) {
            this.showNotification(`Please wait, ${type} calculation in progress...`, 'warning');
            return false;
        }

        // CEK 2: Cek interval waktu
        if (now - state.lastCalculationTime < this.config.MIN_CALCULATION_INTERVAL) {
            const waitTime = Math.ceil((this.config.MIN_CALCULATION_INTERVAL - (now - state.lastCalculationTime)) / 1000);
            this.showNotification(`Please wait ${waitTime} second before next ${type} calculation`, 'warning');
            return false;
        }

        // CEK 3: Cek duplicate data
        if (state.lastCalculationData && 
            JSON.stringify(inputData) === JSON.stringify(state.lastCalculationData)) {
            this.showNotification('This data has already been calculated', 'info');
            return false;
        }

        // CEK 4: Batas harian
        if (state.totalCalculations >= this.config.MAX_DAILY_CALCULATIONS) {
            this.showNotification('Daily calculation limit reached (100)', 'error');
            return false;
        }

        return true;
    },

    // START calculation
    startCalculation: function(type, inputData) {
        const state = this.states[type];
        if (!state) return false;

        state.isCalculating = true;
        state.calculationCount++;
        state.totalCalculations++;
        
        // Simpan data untuk cek duplicate nanti
        state.lastCalculationData = inputData;

        // Update button state
        this.setButtonLoading(type, true);

        // Simpan statistik
        this.saveDailyStats();

        return true;
    },

    // END calculation
    endCalculation: function(type) {
        const state = this.states[type];
        if (!state) return;

        state.isCalculating = false;
        state.lastCalculationTime = Date.now();

        // Update button state
        this.setButtonLoading(type, false);

        // Debug log
        if (this.config.ENABLE_DEBUG) {
            console.log(`${type} calculation completed. Total today: ${state.totalCalculations}`);
        }
    },

    // Set button loading state
    setButtonLoading: function(type, isLoading) {
        const buttonSelectors = {
            bmi: 'button[onclick*="hitungBMI"]',
            carbon: 'button[onclick*="hitungCarbon"]',
            bmr: 'button[onclick*="hitungBMR"]',
            ideal: 'button[onclick*="hitungIdeal"]'
        };

        const selector = buttonSelectors[type];
        if (!selector) return;

        const button = document.querySelector(selector);
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.classList.add('opacity-70', 'cursor-not-allowed');
            
            // Simpan original text
            button.dataset.originalText = button.innerHTML;
            
            button.innerHTML = `
                <i class="fas fa-spinner fa-spin mr-2"></i>
                <span>Calculating...</span>
            `;
        } else {
            button.disabled = false;
            button.classList.remove('opacity-70', 'cursor-not-allowed');
            
            // Restore original text
            if (button.dataset.originalText) {
                button.innerHTML = button.dataset.originalText;
            }
        }
    },

    // CEK SPAM untuk save
    canSave: function(type = 'save', data) {
        const state = this.states[type];
        const now = Date.now();

        // CEK interval waktu
        if (now - state.lastSaveTime < this.config.MIN_SAVE_INTERVAL) {
            const waitTime = Math.ceil((this.config.MIN_SAVE_INTERVAL - (now - state.lastSaveTime)) / 1000);
            this.showNotification(`Please wait ${waitTime} second before saving again`, 'warning');
            return false;
        }

        // CEK duplicate
        if (state.lastSaveData && JSON.stringify(data) === JSON.stringify(state.lastSaveData)) {
            this.showNotification('This result has already been saved', 'info');
            return false;
        }

        return true;
    },

    // RECORD save
    recordSave: function(type = 'save', data) {
        const state = this.states[type];
        state.lastSaveTime = Date.now();
        state.lastSaveData = data;
        state.saveCount++;
    },

    // CEK SPAM untuk history
    canAddToHistory: function(record) {
        const state = this.states.history;
        const now = Date.now();

        // CEK interval
        if (now - state.lastSaveTime < this.config.MIN_HISTORY_INTERVAL) {
            console.log('History save ignored - too frequent');
            return false;
        }

        // CEK duplicate dengan record terakhir
        const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
        if (history.length > 0) {
            const lastRecord = history[0];
            if (lastRecord.type === record.type && 
                lastRecord.value === record.value) {
                console.log('Duplicate history entry prevented');
                return false;
            }
        }

        return true;
    },

    // ADD ke history dengan anti-spam
    addToHistory: function(record) {
        if (!this.canAddToHistory(record)) return false;

        try {
            const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
            
            // Tambah record baru
            history.unshift(record);
            
            // Batasi jumlah records
            if (history.length > this.config.MAX_HISTORY_RECORDS) {
                history.pop();
            }
            
            localStorage.setItem('healthHistory', JSON.stringify(history));
            
            // Update state
            this.states.history.lastSaveTime = Date.now();
            this.states.history.lastSaveData = record;
            this.states.history.saveCount++;
            
            console.log('✅ Added to history:', record);
            return true;
        } catch (error) {
            console.error('Error saving to history:', error);
            return false;
        }
    },

    // Notifikasi system
    showNotification: function(message, type = 'info') {
        this.showNotification(message, type); // Memanggil fungsi global
    },

    // Reset state untuk testing
    resetState: function(type) {
        if (type && this.states[type]) {
            this.states[type] = {
                isCalculating: false,
                lastCalculationTime: 0,
                lastCalculationData: null,
                calculationCount: 0,
                totalCalculations: this.states[type].totalCalculations || 0
            };
        } else {
            // Reset semua
            Object.keys(this.states).forEach(key => {
                if (key !== 'totalCalculations') {
                    this.states[key] = {
                        isCalculating: false,
                        lastCalculationTime: 0,
                        lastCalculationData: null,
                        calculationCount: 0,
                        totalCalculations: this.states[key]?.totalCalculations || 0
                    };
                }
            });
        }
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Prevent double-click on all buttons
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' && e.target.closest('[onclick]')) {
                if (e.target.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, true);

        // Clean up on page unload
        window.addEventListener('beforeunload', function() {
            // Optional: save state
        });
    }
};

// Export ke global
window.AntiSpamSystem = AntiSpamSystem;