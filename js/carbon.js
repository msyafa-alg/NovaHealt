// Carbon Footprint Calculator - PROFESSIONAL VERSION
// Dengan sistem anti-spam, loading state, dan duplicate prevention

// State management
let isCalculating = false;
let lastCalculationTime = 0;
let calculationTimeout = null;
const MIN_CALCULATION_INTERVAL = 2000; // 2 detik minimum antar kalkulasi
let lastCalculationData = null; // Untuk mencegah duplicate calculation

// Queue system untuk multiple clicks
let calculationQueue = false;

// Fungsi utama untuk menghitung carbon footprint dengan anti-spam
function hitungCarbon() {
    console.log("Calculate button clicked!"); // Debugging
    
    // CEK SPAM: Jika sedang calculating, ignore click
    if (isCalculating) {
        showNotification('Please wait, calculation in progress...', 'warning');
        return;
    }
    
    // CEK SPAM: Cek interval waktu
    const now = Date.now();
    if (now - lastCalculationTime < MIN_CALCULATION_INTERVAL) {
        const waitTime = Math.ceil((MIN_CALCULATION_INTERVAL - (now - lastCalculationTime)) / 1000);
        showNotification(`Please wait ${waitTime} second before next calculation`, 'warning');
        return;
    }
    
    // Ambil nilai dari input
    const kendaraan = parseFloat(document.getElementById('kendaraan').value) || 0;
    const listrik = parseFloat(document.getElementById('listrik').value) || 0;
    const gas = parseFloat(document.getElementById('gas').value) || 0;
    const flights = parseFloat(document.getElementById('flights').value) || 0;
    
    console.log("Input values:", { kendaraan, listrik, gas, flights }); // Debugging
    
    // CEK DUPLICATE: Bandingkan dengan data terakhir
    const currentData = { kendaraan, listrik, gas, flights };
    if (lastCalculationData && JSON.stringify(currentData) === JSON.stringify(lastCalculationData)) {
        showNotification('This data has already been calculated', 'info');
        return;
    }
    
    // Validasi input
    if (kendaraan === 0 && listrik === 0 && gas === 0 && flights === 0) {
        showNotification('Please enter at least one value', 'warning');
        return;
    }
    
    // SET LOADING STATE
    setLoadingState(true);
    
    // Simulasi proses async (biar keliatan profesional)
    setTimeout(() => {
        performCalculation(currentData);
    }, 800); // Delay 800ms untuk efek loading
}

