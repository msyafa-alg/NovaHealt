// Script.js - All Calculator Functions

// Fungsi Scroll
function scrollToBMI() {
    document.getElementById('bmi').scrollIntoView({ behavior: 'smooth' });
}

// BMI Calculator
function hitungBMI() {
    const tinggi = parseFloat(document.getElementById('tinggi').value) / 100;
    const berat = parseFloat(document.getElementById('berat').value);
    const usia = parseFloat(document.getElementById('usia').value);
    
    if (!tinggi || !berat || !usia) {
        alert('Mohon isi semua data dengan lengkap!');
        return;
    }
    
    const bmi = berat / (tinggi * tinggi);
    let kategori = '';
    let warna = '';
    let saran = '';
    
    if (bmi < 18.5) {
        kategori = 'KURUS';
        warna = 'text-yellow-400';
        saran = 'Perlu meningkatkan asupan nutrisi dan kalori';
    } else if (bmi >= 18.5 && bmi < 25) {
        kategori = 'IDEAL';
        warna = 'text-green-400';
        saran = 'Berat badan Anda sudah ideal, pertahankan!';
    } else if (bmi >= 25 && bmi < 30) {
        kategori = 'KELEBIHAN BERAT BADAN';
        warna = 'text-orange-400';
        saran = 'Mulai program penurunan berat badan secara sehat';
    } else {
        kategori = 'OBESITAS';
        warna = 'text-red-400';
        saran = 'Konsultasikan dengan dokter untuk program diet';
    }
    
    const resultDiv = document.getElementById('bmiResult');
    resultDiv.innerHTML = `
        <div class="text-center">
            <div class="text-5xl font-bold ${warna} mb-2">${bmi.toFixed(1)}</div>
            <div class="text-xl text-white mb-4">BMI Anda: <span class="font-bold ${warna}">${kategori}</span></div>
            <div class="h-2 w-full bg-gray-700 rounded-full mb-4">
                <div class="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style="width: ${Math.min(bmi * 4, 100)}%"></div>
            </div>
            <div class="text-gray-300 mb-3">${saran}</div>
            <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="bg-white/10 p-3 rounded-xl">
                    <span class="text-gray-400">Berat Ideal</span><br>
                    <span class="text-white font-bold">${((18.5 * (tinggi * tinggi)).toFixed(1))} - ${((24.9 * (tinggi * tinggi)).toFixed(1))} kg</span>
                </div>
                <div class="bg-white/10 p-3 rounded-xl">
                    <span class="text-gray-400">Usia</span><br>
                    <span class="text-white font-bold">${usia} tahun</span>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
}

// Carbon Calculator
function hitungCarbon() {
    const kendaraan = parseFloat(document.getElementById('kendaraan').value) || 0;
    const listrik = parseFloat(document.getElementById('listrik').value) || 0;
    const gas = parseFloat(document.getElementById('gas').value) || 0;
    
    // Rumus sederhana jejak karbon (kg CO2/hari)
    const carbonKendaraan = kendaraan * 0.21; // rata-rata emisi kendaraan per km
    const carbonListrik = listrik * 0.85; // rata-rata emisi listrik per kWh
    const carbonGas = gas * 2.98; // emisi gas LPG per kg
    
    const totalCarbon = carbonKendaraan + carbonListrik + carbonGas;
    const tahunan = totalCarbon * 365;
    
    let level = '';
    let warna = '';
    
    if (totalCarbon < 10) {
        level = 'RENDAH';
        warna = 'text-green-400';
    } else if (totalCarbon < 20) {
        level = 'SEDANG';
        warna = 'text-yellow-400';
    } else {
        level = 'TINGGI';
        warna = 'text-red-400';
    }
    
    const resultDiv = document.getElementById('carbonResult');
    resultDiv.innerHTML = `
        <div class="text-center">
            <div class="text-5xl font-bold text-green-400 mb-2">${totalCarbon.toFixed(1)}</div>
            <div class="text-xl text-white mb-4">Jejak Karbon: <span class="font-bold ${warna}">${level}</span></div>
            <div class="grid grid-cols-3 gap-2 mb-4">
                <div class="bg-white/10 p-2 rounded-lg text-sm">
                    <span class="text-gray-400">Kendaraan</span><br>
                    <span class="text-white font-bold">${carbonKendaraan.toFixed(1)} kg</span>
                </div>
                <div class="bg-white/10 p-2 rounded-lg text-sm">
                    <span class="text-gray-400">Listrik</span><br>
                    <span class="text-white font-bold">${carbonListrik.toFixed(1)} kg</span>
                </div>
                <div class="bg-white/10 p-2 rounded-lg text-sm">
                    <span class="text-gray-400">Gas</span><br>
                    <span class="text-white font-bold">${carbonGas.toFixed(1)} kg</span>
                </div>
            </div>
            <div class="text-gray-300 text-sm">
                Estimasi jejak karbon tahunan: <span class="font-bold text-white">${tahunan.toFixed(0)} kg CO2</span>
            </div>
            <div class="mt-4 p-3 bg-emerald-500/20 rounded-lg">
                <i class="fas fa-tree text-emerald-400 mr-2"></i>
                <span class="text-emerald-400">Butuh ${Math.ceil(tahunan / 20)} pohon untuk menyerap karbon ini!</span>
            </div>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
}

