// Authentication Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Password toggle functionality
    initializePasswordToggles();
    
    // Password strength indicator
    initializePasswordStrength();
    
    // Form submission
    initializeFormSubmission();
    
    // Real-time validation
    initializeRealTimeValidation();
}

function initializePasswordToggles() {
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility(passwordInput, this);
        });
    }

    if (confirmPasswordToggle && confirmPasswordInput) {
        confirmPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(confirmPasswordInput, this);
        });
    }
}

function togglePasswordVisibility(input, button) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    const icon = button.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    if (password.length === 0) return { level: 'empty', score: 0 };
    if (strength <= 2) return { level: 'weak', score: strength };
    if (strength <= 4) return { level: 'medium', score: strength };
    return { level: 'strong', score: strength };
}

function updatePasswordStrengthUI(strength) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const passwordStrength = document.querySelector('.password-strength');
    
    if (!strengthFill || !strengthText) return;
    
    if (strength.level === 'empty') {
        passwordStrength.classList.remove('show');
        return;
    }
    
    passwordStrength.classList.add('show');
    strengthFill.className = 'strength-fill ' + strength.level;
    strengthText.textContent = strength.level.charAt(0).toUpperCase() + strength.level.slice(1);
    strengthText.className = 'strength-text ' + strength.level;
}

function initializeFormSubmission() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegistration();
    });
}

function initializeRealTimeValidation() {
    const inputs = document.querySelectorAll('#registerForm input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';

    switch(fieldName) {
        case 'fullName':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Name can only contain letters and spaces';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'password':
            if (value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters long';
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (value !== password) {
                isValid = false;
                errorMessage = 'Passwords do not match';
            }
            break;
            
        case 'careerInterest':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select your career interest';
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
        showFieldSuccess(field);
    }

    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
    const errorId = field.getAttribute('name') + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function showFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    
    const errorId = field.getAttribute('name') + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearFieldError(field) {
    field.classList.remove('error', 'success');
    
    const errorId = field.getAttribute('name') + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

async function handleRegistration() {
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('registerForm');
    
    // Validate all fields
    const fields = form.querySelectorAll('input[required], select[required]');
    let allValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            allValid = false;
        }
    });
    
    // Check terms agreement
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showFieldError(termsCheckbox, 'You must agree to the terms and conditions');
        allValid = false;
    }
    
    if (!allValid) {
        showNotification('Please fix the errors before submitting', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            careerInterest: document.getElementById('careerInterest').value
        };
        
        // Register user
        const user = UserManager.registerUser(formData);
        
        // Show success modal
        showSuccessModal();
        
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        submitBtn.classList.remove('loading');
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

function redirectToRoadmaps() {
    window.location.href = 'roadmap.html';
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
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
            
            .notification-error {
                border-left-color: var(--danger-color);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification-content i {
                color: var(--primary-color);
            }
            
            .notification-error .notification-content i {
                color: var(--danger-color);
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
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (modal && e.target === modal) {
        modal.classList.remove('show');
    }
});