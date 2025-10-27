// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check authentication
    checkAuthentication();
    
    // Initialize navigation
    initializeDashboardNavigation();
    
    // Initialize search functionality
    initializeDashboardSearch();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize progress animations
    initializeProgressAnimations();
}

function checkAuthentication() {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Please login to access dashboard', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Update user info in the dashboard
    updateUserInfo(currentUser);
}

function updateUserInfo(user) {
    // Update user name and avatar throughout the dashboard
    const userElements = document.querySelectorAll('.user-name, .user-details strong');
    const avatarElements = document.querySelectorAll('.user-avatar, .user-avatar-large img');
    
    userElements.forEach(element => {
        element.textContent = user.name || 'Demo User';
    });
    
    // In a real app, you would use the actual user avatar
    // For demo, we'll keep the default avatars
}

function initializeDashboardNavigation() {
    // User dropdown
    const userToggle = document.getElementById('userToggle');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userToggle && userDropdown) {
        userToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.remove('show');
        });
        
        // Prevent dropdown from closing when clicking inside
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Mobile sidebar toggle (would be implemented in real app)
    initializeMobileSidebar();
}

function initializeMobileSidebar() {
    // This would handle mobile sidebar toggle
    // For now, it's a placeholder for future implementation
}

function initializeDashboardSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchModal = document.getElementById('searchModal');
    
    if (searchToggle && searchModal) {
        searchToggle.addEventListener('click', function() {
            searchModal.classList.add('show');
        });
    }
    
    // Search functionality would be implemented here
    initializeSearchFunctionality();
}

function initializeSearchFunctionality() {
    const searchInput = document.querySelector('#searchModal input');
    const searchTags = document.querySelectorAll('.search-tag');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            performSearch(e.target.value);
        }, 300));
    }
    
    // Add click handlers to search tags
    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchText = this.textContent;
            if (searchInput) {
                searchInput.value = searchText;
                performSearch(searchText);
            }
        });
    });
}

function performSearch(query) {
    if (query.trim().length === 0) {
        // Show recent searches or popular content
        return;
    }
    
    // In a real app, this would make an API call
    console.log('Searching for:', query);
    
    // Simulate search results
    showNotification(`Searching for "${query}"...`, 'info');
}

function closeSearchModal() {
    const searchModal = document.getElementById('searchModal');
    if (searchModal) {
        searchModal.classList.remove('show');
    }
}

function loadDashboardData() {
    // Load user progress data
    loadUserProgress();
    
    // Load recent activity
    loadRecentActivity();
    
    // Load recommendations
    loadRecommendations();
    
    // Load deadlines
    loadDeadlines();
}

function loadUserProgress() {
    // This would typically fetch data from an API
    // For demo, we're using static data that's already in the HTML
    
    // Simulate loading progress animations
    setTimeout(() => {
        animateProgressBars();
    }, 500);
}

function loadRecentActivity() {
    // This would fetch recent activity from an API
    // For demo, we're using static data
}

function loadRecommendations() {
    // This would fetch personalized recommendations
    // For demo, we're using static data
}

function loadDeadlines() {
    // This would fetch upcoming deadlines
    // For demo, we're using static data
}

function initializeInteractiveElements() {
    // Continue buttons
    const continueButtons = document.querySelectorAll('.btn-continue, .course-actions .btn-primary');
    continueButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            handleContinueLearning(this);
        });
    });
    
    // Course card clicks
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseTitle = this.querySelector('h3').textContent;
            showCourseDetails(courseTitle);
        });
    });
    
    // Deadline actions
    const deadlineActions = document.querySelectorAll('.deadline-item button');
    deadlineActions.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            handleDeadlineAction(this);
        });
    });
}

function handleContinueLearning(button) {
    const card = button.closest('.course-card, .progress-card');
    const courseTitle = card.querySelector('h3, h4').textContent;
    
    showNotification(`Continuing with ${courseTitle}...`, 'success');
    
    // Simulate loading
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
        // In a real app, this would redirect to the course/lesson
        showNotification(`Redirecting to ${courseTitle}...`, 'info');
        
        // Reset button state
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-play"></i> Continue';
    }, 2000);
}