// BMR Calculator
function hitungBMR() {
    const gender = document.getElementById('gender').value;
    const tinggi = parseFloat(document.getElementById('tinggiBmr').value);
    const berat = parseFloat(document.getElementById('beratBmr').value);
    const usia = parseFloat(document.getElementById('usiaBmr').value);
    const aktivitas = parseFloat(document.getElementById('aktivitas').value);
    
    if (!tinggi || !berat || !usia) {
        alert('Mohon isi semua data dengan lengkap!');
        return;
    }
    
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * berat) + (4.799 * tinggi) - (5.677 * usia);
    } else {
        bmr = 447.593 + (9.247 * berat) + (3.098 * tinggi) - (4.330 * usia);
    }
    
    const tdee = bmr * aktivitas;
    
    const resultDiv = document.getElementById('bmrResult');
    resultDiv.innerHTML = `
        <div class="text-center">
            <div class="text-3xl font-bold text-purple-400 mb-2">${bmr.toFixed(0)} kalori</div>
            <div class="text-white mb-2">BMR (Basal Metabolic Rate)</div>
            <div class="h-px bg-white/20 my-4"></div>
            <div class="text-3xl font-bold text-pink-400 mb-2">${tdee.toFixed(0)} kalori</div>
            <div class="text-white mb-4">TDEE (Total Daily Energy)</div>
            <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="bg-white/10 p-3 rounded-xl">
                    <span class="text-gray-400">Turun Berat</span><br>
                    <span class="text-white font-bold">${(tdee - 500).toFixed(0)} kalori</span>
                </div>
                <div class="bg-white/10 p-3 rounded-xl">
                    <span class="text-gray-400">Naik Berat</span><br>
                    <span class="text-white font-bold">${(tdee + 500).toFixed(0)} kalori</span>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
}

// Ideal Weight Calculator
function hitungIdeal() {
    const tinggi = parseFloat(document.getElementById('tinggiIdeal').value);
    const gender = document.getElementById('genderIdeal').value;
    
    if (!tinggi) {
        alert('Masukkan tinggi badan!');
        return;
    }
    
    // Rumus Broca
    let beratIdeal;
    if (gender === 'male') {
        beratIdeal = (tinggi - 100) - ((tinggi - 100) * 0.1);
    } else {
        beratIdeal = (tinggi - 100) - ((tinggi - 100) * 0.15);
    }
    
    const minimal = beratIdeal - 2;
    const maksimal = beratIdeal + 2;
    
    const resultDiv = document.getElementById('idealResult');
    resultDiv.innerHTML = `
        <div class="text-center">
            <div class="text-4xl font-bold text-blue-400 mb-2">${beratIdeal.toFixed(1)} kg</div>
            <div class="text-white mb-4">Berat Badan Ideal Anda</div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-white/10 p-4 rounded-xl">
                    <span class="text-gray-400">Minimal</span><br>
                    <span class="text-white font-bold text-xl">${minimal.toFixed(1)} kg</span>
                </div>
                <div class="bg-white/10 p-4 rounded-xl">
                    <span class="text-gray-400">Maksimal</span><br>
                    <span class="text-white font-bold text-xl">${maksimal.toFixed(1)} kg</span>
                </div>
            </div>
            <div class="mt-4 p-3 bg-blue-500/20 rounded-lg">
                <i class="fas fa-info-circle text-blue-400 mr-2"></i>
                <span class="text-blue-400">Rentang berat ideal untuk tinggi ${tinggi} cm</span>
            </div>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
}

// Auto calculate on enter (optional)
document.querySelectorAll('.calculator-input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const parent = this.closest('.calculator-card');
            if (parent.id === 'bmi') hitungBMI();
            else if (parent.id === 'carbon') hitungCarbon();
            else if (parent.id === 'bmr') hitungBMR();
            else if (parent.id === 'ideal') hitungIdeal();
        }
    });
});

// Animasi smooth scroll untuk semua link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efek loading (optional)
window.addEventListener('load', function() {
    console.log('Health & Carbon Pro loaded successfully!');
});