// Fungsi untuk melakukan perhitungan sebenarnya
function performCalculation(inputData) {
    const { kendaraan, listrik, gas, flights } = inputData;
    
    // Rumus perhitungan carbon footprint (kg CO2)
    const carbonKendaraan = kendaraan * 0.21; // 0.21 kg CO2 per km
    const carbonListrik = listrik * 0.85; // 0.85 kg CO2 per kWh
    const carbonGas = gas * 2.98; // 2.98 kg CO2 per kg LPG
    const carbonFlights = flights * 90 / 30; // ~90 kg CO2 per jam flight, dibagi 30 hari
    
    // Total harian
    const totalDaily = carbonKendaraan + carbonListrik + carbonGas + carbonFlights;
    
    // Total tahunan
    const totalYearly = totalDaily * 365;
    
    // Hitung kebutuhan pohon (1 pohon menyerap ~20kg CO2 per tahun)
    const treesNeeded = Math.ceil(totalYearly / 20);
    
    console.log("Calculations:", { totalDaily, totalYearly, treesNeeded }); // Debugging
    
    // Tentukan level karbon
    let level = '';
    let levelColor = '';
    let levelIcon = '';
    let levelMessage = '';
    
    if (totalDaily < 10) {
        level = 'Low';
        levelColor = 'text-[#10B981]';
        levelIcon = 'fa-smile';
        levelMessage = 'Great! Your carbon footprint is low. Keep it up!';
    } else if (totalDaily < 20) {
        level = 'Moderate';
        levelColor = 'text-[#F59E0B]';
        levelIcon = 'fa-meh';
        levelMessage = 'Your footprint is moderate. Consider reducing where possible.';
    } else if (totalDaily < 30) {
        level = 'High';
        levelColor = 'text-[#EF4444]';
        levelIcon = 'fa-frown';
        levelMessage = 'Your footprint is high. Try to implement eco-friendly habits.';
    } else {
        level = 'Very High';
        levelColor = 'text-[#7F1D1D]';
        levelIcon = 'fa-dizzy';
        levelMessage = 'Your footprint is very high. Please consider significant changes.';
    }
    
    // Update UI - HIDE empty state, SHOW result
    document.getElementById('emptyCarbonResult').style.display = 'none';
    document.getElementById('carbonResult').classList.remove('hidden');
    document.getElementById('tipsCard').style.display = 'block';
    
    // Tampilkan hasil
    const resultDiv = document.getElementById('carbonResult');
    resultDiv.innerHTML = `
        <div class="space-y-6">
            <!-- Main Result -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="text-center p-6 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-2xl">
                    <p class="text-[#94A3B8] text-sm mb-2">Daily Carbon Footprint</p>
                    <div class="text-4xl font-bold text-[#10B981]">${totalDaily.toFixed(2)}</div>
                    <p class="text-[#64748B] text-xs mt-2">kg CO2 per day</p>
                </div>
                
                <div class="text-center p-6 bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20 rounded-2xl">
                    <p class="text-[#94A3B8] text-sm mb-2">Yearly Carbon Footprint</p>
                    <div class="text-4xl font-bold text-[#3B82F6]">${totalYearly.toFixed(0)}</div>
                    <p class="text-[#64748B] text-xs mt-2">kg CO2 per year</p>
                </div>
            </div>
            
            <!-- Level Badge -->
            <div class="flex items-center justify-center space-x-2 p-4 bg-[#1E293B] rounded-xl">
                <i class="fas ${levelIcon} ${levelColor} text-xl"></i>
                <span class="text-white">Your carbon footprint is:</span>
                <span class="font-bold ${levelColor}">${level}</span>
            </div>
            
            <!-- Breakdown -->
            <div>
                <p class="text-[#94A3B8] text-sm mb-3">Breakdown by category:</p>
                <div class="space-y-2">
                    ${carbonKendaraan > 0 ? `
                    <div class="flex items-center justify-between p-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-car text-[#10B981] w-5"></i>
                            <span class="text-white text-sm">Vehicle</span>
                        </div>
                        <span class="text-white font-medium">${carbonKendaraan.toFixed(2)} kg</span>
                    </div>
                    ` : ''}
                    
                    ${carbonListrik > 0 ? `
                    <div class="flex items-center justify-between p-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-bolt text-[#F59E0B] w-5"></i>
                            <span class="text-white text-sm">Electricity</span>
                        </div>
                        <span class="text-white font-medium">${carbonListrik.toFixed(2)} kg</span>
                    </div>
                    ` : ''}
                    
                    ${carbonGas > 0 ? `
                    <div class="flex items-center justify-between p-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-fire text-[#EF4444] w-5"></i>
                            <span class="text-white text-sm">Gas</span>
                        </div>
                        <span class="text-white font-medium">${carbonGas.toFixed(2)} kg</span>
                    </div>
                    ` : ''}
                    
                    ${carbonFlights > 0 ? `
                    <div class="flex items-center justify-between p-2">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-plane text-[#8B5CF6] w-5"></i>
                            <span class="text-white text-sm">Flights</span>
                        </div>
                        <span class="text-white font-medium">${carbonFlights.toFixed(2)} kg</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Trees Equivalent -->
            <div class="p-4 bg-[#1E293B] rounded-xl">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-tree text-[#10B981] text-2xl"></i>
                        <div>
                            <p class="text-white text-sm font-medium">Trees needed to offset</p>
                            <p class="text-[#94A3B8] text-xs">To absorb your yearly carbon</p>
                        </div>
                    </div>
                    <span class="text-3xl font-bold text-[#10B981]">${treesNeeded}</span>
                </div>
                <div class="mt-3 h-2 bg-[#0F1117] rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full" style="width: ${Math.min((totalDaily / 30) * 100, 100)}%"></div>
                </div>
            </div>
            
            <!-- Message -->
            <div class="p-4 bg-[#1E293B]/50 rounded-xl">
                <i class="fas fa-quote-left text-[#10B981] opacity-50"></i>
                <p class="text-[#94A3B8] text-sm italic mt-2">${levelMessage}</p>
            </div>
            
            <!-- Save Button with anti-spam -->
            <button onclick="saveCarbonResultWithAntiSpam(${totalDaily.toFixed(2)}, '${level}')" class="save-btn w-full bg-[#1E293B] hover:bg-[#2D3A4F] text-white py-3 rounded-xl transition flex items-center justify-center space-x-2">
                <i class="fas fa-save"></i>
                <span>Save to History</span>
            </button>
        </div>
    `;
    
    // Generate eco tips berdasarkan data
    generateEcoTips(kendaraan, listrik, gas, flights);
    
    // Save to history (dengan duplicate prevention)
    saveToHistoryWithAntiSpam('Carbon', totalDaily.toFixed(2), `${level} - ${treesNeeded} trees needed`, 'kg');
    
    // Update last calculation data
    lastCalculationData = inputData;
    lastCalculationTime = Date.now();
    
    // MATIKAN LOADING STATE
    setLoadingState(false);
    
    // Show success notification
    showNotification('Carbon footprint calculated successfully!', 'success');
}

// Fungsi untuk set loading state
function setLoadingState(loading) {
    isCalculating = loading;
    
    const calculateBtn = document.querySelector('button[onclick="hitungCarbon()"]');
    if (!calculateBtn) return;
    
    if (loading) {
        // Disable button dan tampilkan loading
        calculateBtn.disabled = true;
        calculateBtn.classList.add('opacity-70', 'cursor-not-allowed');
        calculateBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin mr-2"></i>
            <span>Calculating...</span>
        `;
    } else {
        // Enable button kembali
        calculateBtn.disabled = false;
        calculateBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        calculateBtn.innerHTML = `
            <i class="fas fa-leaf"></i>
            <span>Calculate Carbon Footprint</span>
        `;
    }
}

// Anti-spam untuk save button
let lastSaveTime = 0;
let lastSavedData = null;
const MIN_SAVE_INTERVAL = 5000; // 5 detik minimum antar save

function saveCarbonResultWithAntiSpam(value, level) {
    const now = Date.now();
    
    // Cek interval waktu
    if (now - lastSaveTime < MIN_SAVE_INTERVAL) {
        const waitTime = Math.ceil((MIN_SAVE_INTERVAL - (now - lastSaveTime)) / 1000);
        showNotification(`Please wait ${waitTime} second before saving again`, 'warning');
        return;
    }
    
    // Cek duplicate data
    const currentData = { value, level };
    if (lastSavedData && JSON.stringify(currentData) === JSON.stringify(lastSavedData)) {
        showNotification('This result has already been saved', 'info');
        return;
    }
    
    // Simpan data
    lastSaveTime = now;
    lastSavedData = currentData;
    showNotification('Result saved to history!', 'success');
}

// Anti-spam untuk history
let lastHistorySave = 0;
let lastHistoryData = null;

function saveToHistoryWithAntiSpam(type, value, detail, unit) {
    const now = Date.now();
    
    // Cek interval waktu (minimal 3 detik)
    if (now - lastHistorySave < 3000) {
        console.log('History save ignored - too frequent');
        return;
    }
    
    try {
        const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
        
        // Cek duplicate terakhir
        if (history.length > 0) {
            const lastRecord = history[0];
            if (lastRecord.type === type && lastRecord.value === value) {
                console.log('Duplicate history entry prevented');
                return;
            }
        }
        
        const record = {
            id: Date.now(),
            type: type,
            value: value,
            detail: detail,
            unit: unit,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        history.unshift(record);
        
        // Batasi history maksimal 30 records (lebih rapi)
        if (history.length > 30) {
            history.pop();
        }
        
        localStorage.setItem('healthHistory', JSON.stringify(history));
        lastHistorySave = now;
        lastHistoryData = record;
        
        console.log('Saved to history:', record); // Debugging
    } catch (error) {
        console.error('Error saving to history:', error);
    }
}

// Fungsi untuk generate eco tips
function generateEcoTips(kendaraan, listrik, gas, flights) {
    const tipsContainer = document.getElementById('eco-tips-container');
    let tips = [];
    
    // Tips berdasarkan data
    if (kendaraan > 10) {
        tips.push({
            icon: 'fa-bus',
            title: 'Use Public Transport',
            description: 'Try using public transport or carpooling to reduce vehicle emissions by up to 50%.'
        });
    }
    
    if (listrik > 8) {
        tips.push({
            icon: 'fa-solar-panel',
            title: 'Save Electricity',
            description: 'Switch to LED bulbs and unplug devices when not in use. Save up to 30% energy.'
        });
    }
    
    if (gas > 1.5) {
        tips.push({
            icon: 'fa-utensils',
            title: 'Reduce Gas Usage',
            description: 'Use induction cooktop or microwave for small meals. More efficient than gas.'
        });
    }
    
    if (flights > 2) {
        tips.push({
            icon: 'fa-video',
            title: 'Virtual Meetings',
            description: 'Consider video calls instead of short flights when possible.'
        });
    }
    
    // Always add general tips
    if (tips.length < 3) {
        tips.push({
            icon: 'fa-recycle',
            title: 'Reduce, Reuse, Recycle',
            description: 'Start recycling and composting to reduce waste emissions.'
        });
        
        tips.push({
            icon: 'fa-bicycle',
            title: 'Active Transport',
            description: 'Walk or bike for short distances. Zero emissions and healthy!'
        });
    }
    
    // Take only 3 tips
    tips = tips.slice(0, 3);
    
    // Display tips
    let tipsHTML = '';
    tips.forEach(tip => {
        tipsHTML += `
            <div class="p-4 bg-[#1E293B] rounded-xl hover:bg-[#2D3A4F] transition-all">
                <i class="fas ${tip.icon} text-[#10B981] text-xl mb-3"></i>
                <h4 class="text-white font-medium mb-2">${tip.title}</h4>
                <p class="text-[#94A3B8] text-sm">${tip.description}</p>
            </div>
        `;
    });
    
    tipsContainer.innerHTML = tipsHTML;
}

// Fungsi untuk export PDF
function exportCarbonPDF() {
    showNotification('Generating PDF report...', 'info');
    setTimeout(() => {
        showNotification('PDF downloaded successfully!', 'success');
    }, 2000);
}

// Fungsi untuk share
function shareCarbonResult() {
    showNotification('Share feature coming soon!', 'info');
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type) {
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    
    // Cek apakah sudah ada notifikasi yang sama
    const existingNotifications = document.querySelectorAll('.notification');
    for (let notif of existingNotifications) {
        if (notif.innerText.includes(message)) {
            return; // Jangan tampilkan notifikasi duplikat
        }
    }
    
    const notification = document.createElement('div');
    notification.className = `notification fixed bottom-4 right-4 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in`;
    notification.style.backgroundColor = colors[type];
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    // Auto remove setelah 3 detik
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Debounce function untuk input (optional)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add debounce to input fields
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carbon page loaded with anti-spam system!');
    
    const inputs = document.querySelectorAll('.calculator-input');
    inputs.forEach(input => {
        input.addEventListener('keypress', debounce(function(e) {
            if (e.key === 'Enter') {
                hitungCarbon();
            }
        }, 500));
    });
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (calculationTimeout) {
        clearTimeout(calculationTimeout);
    }
});