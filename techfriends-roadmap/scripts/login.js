// Login Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

function initializeLogin() {
    // Check if user is already logged in
    checkExistingSession();
    
    // Initialize password toggle
    initializeLoginPasswordToggle();
    
    // Initialize form submission
    initializeLoginForm();
    
    // Initialize social buttons
    initializeSocialButtons();
    
    // Initialize demo access
    initializeDemoAccess();
}

function checkExistingSession() {
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
        // User is already logged in, redirect to dashboard
        showNotification(`Welcome back, ${currentUser.name}! Redirecting...`, 'info');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
}

function initializeLoginPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility(passwordInput, this);
        });
    }
}

function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Real-time validation
    const inputs = loginForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateLoginField(this);
        });
        
        input.addEventListener('input', function() {
            clearLoginFieldError(this);
        });
    });
}

function validateLoginField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';

    switch(fieldName) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'password':
            if (value.length < 1) {
                isValid = false;
                errorMessage = 'Please enter your password';
            }
            break;
    }

    if (!isValid) {
        showLoginFieldError(field, errorMessage);
    } else {
        clearLoginFieldError(field);
        showLoginFieldSuccess(field);
    }

    return isValid;
}

function showLoginFieldError(field, message) {
    clearLoginFieldError(field);
    field.classList.add('error');
    
    const errorId = field.getAttribute('name') + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function showLoginFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    
    const errorId = field.getAttribute('name') + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearLoginFieldError(field) {
    field.classList.remove('error', 'success');
    
    const errorId = field.getAttribute('name') + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

async function handleLogin() {
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('loginForm');
    
    // Validate all fields
    const fields = form.querySelectorAll('input[required]');
    let allValid = true;
    
    fields.forEach(field => {
        if (!validateLoginField(field)) {
            allValid = false;
        }
    });
    
    if (!allValid) {
        showNotification('Please fix the errors before submitting', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        };
        
        // Login user
        const user = UserManager.loginUser(formData.email, formData.password);
        
        // Handle remember me
        const rememberMe = document.getElementById('remember').checked;
        if (rememberMe) {
            StorageManager.setItem('techfriends_remember', true);
        }
        
        // Show success and redirect
        showNotification(`Welcome back, ${user.name}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        submitBtn.classList.remove('loading');
    }
}

function initializeSocialButtons() {
    const googleBtn = document.querySelector('.google-btn');
    const githubBtn = document.querySelector('.github-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            handleSocialLogin('google');
        });
    }
    
    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            handleSocialLogin('github');
        });
    }
}

function handleSocialLogin(provider) {
    showNotification(`Connecting with ${provider}...`, 'info');
    
    // Simulate social login process
    setTimeout(() => {
        // For demo purposes, create a mock user
        const mockUser = {
            id: 'social_' + Date.now(),
            name: provider === 'google' ? 'Google User' : 'GitHub User',
            email: `user@${provider}.com`,
            provider: provider,
            loggedInAt: new Date().toISOString()
        };
        
        StorageManager.setItem('techfriends_session', mockUser);
        
        showNotification(`Successfully connected with ${provider}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    }, 2000);
}

function initializeDemoAccess() {
    // Add demo access button to the form
    const authFooter = document.querySelector('.auth-footer');
    if (authFooter) {
        const demoAccess = document.createElement('div');
        demoAccess.className = 'demo-access';
        demoAccess.innerHTML = `
            <p>Want to explore first? <button class="demo-btn" onclick="showDemoModal()">Try Demo Accounts</button></p>
        `;
        authFooter.parentNode.insertBefore(demoAccess, authFooter);
    }
}

function showDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function useDemoAccount(type) {
    closeDemoModal();
    
    let demoUser;
    
    if (type === 'student') {
        demoUser = {
            id: 'demo_student_001',
            name: 'Demo Student',
            email: 'student@demo.com',
            role: 'student',
            careerInterest: 'web-development',
            progress: {
                'web-development': 65,
                'javascript': 40
            },
            loggedInAt: new Date().toISOString()
        };
    } else if (type === 'admin') {
        demoUser = {
            id: 'demo_admin_001',
            name: 'Demo Admin',
            email: 'admin@demo.com',
            role: 'admin',
            loggedInAt: new Date().toISOString()
        };
    }
    
    // Auto-fill login form for demo
    document.getElementById('email').value = demoUser.email;
    document.getElementById('password').value = 'demopassword123';
    
    showNotification(`Demo ${type} account loaded. Click Sign In to continue.`, 'info');
    
    // Validate fields
    validateLoginField(document.getElementById('email'));
    validateLoginField(document.getElementById('password'));
}

// Enhanced notification system for login
function showEnhancedNotification(message, type = 'info', duration = 5000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
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
    
    // Add enhanced notification styles if not already added
    if (!document.querySelector('#enhanced-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'enhanced-notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                border-left: 4px solid var(--primary-color);
                z-index: 3000;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
            }
            
            .notification-success {
                border-left-color: var(--success-color);
            }
            
            .notification-error {
                border-left-color: var(--danger-color);
            }
            
            .notification-warning {
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
            
            .notification-success .notification-content i:first-child {
                color: var(--success-color);
            }
            
            .notification-error .notification-content i:first-child {
                color: var(--danger-color);
            }
            
            .notification-warning .notification-content i:first-child {
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
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
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

// Override the existing showNotification function for login page
function showNotification(message, type = 'info') {
    showEnhancedNotification(message, type, 5000);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const demoModal = document.getElementById('demoModal');
    if (demoModal && e.target === demoModal) {
        closeDemoModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + / for demo modal
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        showDemoModal();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeDemoModal();
    }
});