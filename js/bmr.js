// BMR Calculator - Dengan Anti-Spam System

let currentGender = 'male';

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    if (window.AntiSpamSystem) {
        AntiSpamSystem.init();
        console.log('BMR Calculator with Anti-Spam ready');
    }
    setGender('male');
});

function setGender(gender) {
    currentGender = gender;
    
    const maleBtn = document.getElementById('genderMale');
    const femaleBtn = document.getElementById('genderFemale');
    
    if (maleBtn && femaleBtn) {
        maleBtn.className = gender === 'male' 
            ? 'gender-btn active bg-[#3B82F6] text-white' 
            : 'gender-btn bg-[#1E293B] text-[#94A3B8]';
        
        femaleBtn.className = gender === 'female' 
            ? 'gender-btn active bg-[#3B82F6] text-white' 
            : 'gender-btn bg-[#1E293B] text-[#94A3B8]';
    }
}

// Fungsi utama dengan anti-spam
function hitungBMR() {
    // Ambil input
    const tinggi = parseFloat(document.getElementById('tinggiBmr')?.value);
    const berat = parseFloat(document.getElementById('beratBmr')?.value);
    const usia = parseFloat(document.getElementById('usiaBmr')?.value);
    const aktivitas = parseFloat(document.getElementById('aktivitas')?.value) || 1.55;
    const bodyFat = parseFloat(document.getElementById('bodyFat')?.value) || 0;
    
    // Validasi
    if (!tinggi || !berat || !usia) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    const inputData = { 
        gender: currentGender, 
        tinggi, berat, usia, aktivitas, bodyFat 
    };
    
    // CEK SPAM
    if (!AntiSpamSystem.canCalculate('bmr', inputData)) {
        return;
    }
    
    // START calculation
    AntiSpamSystem.startCalculation('bmr', inputData);
    
    // Simulasi proses async
    setTimeout(() => {
        performBMRCalculation(tinggi, berat, usia, aktivitas, bodyFat);
    }, 800);
}

function performBMRCalculation(tinggi, berat, usia, aktivitas, bodyFat) {
    // Hitung BMR dengan formula Mifflin-St Jeor
    let bmr;
    if (currentGender === 'male') {
        bmr = (10 * berat) + (6.25 * tinggi) - (5 * usia) + 5;
    } else {
        bmr = (10 * berat) + (6.25 * tinggi) - (5 * usia) - 161;
    }
    
    const tdee = bmr * aktivitas;
    
    // Weight goals
    const mildLoss = tdee - 250;
    const weightLoss = tdee - 500;
    const extremeLoss = tdee - 1000;
    const weightGain = tdee + 500;
    
    // Update UI
    document.getElementById('emptyBmrResult').style.display = 'none';
    document.getElementById('bmrResult').classList.remove('hidden');
    document.getElementById('chartCard').style.display = 'block';
    document.getElementById('mealPlanCard').style.display = 'block';
    document.getElementById('goalsCard').style.display = 'block';
    
    const resultDiv = document.getElementById('bmrResult');
    resultDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="text-center p-6 bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/20 rounded-2xl">
                <p class="text-[#94A3B8] text-sm mb-2">Basal Metabolic Rate</p>
                <div class="text-5xl font-bold text-[#F59E0B]">${Math.round(bmr)}</div>
                <p class="text-[#64748B] text-xs mt-2">calories/day</p>
            </div>
            
            <div class="text-center p-6 bg-gradient-to-br from-[#EC4899]/20 to-[#DB2777]/20 rounded-2xl">
                <p class="text-[#94A3B8] text-sm mb-2">Total Daily Energy</p>
                <div class="text-5xl font-bold text-[#EC4899]">${Math.round(tdee)}</div>
                <p class="text-[#64748B] text-xs mt-2">calories/day (with activity)</p>
            </div>
        </div>
    `;
    
    // Update goals
    document.getElementById('mildLoss').innerHTML = `${Math.round(mildLoss)} cal`;
    document.getElementById('weightLoss').innerHTML = `${Math.round(weightLoss)} cal`;
    document.getElementById('extremeLoss').innerHTML = `${Math.round(extremeLoss)} cal`;
    document.getElementById('weightGain').innerHTML = `${Math.round(weightGain)} cal`;
    
    // Generate meal plan
    generateMealPlan(tdee);
    
    // Create chart
    createCalorieChart(bmr, tdee, mildLoss, weightLoss, weightGain);
    
    // Save to history dengan anti-spam
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
    
    AntiSpamSystem.addToHistory(record);
    
    // END calculation
    AntiSpamSystem.endCalculation('bmr');
    
    showNotification('BMR calculated successfully!', 'success');
}