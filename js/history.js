// History Page - Record Management

let currentFilter = 'all';
let currentData = [];

window.addEventListener('load', function() {
    loadHistory();
});

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
    currentData = history;
    
    displayHistory(history);
    updateStats(history);
}

function displayHistory(data) {
    const tbody = document.getElementById('historyTableBody');
    const emptyState = document.getElementById('emptyHistory');
    
    if (data.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        document.getElementById('showingText').textContent = 'Showing 0 records';
        return;
    }
    
    emptyState.classList.add('hidden');
    
    let html = '';
    data.forEach((record, index) => {
        let categoryClass = '';
        if (record.category === 'Underweight') categoryClass = 'text-[#3B82F6]';
        else if (record.category === 'Normal') categoryClass = 'text-[#10B981]';
        else if (record.category === 'Overweight') categoryClass = 'text-[#F59E0B]';
        else if (record.category === 'Obese') categoryClass = 'text-[#EF4444]';
        
        html += `
            <tr class="border-b border-[#1E293B] hover:bg-[#1E293B]/50 transition">
                <td class="py-4 px-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-${getTypeColor(record.type)}/10 rounded-lg flex items-center justify-center">
                            <i class="fas fa-${getTypeIcon(record.type)} text-${getTypeColor(record.type)}"></i>
                        </div>
                        <span class="text-white">${record.type}</span>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <span class="text-white font-medium">${record.value} ${record.unit || ''}</span>
                    ${record.detail ? `<span class="text-[#64748B] text-xs block">${record.detail}</span>` : ''}
                </td>
                <td class="py-4 px-4">
                    ${record.category ? `<span class="${categoryClass}">${record.category}</span>` : '-'}
                </td>
                <td class="py-4 px-4">
                    <span class="text-[#94A3B8]">${record.date || new Date(record.timestamp).toLocaleString()}</span>
                </td>
                <td class="py-4 px-4">
                    <div class="flex space-x-2">
                        <button onclick="viewDetails(${record.id})" class="text-[#3B82F6] hover:text-[#2563EB]">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="deleteRecord(${record.id})" class="text-[#EF4444] hover:text-[#DC2626]">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    document.getElementById('showingText').textContent = `Showing 1-${data.length} of ${data.length} records`;
}

function getTypeColor(type) {
    switch(type) {
        case 'BMI': return '[#3B82F6]';
        case 'Carbon': return '[#10B981]';
        case 'BMR': return '[#F59E0B]';
        default: return '[#64748B]';
    }
}

function getTypeIcon(type) {
    switch(type) {
        case 'BMI': return 'weight-scale';
        case 'Carbon': return 'leaf';
        case 'BMR': return 'fire';
        default: return 'circle';
    }
}

function filterHistory(type) {
    currentFilter = type;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = btn.className.replace('active bg-[#6366F1] text-white', 'bg-[#1E293B] text-[#94A3B8]');
    });
    
    event.target.className = 'filter-btn active px-4 py-2 bg-[#6366F1] text-white rounded-lg text-sm';
    
    const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
    
    if (type === 'all') {
        displayHistory(history);
    } else {
        const filtered = history.filter(item => item.type === type);
        displayHistory(filtered);
    }
}

function searchHistory() {
    const searchTerm = document.getElementById('searchHistory').value.toLowerCase();
    const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
    
    const filtered = history.filter(item => 
        item.type.toLowerCase().includes(searchTerm) ||
        (item.value && item.value.toString().includes(searchTerm)) ||
        (item.category && item.category.toLowerCase().includes(searchTerm))
    );
    
    displayHistory(filtered);
}

document.getElementById('searchHistory').addEventListener('input', debounce(searchHistory, 300));

function clearHistory() {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
        localStorage.removeItem('healthHistory');
        loadHistory();
        showNotification('All history cleared', 'warning');
    }
}

function deleteRecord(id) {
    if (confirm('Delete this record?')) {
        const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
        const filtered = history.filter(item => item.id !== id);
        localStorage.setItem('healthHistory', JSON.stringify(filtered));
        loadHistory();
        showNotification('Record deleted', 'success');
    }
}

function viewDetails(id) {
    const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
    const record = history.find(item => item.id === id);
    
    alert(JSON.stringify(record, null, 2));
}

function exportHistory() {
    const history = JSON.parse(localStorage.getItem('healthHistory') || '[]');
    
    // Convert to CSV
    const headers = ['Type', 'Value', 'Category', 'Date', 'Timestamp'];
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    history.forEach(record => {
        const row = [
            record.type,
            record.value,
            record.category || '',
            record.date || '',
            record.timestamp
        ];
        csvRows.push(row.join(','));
    });
    
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showNotification('History exported to CSV', 'success');
}

function showNotification(message, type) {
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in`;
    notification.style.backgroundColor = colors[type];
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

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

function updateStats(history) {
    // Update showing text based on current filter
    const filteredCount = currentFilter === 'all' 
        ? history.length 
        : history.filter(item => item.type === currentFilter).length;
    
    document.getElementById('showingText').textContent = `Showing ${filteredCount} records`;
}