// Settings Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsPage();
});

function initializeSettingsPage() {
    // Check authentication
    checkAuthentication();
    
    // Initialize navigation
    initializeSettingsNavigation();
    
    // Initialize tab system
    initializeTabSystem();
    
    // Initialize form handling
    initializeSettingsForms();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Load settings data
    loadSettingsData();
}

function checkAuthentication() {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Please login to access settings', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Load user settings
    loadUserSettings(currentUser);
}

function loadUserSettings(user) {
    // This would load user settings from localStorage or API
    // For demo, we're using default values
    updateSettingsUI(user);
}

function updateSettingsUI(user) {
    // Update user information in settings
    const userElements = {
        'basic-name': user.name || 'Demo User',
        'basic-email': user.email || 'student@demo.com'
    };
    
    Object.keys(userElements).forEach(key => {
        const element = document.querySelector(`[data-setting="${key}"]`);
        if (element) {
            element.textContent = userElements[key];
        }
    });
}

function initializeSettingsNavigation() {
    // User dropdown
    const userToggle = document.getElementById('userToggle');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userToggle && userDropdown) {
        userToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function() {
            userDropdown.classList.remove('show');
        });
        
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
}

function initializeTabSystem() {
    const navItems = document.querySelectorAll('.settings-nav .nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Save active tab to localStorage
            localStorage.setItem('activeSettingsTab', targetTab);
        });
    });
    
    // Restore active tab from localStorage
    const savedTab = localStorage.getItem('activeSettingsTab') || 'account';
    const savedNavItem = document.querySelector(`[data-tab="${savedTab}"]`);
    const savedTabContent = document.getElementById(savedTab);
    
    if (savedNavItem && savedTabContent) {
        navItems.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        savedNavItem.classList.add('active');
        savedTabContent.classList.add('active');
    }
}

function initializeSettingsForms() {
    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
        
        // Password strength indicator
        const newPasswordInput = document.getElementById('newPassword');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', updatePasswordStrength);
        }
    }
    
    // Theme selection
    initializeThemeSelection();
    
    // Learning style selection
    initializeLearningStyleSelection();
    
    // Toggle switches
    initializeToggleSwitches();
}

function initializeThemeSelection() {
    const themePreviews = document.querySelectorAll('.theme-preview');
    
    themePreviews.forEach(preview => {
        preview.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Update active state
            themePreviews.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            // Apply theme (in a real app, this would change CSS variables)
            applyTheme(theme);
            
            // Save theme preference
            localStorage.setItem('preferredTheme', theme);
            
            showNotification(`Theme changed to ${theme} mode`, 'success');
        });
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('preferredTheme') || 'light';
    const savedThemePreview = document.querySelector(`[data-theme="${savedTheme}"]`);
    if (savedThemePreview) {
        savedThemePreview.classList.add('active');
        applyTheme(savedTheme);
    }
}

function applyTheme(theme) {
    // This would update CSS variables for theming
    // For demo, we're just logging the theme change
    console.log('Applying theme:', theme);
}

function initializeLearningStyleSelection() {
    const styleOptions = document.querySelectorAll('.style-option input');
    
    styleOptions.forEach(option => {
        option.addEventListener('change', function() {
            const style = this.id;
            
            // Save learning style preference
            localStorage.setItem('learningStyle', style);
            
            showNotification(`Learning style updated to ${style}`, 'success');
        });
    });
    
    // Load saved learning style
    const savedStyle = localStorage.getItem('learningStyle') || 'visual';
    const savedStyleOption = document.getElementById(savedStyle);
    if (savedStyleOption) {
        savedStyleOption.checked = true;
    }
}

function initializeToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    
    toggleSwitches.forEach(toggle => {
        // Load saved state
        const toggleId = toggle.closest('.toggle-item')?.querySelector('h4')?.textContent;
        if (toggleId) {
            const savedState = localStorage.getItem(`toggle_${toggleId}`);
            if (savedState !== null) {
                toggle.checked = savedState === 'true';
            }
        }
        
        toggle.addEventListener('change', function() {
            const toggleId = this.closest('.toggle-item')?.querySelector('h4')?.textContent;
            if (toggleId) {
                // Save toggle state
                localStorage.setItem(`toggle_${toggleId}`, this.checked);
                
                showNotification(`Notification setting updated`, 'info');
            }
        });
    });
}

