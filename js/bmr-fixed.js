// BMR Calculator - FIXED VERSION
// Dengan chart yang muncul dan history yang tersimpan

let bmrChart = null;
let currentGender = 'male';

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    console.log('BMR Fixed JS Loaded');
    
    if (window.AntiSpamSystem) {
        AntiSpamSystem.init();
    }
    
    setGender('male');
});

// Set gender
function setGender(gender) {
    currentGender = gender;
    
    const maleBtn = document.getElementById('genderMale');
    const femaleBtn = document.getElementById('genderFemale');
    
    if (maleBtn && femaleBtn) {
        if (gender === 'male') {
            maleBtn.className = 'gender-btn active bg-[#3B82F6] text-white py-3 px-4 rounded-xl text-sm sm:text-base';
            femaleBtn.className = 'gender-btn bg-[#1E293B] text-[#94A3B8] py-3 px-4 rounded-xl text-sm sm:text-base';
        } else {
            femaleBtn.className = 'gender-btn active bg-[#3B82F6] text-white py-3 px-4 rounded-xl text-sm sm:text-base';
            maleBtn.className = 'gender-btn bg-[#1E293B] text-[#94A3B8] py-3 px-4 rounded-xl text-sm sm:text-base';
        }
    }
}

// Fungsi utama hitung BMR
function hitungBMR() {
    console.log('Calculate BMR clicked');
    
    // Ambil nilai input
    const usia = parseFloat(document.getElementById('usiaBmr')?.value);
    const tinggi = parseFloat(document.getElementById('tinggiBmr')?.value);
    const berat = parseFloat(document.getElementById('beratBmr')?.value);
    const aktivitas = parseFloat(document.getElementById('aktivitas')?.value) || 1.55;
    
    // Validasi
    if (!usia || !tinggi || !berat) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    if (usia < 15 || usia > 100 || tinggi < 100 || tinggi > 250 || berat < 30 || berat > 200) {
        showNotification('Please enter valid values', 'error');
        return;
    }
    
    const inputData = { usia, tinggi, berat, aktivitas, gender: currentGender };
    
    // Cek spam
    if (window.AntiSpamSystem && !AntiSpamSystem.canCalculate('bmr', inputData)) {
        return;
    }
    
    // Start calculation
    if (window.AntiSpamSystem) {
        AntiSpamSystem.startCalculation('bmr', inputData);
    }
    
    // Set loading state
    setLoadingState(true);
    
    // Simulasi proses
    setTimeout(() => {
        performBMRCalculation(usia, tinggi, berat, aktivitas);
    }, 800);
}

// Set loading state
function setLoadingState(loading) {
    const btn = document.querySelector('button[onclick="hitungBMR()"]');
    if (!btn) return;
    
    if (loading) {
        btn.disabled = true;
        btn.classList.add('opacity-70', 'cursor-not-allowed');
        btn.innerHTML = `
            <i class="fas fa-spinner fa-spin mr-2"></i>
            <span>Calculating...</span>
        `;
    } else {
        btn.disabled = false;
        btn.classList.remove('opacity-70', 'cursor-not-allowed');
        btn.innerHTML = `
            <i class="fas fa-calculator"></i>
            <span>Calculate BMR</span>
        `;
    }
}