function showCourseDetails(courseTitle) {
    showNotification(`Showing details for ${courseTitle}`, 'info');
    
    // In a real app, this would open a modal or redirect to course page
    // For demo, we'll simulate a delay and show a message
    setTimeout(() => {
        // This would be replaced with actual course details view
        console.log('Course details:', courseTitle);
    }, 500);
}

function handleDeadlineAction(button) {
    const deadlineItem = button.closest('.deadline-item');
    const deadlineTitle = deadlineItem.querySelector('h4').textContent;
    const action = button.textContent.trim();
    
    showNotification(`${action} for ${deadlineTitle}`, 'info');
    
    // Simulate action
    button.disabled = true;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalText;
        
        // Mark as completed or handle the action
        if (action === 'Work on it' || action === 'Start Quiz') {
            deadlineItem.style.opacity = '0.7';
            showNotification(`Started working on ${deadlineTitle}`, 'success');
        }
    }, 1500);
}

function initializeProgressAnimations() {
    // Animate progress bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                animateProgressBar(progressBar);
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

function animateProgressBar(progressBar) {
    const fill = progressBar.querySelector('.progress-fill');
    const currentWidth = fill.style.width;
    
    // Reset to 0 for animation
    fill.style.width = '0%';
    
    // Animate to the actual width
    setTimeout(() => {
        fill.style.transition = 'width 1s ease-in-out';
        fill.style.width = currentWidth;
    }, 100);
}

function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    
    progressFills.forEach(fill => {
        const currentWidth = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
            fill.style.transition = 'width 1.5s ease-in-out';
            fill.style.width = currentWidth;
        }, 200);
    });
}

function handleLogout() {
    UserManager.logoutUser();
    showNotification('Logged out successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Utility function for debouncing
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

// Enhanced notification system for dashboard
function showDashboardNotification(message, type = 'info', duration = 4000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.dashboard-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `dashboard-notification notification-${type}`;
    
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add dashboard notification styles if not already added
    if (!document.querySelector('#dashboard-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'dashboard-notification-styles';
        styles.textContent = `
            .dashboard-notification {
                position: fixed;
                top: 90px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                border-left: 4px solid var(--primary-color);
                z-index: 2000;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
            }
            
            .dashboard-notification.notification-success {
                border-left-color: var(--success-color);
            }
            
            .dashboard-notification.notification-error {
                border-left-color: var(--danger-color);
            }
            
            .dashboard-notification.notification-warning {
                border-left-color: var(--accent-color);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-content i:first-child {
                color: var(--primary-color);
            }
            
            .dashboard-notification.notification-success .notification-content i:first-child {
                color: var(--success-color);
            }
            
            .dashboard-notification.notification-error .notification-content i:first-child {
                color: var(--danger-color);
            }
            
            .dashboard-notification.notification-warning .notification-content i:first-child {
                color: var(--accent-color);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--gray-color);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: var(--transition);
                margin-left: auto;
            }
            
            .notification-close:hover {
                background: #f1f5f9;
                color: var(--dark-color);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
    
    return notification;
}

// Override the showNotification function for dashboard
function showNotification(message, type = 'info') {
    showDashboardNotification(message, type, 4000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const searchModal = document.getElementById('searchModal');
    if (searchModal && e.target === searchModal) {
        closeSearchModal();
    }
});

// Keyboard shortcuts for dashboard
document.addEventListener('keydown', function(e) {
    // Ctrl + K for search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchModal = document.getElementById('searchModal');
        if (searchModal) {
            searchModal.classList.add('show');
            const searchInput = searchModal.querySelector('input');
            if (searchInput) searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeSearchModal();
        
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.classList.remove('show');
        }
    }
});

// Initialize dashboard when page loads
window.addEventListener('load', function() {
    // Add loading animation
    const mainContent = document.querySelector('.dashboard-main');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 300);
    }
});