function initializeInteractiveElements() {
    // Form select elements
    const formSelects = document.querySelectorAll('.form-select');
    formSelects.forEach(select => {
        // Load saved value
        const selectId = select.id || select.name;
        if (selectId) {
            const savedValue = localStorage.getItem(`select_${selectId}`);
            if (savedValue !== null) {
                select.value = savedValue;
            }
        }
        
        select.addEventListener('change', function() {
            const selectId = this.id || this.name;
            if (selectId) {
                localStorage.setItem(`select_${selectId}`, this.value);
            }
        });
    });
}

function loadSettingsData() {
    // This would load settings from an API
    // For demo, we're using static data
    
    // Simulate loading
    setTimeout(() => {
        // Any initialization after data load
    }, 500);
}

// Password Functions
function openPasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('passwordForm').reset();
    }
}

function handlePasswordChange(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
        showNotification('New passwords do not match!', 'error');
        return;
    }
    
    // Validate password strength
    const strength = calculatePasswordStrength(data.newPassword);
    if (strength.level === 'weak') {
        showNotification('Please choose a stronger password', 'warning');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Password updated successfully!', 'success');
        closePasswordModal();
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Reset form
        e.target.reset();
    }, 2000);
}

function updatePasswordStrength() {
    const password = this.value;
    const strength = calculatePasswordStrength(password);
    const strengthFill = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (!strengthFill || !strengthText) return;
    
    strengthFill.className = 'strength-fill ' + strength.level;
    strengthFill.style.width = strength.score * 20 + '%';
    strengthText.textContent = strength.level.charAt(0).toUpperCase() + strength.level.slice(1);
    strengthText.className = 'strength-text ' + strength.level;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    if (password.length === 0) return { level: 'empty', score: 0 };
    if (strength <= 2) return { level: 'weak', score: strength };
    if (strength <= 4) return { level: 'medium', score: strength };
    return { level: 'strong', score: strength };
}

// 2FA Functions
function enable2FA() {
    const modal = document.getElementById('twoFAModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function close2FAModal() {
    const modal = document.getElementById('twoFAModal');
    if (modal) {
        modal.classList.remove('show');
        reset2FASteps();
    }
}

function next2FAStep() {
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
}

function prev2FAStep() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
}

function verify2FACode() {
    const codeInput = document.querySelector('.code-input');
    if (!codeInput || codeInput.value.length !== 6) {
        showNotification('Please enter a valid 6-digit code', 'error');
        return;
    }
    
    // Simulate verification
    showNotification('Verifying 2FA code...', 'info');
    
    setTimeout(() => {
        showNotification('Two-factor authentication enabled successfully!', 'success');
        close2FAModal();
        
        // Update UI
        const statusBadge = document.querySelector('.security-status .status-badge');
        const enableBtn = document.querySelector('.security-status .btn-primary');
        
        if (statusBadge && enableBtn) {
            statusBadge.textContent = 'Enabled';
            statusBadge.className = 'status-badge enabled';
            enableBtn.textContent = 'Disable 2FA';
            enableBtn.onclick = disable2FA;
        }
    }, 2000);
}

function disable2FA() {
    if (confirm('Are you sure you want to disable two-factor authentication?')) {
        showNotification('2FA disabled successfully!', 'success');
        
        // Update UI
        const statusBadge = document.querySelector('.security-status .status-badge');
        const disableBtn = document.querySelector('.security-status .btn-primary');
        
        if (statusBadge && disableBtn) {
            statusBadge.textContent = 'Disabled';
            statusBadge.className = 'status-badge disabled';
            disableBtn.textContent = 'Enable 2FA';
            disableBtn.onclick = enable2FA;
        }
    }
}

function reset2FASteps() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    
    const codeInput = document.querySelector('.code-input');
    if (codeInput) {
        codeInput.value = '';
    }
}