// Perform calculation
function performBMRCalculation(usia, tinggi, berat, aktivitas) {
    console.log('Performing BMR calculation');
    
    // Hitung BMR (Mifflin-St Jeor)
    let bmr;
    if (currentGender === 'male') {
        bmr = (10 * berat) + (6.25 * tinggi) - (5 * usia) + 5;
    } else {
        bmr = (10 * berat) + (6.25 * tinggi) - (5 * usia) - 161;
    }
    
    const tdee = bmr * aktivitas;
    
    // Hitung goals
    const mildLoss = tdee - 250;
    const weightLoss = tdee - 500;
    const extremeLoss = tdee - 1000;
    const weightGain = tdee + 500;
    
    console.log('BMR Result:', { bmr, tdee });
    
    // Update UI
    document.getElementById('emptyBmrResult').style.display = 'none';
    document.getElementById('bmrResult').classList.remove('hidden');
    document.getElementById('chartCard').style.display = 'block';
    document.getElementById('goalsCard').style.display = 'block';
    document.getElementById('mealPlanCard').style.display = 'block';
    
    // Tampilkan hasil
    const resultDiv = document.getElementById('bmrResult');
    resultDiv.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/20 rounded-2xl">
                <p class="text-[#94A3B8] text-xs sm:text-sm mb-2">Basal Metabolic Rate</p>
                <div class="text-3xl sm:text-5xl font-bold text-[#F59E0B]">${Math.round(bmr)}</div>
                <p class="text-[#64748B] text-xs mt-2">calories/day</p>
            </div>
            
            <div class="text-center p-4 sm:p-6 bg-gradient-to-br from-[#EC4899]/20 to-[#DB2777]/20 rounded-2xl">
                <p class="text-[#94A3B8] text-xs sm:text-sm mb-2">Total Daily Energy</p>
                <div class="text-3xl sm:text-5xl font-bold text-[#EC4899]">${Math.round(tdee)}</div>
                <p class="text-[#64748B] text-xs mt-2">calories/day</p>
            </div>
        </div>
    `;
    
    // Update goals
    document.getElementById('mildLoss').innerHTML = `${Math.round(mildLoss)}`;
    document.getElementById('weightLoss').innerHTML = `${Math.round(weightLoss)}`;
    document.getElementById('extremeLoss').innerHTML = `${Math.round(extremeLoss)}`;
    document.getElementById('weightGain').innerHTML = `${Math.round(weightGain)}`;
    
    // Generate meal plan
    generateMealPlan(tdee);
    
    // Create chart
    setTimeout(() => {
        createCalorieChart(bmr, tdee, mildLoss, weightLoss, weightGain);
    }, 100);
    
    // SAVE TO HISTORY
    saveToHistory(bmr, tdee);
    
    // End calculation
    setLoadingState(false);
    if (window.AntiSpamSystem) {
        AntiSpamSystem.endCalculation('bmr');
    }
    
    showNotification('BMR calculated successfully!', 'success');
}

// Create chart function
function createCalorieChart(bmr, tdee, mildLoss, weightLoss, weightGain) {
    console.log('Creating chart...');
    
    const ctx = document.getElementById('calorieChart')?.getContext('2d');
    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }
    
    // Destroy existing chart
    if (bmrChart) {
        bmrChart.destroy();
    }
    
    // Create new chart
    bmrChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['BMR', 'TDEE', 'Mild Loss', 'Weight Loss', 'Weight Gain'],
            datasets: [{
                label: 'Calories',
                data: [
                    Math.round(bmr), 
                    Math.round(tdee), 
                    Math.round(mildLoss), 
                    Math.round(weightLoss), 
                    Math.round(weightGain)
                ],
                backgroundColor: [
                    '#F59E0B',
                    '#EC4899',
                    '#10B981',
                    '#3B82F6',
                    '#8B5CF6'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw + ' calories';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#1E293B'
                    },
                    ticks: {
                        color: '#64748B',
                        callback: function(value) {
                            return value + ' cal';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94A3B8',
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
    
    console.log('Chart created successfully');
}

// Generate meal plan
function generateMealPlan(tdee) {
    const breakfast = Math.round(tdee * 0.25);
    const lunch = Math.round(tdee * 0.35);
    const dinner = Math.round(tdee * 0.3);
    const snacks = Math.round(tdee * 0.1);
    
    const mealPlan = document.getElementById('mealPlan');
    mealPlan.innerHTML = `
        <div class="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-[#F59E0B]/20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-sun text-[#F59E0B]"></i>
                </div>
                <div>
                    <p class="text-white text-sm">Breakfast</p>
                </div>
            </div>
            <span class="text-white font-semibold">${breakfast} cal</span>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-[#EC4899]/20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-cloud-sun text-[#EC4899]"></i>
                </div>
                <div>
                    <p class="text-white text-sm">Lunch</p>
                </div>
            </div>
            <span class="text-white font-semibold">${lunch} cal</span>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-moon text-[#3B82F6]"></i>
                </div>
                <div>
                    <p class="text-white text-sm">Dinner</p>
                </div>
            </div>
            <span class="text-white font-semibold">${dinner} cal</span>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                    <i class="fas fa-apple-alt text-[#10B981]"></i>
                </div>
                <div>
                    <p class="text-white text-sm">Snacks</p>
                </div>
            </div>
            <span class="text-white font-semibold">${snacks} cal</span>
        </div>
    `;
}

// Save to history function
function saveToHistory(bmr, tdee) {
    console.log('Saving to history:', { bmr, tdee });
    
    const record = {
        id: Date.now(),
        type: 'BMR',
        value: Math.round(bmr),
        detail: `TDEE: ${Math.round(tdee)} cal`,
        unit: 'cal',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Save via AntiSpamSystem
    if (window.AntiSpamSystem) {
        const saved = AntiSpamSystem.addToHistory(record);
        console.log('History saved:', saved);
    } else {
        // Fallback
        try {
            let history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
            history.unshift(record);
            if (history.length > 30) history.pop();
            localStorage.setItem('healthHistory', JSON.stringify(history));
            console.log('History saved via fallback');
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }
}

// Export functions
function exportPDF() {
    showNotification('PDF feature coming soon!', 'info');
}

// Show notification
function showNotification(message, type) {
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        console.log('Notification:', message, type);
        alert(message);
    }
}