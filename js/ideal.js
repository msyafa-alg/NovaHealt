// Ideal Weight Calculator - Dengan Anti-Spam System

document.addEventListener('DOMContentLoaded', function() {
    if (window.AntiSpamSystem) {
        AntiSpamSystem.init();
        console.log('Ideal Weight Calculator with Anti-Spam ready');
    }
});

function hitungIdeal() {
    // Ambil input
    const tinggi = parseFloat(document.getElementById('tinggiIdeal')?.value);
    const gender = document.getElementById('genderIdeal')?.value || 'male';
    const usia = parseFloat(document.getElementById('usiaIdeal')?.value) || 25;
    const pergelangan = parseFloat(document.getElementById('pergelangan')?.value) || 0;
    
    if (!tinggi) {
        showNotification('Please enter your height', 'error');
        return;
    }
    
    const inputData = { tinggi, gender, usia, pergelangan };
    
    // CEK SPAM
    if (!AntiSpamSystem.canCalculate('ideal', inputData)) {
        return;
    }
    
    // START calculation
    AntiSpamSystem.startCalculation('ideal', inputData);
    
    setTimeout(() => {
        performIdealCalculation(tinggi, gender, usia, pergelangan);
    }, 800);
}

function performIdealCalculation(tinggi, gender, usia, pergelangan) {
    // Hitung dengan berbagai formula
    const hasil = {};
    
    // Robinson Formula
    if (gender === 'male') {
        hasil.robinson = 52 + 1.9 * ((tinggi - 152.4) / 2.54);
    } else {
        hasil.robinson = 49 + 1.7 * ((tinggi - 152.4) / 2.54);
    }
    
    // Miller Formula
    if (gender === 'male') {
        hasil.miller = 56.2 + 1.41 * ((tinggi - 152.4) / 2.54);
    } else {
        hasil.miller = 53.1 + 1.36 * ((tinggi - 152.4) / 2.54);
    }
    
    // Devine Formula
    if (gender === 'male') {
        hasil.devine = 50 + 2.3 * ((tinggi - 152.4) / 2.54);
    } else {
        hasil.devine = 45.5 + 2.3 * ((tinggi - 152.4) / 2.54);
    }
    
    // Hamwi Formula
    if (gender === 'male') {
        hasil.hamwi = 48 + 2.7 * ((tinggi - 152.4) / 2.54);
    } else {
        hasil.hamwi = 45.5 + 2.2 * ((tinggi - 152.4) / 2.54);
    }
    
    // BMI-based range
    const tinggiM = tinggi / 100;
    const bmiMin = 18.5 * (tinggiM * tinggiM);
    const bmiMax = 24.9 * (tinggiM * tinggiM);
    
    // Average
    const avgIdeal = (hasil.robinson + hasil.miller + hasil.devine + hasil.hamwi) / 4;
    
    // Update UI
    document.getElementById('emptyIdealResult').style.display = 'none';
    document.getElementById('idealResult').classList.remove('hidden');
    document.getElementById('formulaCard').style.display = 'block';
    
    document.getElementById('idealResult').innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="text-center p-6 bg-gradient-to-br from-[#8B5CF6]/20 to-[#7C3AED]/20 rounded-2xl">
                <p class="text-[#94A3B8] text-sm mb-2">Your Ideal Weight</p>
                <div class="text-5xl font-bold text-[#8B5CF6]">${avgIdeal.toFixed(1)}</div>
                <p class="text-[#64748B] text-xs mt-2">kilograms (average)</p>
            </div>
            
            <div class="text-center p-6 bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20 rounded-2xl">
                <p class="text-[#94A3B8] text-sm mb-2">Healthy BMI Range</p>
                <div class="text-3xl font-bold text-[#3B82F6]">${bmiMin.toFixed(1)} - ${bmiMax.toFixed(1)}</div>
                <p class="text-[#64748B] text-xs mt-2">kg</p>
            </div>
        </div>
    `;
    
    // Update formula comparisons
    document.getElementById('robinson').textContent = hasil.robinson.toFixed(1) + ' kg';
    document.getElementById('miller').textContent = hasil.miller.toFixed(1) + ' kg';
    document.getElementById('devine').textContent = hasil.devine.toFixed(1) + ' kg';
    document.getElementById('hamwi').textContent = hasil.hamwi.toFixed(1) + ' kg';
    
    // Save to history
    const record = {
        id: Date.now(),
        type: 'Ideal Weight',
        value: avgIdeal.toFixed(1),
        detail: `${bmiMin.toFixed(1)}-${bmiMax.toFixed(1)} kg range`,
        unit: 'kg',
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
    AntiSpamSystem.endCalculation('ideal');
    
    showNotification('Ideal weight calculated successfully!', 'success');
}