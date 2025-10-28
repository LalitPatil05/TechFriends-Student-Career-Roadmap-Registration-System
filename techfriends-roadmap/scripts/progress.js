// Progress Page Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Time Filter Functionality
    const timeFilter = document.querySelector('.time-filter select');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            updateProgressData(this.value);
        });
    }

    // Progress Circle Animations
    animateProgressCircles();

    // Bar Chart Hover Effects
    initializeChartInteractions();

    // Milestone Timeline Animations
    initializeMilestoneAnimations();

    // Table Sorting (Optional Enhancement)
    initializeTableSorting();
});

function updateProgressData(timeRange) {
    // Simulate data loading
    const loadingElements = document.querySelectorAll('.progress-circle, .bar, .meter-fill');
    loadingElements.forEach(el => {
        el.style.opacity = '0.5';
    });

    // In a real application, you would fetch new data here
    setTimeout(() => {
        loadingElements.forEach(el => {
            el.style.opacity = '1';
        });
        
        // Show notification
        showNotification(`Showing data for ${timeRange} period`);
    }, 1000);
}

function animateProgressCircles() {
    const circles = document.querySelectorAll('.progress-circle circle:nth-child(2)');
    
    circles.forEach(circle => {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (parseInt(circle.style.strokeDashoffset) / 100 * circumference);
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 1s ease-in-out';
            circle.style.strokeDashoffset = offset;
        }, 500);
    });
}

function initializeChartInteractions() {
    const bars = document.querySelectorAll('.bar, .day-bar .bar');
    
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function initializeMilestoneAnimations() {
    const milestones = document.querySelectorAll('.milestone-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    milestones.forEach(milestone => {
        milestone.style.opacity = '0';
        milestone.style.transform = 'translateY(20px)';
        milestone.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(milestone);
    });
}

function initializeTableSorting() {
    const table = document.querySelector('.progress-table');
    if (!table) return;
    
    const headers = table.querySelectorAll('th');
    let currentSort = { column: null, direction: 'asc' };
    
    headers.forEach((header, index) => {
        if (index > 0 && index < headers.length - 1) { // Skip first and last columns
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                sortTable(index, header);
            });
        }
    });
    
    function sortTable(columnIndex, header) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        const direction = currentSort.column === columnIndex && currentSort.direction === 'asc' ? 'desc' : 'asc';
        
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();
            
            let comparison = 0;
            if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
                // Numeric comparison
                comparison = parseFloat(aValue) - parseFloat(bValue);
            } else {
                // String comparison
                comparison = aValue.localeCompare(bValue);
            }
            
            return direction === 'asc' ? comparison : -comparison;
        });
        
        // Remove existing rows
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        
        // Add sorted rows
        rows.forEach(row => tbody.appendChild(row));
        
        // Update sort indicator
        updateSortIndicator(header, direction);
        currentSort = { column: columnIndex, direction };
    }
    
    function updateSortIndicator(header, direction) {
        // Remove existing indicators
        headers.forEach(h => {
            h.querySelector('.sort-indicator')?.remove();
        });
        
        // Add new indicator
        const indicator = document.createElement('span');
        indicator.className = 'sort-indicator';
        indicator.textContent = direction === 'asc' ? ' ↑' : ' ↓';
        indicator.style.marginLeft = '5px';
        indicator.style.color = 'var(--primary-color)';
        header.appendChild(indicator);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .sort-indicator {
        font-weight: bold;
    }
`;
document.head.appendChild(style);