// Account Actions
function deactivateAccount() {
    if (confirm('Are you sure you want to deactivate your account? You can reactivate it anytime by logging in.')) {
        showNotification('Deactivating account...', 'info');
        
        setTimeout(() => {
            showNotification('Account deactivated successfully', 'success');
            // In a real app, this would call an API to deactivate the account
        }, 2000);
    }
}

function deleteAccount() {
    const modal = document.getElementById('deleteAccountModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteAccountModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('confirmDelete').checked = false;
        document.getElementById('confirmDeleteBtn').disabled = true;
    }
}

function confirmDeleteAccount() {
    showNotification('Deleting account... This cannot be undone!', 'error');
    
    setTimeout(() => {
        // In a real app, this would call an API to delete the account
        UserManager.logoutUser();
        showNotification('Account deleted successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 3000);
}

// Notification Controls
function enableAllNotifications() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change'));
    });
    showNotification('All notifications enabled', 'success');
}

function disableAllNotifications() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.checked = false;
        toggle.dispatchEvent(new Event('change'));
    });
    showNotification('All notifications disabled', 'success');
}

// Data Export
function exportData() {
    showNotification('Preparing your data export...', 'info');
    
    // Simulate data preparation
    setTimeout(() => {
        const data = {
            user: UserManager.getCurrentUser(),
            settings: getAllSettings(),
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `techfriends-data-${new Date().getTime()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('Data exported successfully!', 'success');
    }, 2000);
}

function getAllSettings() {
    const settings = {};
    
    // Get all toggle states
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        const label = toggle.closest('.toggle-item')?.querySelector('h4')?.textContent;
        if (label) {
            settings[label] = toggle.checked;
        }
    });
    
    // Get all select values
    const formSelects = document.querySelectorAll('.form-select');
    formSelects.forEach(select => {
        const label = select.previousElementSibling?.textContent;
        if (label) {
            settings[label] = select.value;
        }
    });
    
    return settings;
}

function viewLoginActivity() {
    showNotification('Opening login activity...', 'info');
    // In a real app, this would show a modal with login history
}

function openEditModal(type) {
    showNotification(`Edit ${type} information modal would open here`, 'info');
}

// Event Listeners for Delete Confirmation
document.addEventListener('DOMContentLoaded', function() {
    const confirmDeleteCheckbox = document.getElementById('confirmDelete');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    if (confirmDeleteCheckbox && confirmDeleteBtn) {
        confirmDeleteCheckbox.addEventListener('change', function() {
            confirmDeleteBtn.disabled = !this.checked;
        });
    }
});

function handleLogout() {
    UserManager.logoutUser();
    showNotification('Logged out successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Enhanced notification system for settings
function showSettingsNotification(message, type = 'info', duration = 4000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.settings-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `settings-notification notification-${type}`;
    
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
    
    // Add settings notification styles if not already added
    if (!document.querySelector('#settings-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'settings-notification-styles';
        styles.textContent = `
            .settings-notification {
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
            
            .settings-notification.notification-success {
                border-left-color: var(--success-color);
            }
            
            .settings-notification.notification-error {
                border-left-color: var(--danger-color);
            }
            
            .settings-notification.notification-warning {
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
            
            .settings-notification.notification-success .notification-content i:first-child {
                color: var(--success-color);
            }
            
            .settings-notification.notification-error .notification-content i:first-child {
                color: var(--danger-color);
            }
            
            .settings-notification.notification-warning .notification-content i:first-child {
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

// Override the showNotification function for settings page
function showNotification(message, type = 'info') {
    showSettingsNotification(message, type, 4000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const modals = ['passwordModal', 'twoFAModal', 'deleteAccountModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && e.target === modal) {
            if (modalId === 'passwordModal') closePasswordModal();
            if (modalId === 'twoFAModal') close2FAModal();
            if (modalId === 'deleteAccountModal') closeDeleteModal();
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        closePasswordModal();
        close2FAModal();
        closeDeleteModal();
        
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.classList.remove('show');
        }
    }
});

// Initialize settings when page loads
window.addEventListener('load', function() {
    // Add loading animation
    const mainContent = document.querySelector('.settings-main');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 300);
    }
});