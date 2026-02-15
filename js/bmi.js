// BMI Calculator - Dengan Anti-Spam System

// Inisialisasi anti-spam untuk BMI
document.addEventListener('DOMContentLoaded', function() {
    if (window.AntiSpamSystem) {
        AntiSpamSystem.init();
        console.log('BMI Calculator with Anti-Spam ready');
    }
});

// Fungsi utama dengan anti-spam
function hitungBMI() {
    // Ambil input data
    const tinggi = parseFloat(document.getElementById('tinggi').value);
    const berat = parseFloat(document.getElementById('berat').value);
    const usia = parseFloat(document.getElementById('usia').value);
    const gender = document.getElementById('gender')?.value || 'male';
    
    // Validasi input
    if (!tinggi || !berat || !usia) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    const inputData = { tinggi, berat, usia, gender };
    
    // CEK SPAM menggunakan AntiSpamSystem
    if (!AntiSpamSystem.canCalculate('bmi', inputData)) {
        return;
    }
    
    // START calculation
    AntiSpamSystem.startCalculation('bmi', inputData);
    
    // Simulasi proses async (biar keliatan profesional)
    setTimeout(() => {
        performBMICalculation(tinggi, berat, usia, gender);
    }, 800);
}

// Fungsi perhitungan BMI
function performBMICalculation(tinggi, berat, usia, gender) {
    const tinggiM = tinggi / 100;
    const bmi = berat / (tinggiM * tinggiM);
    
    // Tentukan kategori
    let kategori = '', warna = '', statusClass = '', saran = '';
    
    if (bmi < 18.5) {
        kategori = 'Underweight';
        warna = '#3B82F6';
        statusClass = 'status-underweight';
        saran = 'Consider increasing your calorie intake with nutritious foods.';
    } else if (bmi < 25) {
        kategori = 'Normal';
        warna = '#10B981';
        statusClass = 'status-normal';
        saran = 'Great! You have a healthy body weight. Keep maintaining it!';
    } else if (bmi < 30) {
        kategori = 'Overweight';
        warna = '#F59E0B';
        statusClass = 'status-overweight';
        saran = 'Consider a balanced diet and regular exercise routine.';
    } else {
        kategori = 'Obese';
        warna = '#EF4444';
        statusClass = 'status-obese';
        saran = 'Consult with a healthcare provider for a personalized plan.';
    }
    
    // Hitung berat ideal
    const idealMin = (18.5 * (tinggiM * tinggiM)).toFixed(1);
    const idealMax = (24.9 * (tinggiM * tinggiM)).toFixed(1);
    
    // Update UI
    document.getElementById('emptyResult').style.display = 'none';
    document.getElementById('bmiResult').classList.remove('hidden');
    
    const resultDiv = document.getElementById('bmiResult');
    resultDiv.innerHTML = `
        <div class="text-center fade-in">
            <div class="result-number">${bmi.toFixed(1)}</div>
            <div class="result-label">Your BMI</div>
            
            <div class="inline-block ${statusClass} px-4 py-2 rounded-full mt-3 mb-4">
                ${kategori}
            </div>
            
            <div class="progress-bar mb-4">
                <div class="progress-fill" style="width: ${Math.min(bmi * 3.33, 100)}%"></div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-[#1E293B] p-3 rounded-xl">
                    <p class="text-[#64748B] text-xs">Min Ideal</p>
                    <p class="text-white font-semibold">${idealMin} kg</p>
                </div>
                <div class="bg-[#1E293B] p-3 rounded-xl">
                    <p class="text-[#64748B] text-xs">Max Ideal</p>
                    <p class="text-white font-semibold">${idealMax} kg</p>
                </div>
            </div>
            
            <div class="bg-[#1E293B] p-4 rounded-xl text-left">
                <p class="text-sm text-[#94A3B8]">${saran}</p>
            </div>
            
            <button onclick="saveBMIResultWithAntiSpam(${bmi.toFixed(1)}, '${kategori}')" class="save-btn w-full mt-4 bg-[#1E293B] hover:bg-[#2D3A4F] text-white py-3 rounded-xl transition flex items-center justify-center space-x-2">
                <i class="fas fa-save"></i>
                <span>Save to History</span>
            </button>
        </div>
    `;
    
    // Simpan ke history dengan anti-spam
    const record = {
        id: Date.now(),
        type: 'BMI',
        value: bmi.toFixed(1),
        detail: `${kategori} - Range: ${idealMin}-${idealMax}kg`,
        unit: 'BMI',
        category: kategori,
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
    AntiSpamSystem.endCalculation('bmi');
    
    showNotification('BMI calculated successfully!', 'success');
}

// Anti-spam untuk save button BMI
let lastBMISaveTime = 0;
let lastBMISaveData = null;

function saveBMIResultWithAntiSpam(value, category) {
    const now = Date.now();
    const currentData = { value, category };
    
    // Cek interval (5 detik)
    if (now - lastBMISaveTime < 5000) {
        const waitTime = Math.ceil((5000 - (now - lastBMISaveTime)) / 1000);
        showNotification(`Please wait ${waitTime} second before saving again`, 'warning');
        return;
    }
    
    // Cek duplicate
    if (lastBMISaveData && JSON.stringify(currentData) === JSON.stringify(lastBMISaveData)) {
        showNotification('This result has already been saved', 'info');
        return;
    }
    
    lastBMISaveTime = now;
    lastBMISaveData = currentData;
    showNotification('Result saved to history!', 'success');
}