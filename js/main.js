// Main JavaScript - Global Functions dengan Anti-Spam

// Notifikasi system (update dengan anti-duplicate)
function showNotification(message, type = 'info') {
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    
    // Cek notifikasi duplikat
    const existingNotifications = document.querySelectorAll('.notification');
    for (let notif of existingNotifications) {
        if (notif.innerText.includes(message)) {
            return;
        }
    }
    
    // Hapus notifikasi yang sudah ada jika terlalu banyak
    if (existingNotifications.length > 3) {
        existingNotifications[0].remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification fixed bottom-4 right-4 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in`;
    notification.style.backgroundColor = colors[type];
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Loading screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// Smooth scroll
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

// Debounce function
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

// Format number
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// Export functions
window.showNotification = showNotification;
window.debounce = debounce;
window.formatNumber = formatNumber;