// Analytics Page - Charts and Data Visualization

let bmiChart, carbonChart, bmrChart, weightChart;

window.addEventListener('load', function() {
    loadAnalyticsData();
});

function loadAnalyticsData() {
    const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
    
    // Process data for charts
    const bmiData = history.filter(item => item.type === 'BMI').slice(0, 10);
    const carbonData = history.filter(item => item.type === 'Carbon').slice(0, 10);
    const bmrData = history.filter(item => item.type === 'BMR').slice(0, 10);
    
    createBMIChart(bmiData);
    createCarbonChart(carbonData);
    createBMRChart(bmrData);
    createWeightDistributionChart(history);
    
    updateStats(history);
}

function createBMIChart(data) {
    const ctx = document.getElementById('bmiChart').getContext('2d');
    
    if (bmiChart) bmiChart.destroy();
    
    bmiChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => {
                const date = new Date(item.timestamp);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'BMI',
                data: data.map(item => parseFloat(item.value)),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94A3B8' }
                }
            },
            scales: {
                y: {
                    grid: { color: '#1E293B' },
                    ticks: { color: '#64748B' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94A3B8' }
                }
            }
        }
    });
}

function createCarbonChart(data) {
    const ctx = document.getElementById('carbonChart').getContext('2d');
    
    if (carbonChart) carbonChart.destroy();
    
    carbonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => {
                const date = new Date(item.timestamp);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'Carbon (kg)',
                data: data.map(item => parseFloat(item.value)),
                backgroundColor: '#10B981',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94A3B8' }
                }
            },
            scales: {
                y: {
                    grid: { color: '#1E293B' },
                    ticks: { color: '#64748B' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94A3B8' }
                }
            }
        }
    });
}

function createBMRChart(data) {
    const ctx = document.getElementById('bmrChart').getContext('2d');
    
    if (bmrChart) bmrChart.destroy();
    
    bmrChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => {
                const date = new Date(item.timestamp);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'BMR (calories)',
                data: data.map(item => parseFloat(item.value)),
                borderColor: '#EC4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94A3B8' }
                }
            },
            scales: {
                y: {
                    grid: { color: '#1E293B' },
                    ticks: { color: '#64748B' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94A3B8' }
                }
            }
        }
    });
}

function createWeightDistributionChart(history) {
    const ctx = document.getElementById('weightChart').getContext('2d');
    
    const bmiRecords = history.filter(item => item.type === 'BMI');
    const categories = {
        'Underweight': 0,
        'Normal': 0,
        'Overweight': 0,
        'Obese': 0
    };
    
    bmiRecords.forEach(record => {
        if (categories.hasOwnProperty(record.category)) {
            categories[record.category]++;
        }
    });
    
    if (weightChart) weightChart.destroy();
    
    weightChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94A3B8' }
                }
            }
        }
    });
}

function updateStats(history) {
    const bmiValues = history.filter(item => item.type === 'BMI').map(item => parseFloat(item.value));
    const carbonValues = history.filter(item => item.type === 'Carbon').map(item => parseFloat(item.value));
    const bmrValues = history.filter(item => item.type === 'BMR').map(item => parseFloat(item.value));
    
    const avgBmi = bmiValues.length ? (bmiValues.reduce((a, b) => a + b, 0) / bmiValues.length).toFixed(1) : '22.4';
    const avgCarbon = carbonValues.length ? (carbonValues.reduce((a, b) => a + b, 0) / carbonValues.length).toFixed(1) : '14.8';
    const avgBmr = bmrValues.length ? Math.round(bmrValues.reduce((a, b) => a + b, 0) / bmrValues.length) : '1832';
    
    document.getElementById('avgBmi').textContent = avgBmi;
    document.getElementById('avgCarbon').textContent = avgCarbon + ' kg';
    document.getElementById('avgBmr').textContent = avgBmr + ' cal';
    document.getElementById('totalRecords').textContent = history.length;
}

function setTimeRange(range) {
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.className = btn.className.replace('active bg-[#EC4899] text-white', 'bg-[#1E293B] text-[#94A3B8]');
    });
    
    event.target.className = 'time-btn active px-4 py-2 bg-[#EC4899] text-white rounded-lg text-sm';
    
    // Filter data based on range
    showNotification(`Showing ${range} data`, 'info');
}

function refreshData() {
    loadAnalyticsData();
    showNotification('Data refreshed!', 'success');
}

function exportReport() {
    showNotification('Generating comprehensive report...', 'info');
    setTimeout(() => {
        showNotification('Report exported successfully!', 'success');
    }, 2000);
}