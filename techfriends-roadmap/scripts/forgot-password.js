// Forgot Password JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeForgotPassword();
});

function initializeForgotPassword() {
    // Initialize step system
    initializeStepSystem();
    
    // Initialize form handling
    initializeForms();
    
    // Initialize code input
    initializeCodeInput();
    
    // Initialize password strength
    initializePasswordStrength();
    
    // Initialize timers
    initializeTimers();
}

let currentStep = 1;
let userEmail = '';
let verificationCode = '';
let countdownTimer;
let resendTimer;

function initializeStepSystem() {
    // Set initial step
    showStep(1);
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.reset-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        currentStep = stepNumber;
    }
}

function goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= 4) {
        showStep(stepNumber);
    }
}

function nextStep() {
    if (currentStep < 4) {
        showStep(currentStep + 1);
    }
}

function initializeForms() {
    // Email form
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }
    
    // Code form
    const codeForm = document.getElementById('codeForm');
    if (codeForm) {
        codeForm.addEventListener('submit', handleCodeSubmit);
    }
    
    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordSubmit);
    }
    
    // Resend code button
    const resendCodeBtn = document.getElementById('resendCode');
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', handleResendCode);
    }
}

function handleEmailSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('emailError');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    
    // Validate email
    if (!isValidEmail(email)) {
        showFieldError(emailError, 'Please enter a valid email address');
        return;
    }
    
    // Show loading state
    sendCodeBtn.classList.add('loading');
    
    // Simulate API call to send verification code
    setTimeout(() => {
        // Check if email exists in our system (demo logic)
        const users = StorageManager.getItem('techfriends_users') || [];
        const userExists = users.some(user => user.email === email);
        
        if (!userExists) {
            showFieldError(emailError, 'No account found with this email address');
            sendCodeBtn.classList.remove('loading');
            return;
        }
        
        // Store email and generate verification code
        userEmail = email;
        verificationCode = generateVerificationCode();
        
        // In a real app, this would send an actual email
        console.log(`Verification code for ${email}: ${verificationCode}`);
        
        // Update UI for next step
        document.getElementById('userEmail').textContent = email;
        
        // Show success and move to next step
        showNotification('Verification code sent to your email!', 'success');
        sendCodeBtn.classList.remove('loading');
        nextStep();
        
        // Start timers
        startCodeTimer();
        startResendTimer();
        
    }, 2000);
}

function handleCodeSubmit(e) {
    e.preventDefault();
    
    const enteredCode = getEnteredCode();
    const codeError = document.getElementById('codeError');
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    
    // Validate code
    if (enteredCode.length !== 6) {
        showFieldError(codeError, 'Please enter the complete 6-digit code');
        return;
    }
    
    if (enteredCode !== verificationCode) {
        showFieldError(codeError, 'Invalid verification code. Please try again.');
        addShakeAnimation('.code-inputs');
        return;
    }
    
    // Show loading state
    verifyCodeBtn.classList.add('loading');
    
    // Simulate code verification
    setTimeout(() => {
        showNotification('Code verified successfully!', 'success');
        verifyCodeBtn.classList.remove('loading');
        
        // In a real app, you might do additional security checks here
        // For demo, we'll proceed to password reset
        nextStep();
        
        // Clear timers
        clearTimers();
        
    }, 1500);
}

function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    
    // Validate passwords
    if (!isPasswordStrong(newPassword)) {
        showFieldError(newPasswordError, 'Password does not meet requirements');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showFieldError(confirmPasswordError, 'Passwords do not match');
        return;
    }
    
    // Show loading state
    resetPasswordBtn.classList.add('loading');
    
    // Simulate password reset
    setTimeout(() => {
        // Update password in storage (demo)
        const users = StorageManager.getItem('techfriends_users') || [];
        const userIndex = users.findIndex(user => user.email === userEmail);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword; // In real app, this would be hashed
            StorageManager.setItem('techfriends_users', users);
        }
        
        showNotification('Password reset successfully!', 'success');
        resetPasswordBtn.classList.remove('loading');
        
        // Move to success step
        nextStep();
        
    }, 2000);
}

function handleResendCode() {
    const resendCodeBtn = document.getElementById('resendCode');
    
    if (resendCodeBtn.disabled) return;
    
    // Generate new code
    verificationCode = generateVerificationCode();
    
    // In a real app, this would send a new email
    console.log(`New verification code for ${userEmail}: ${verificationCode}`);
    
    // Show loading state
    resendCodeBtn.disabled = true;
    resendCodeBtn.innerHTML = 'Sending...';
    
    setTimeout(() => {
        showNotification('New verification code sent!', 'success');
        
        // Restart timers
        startCodeTimer();
        startResendTimer();
        
        // Clear code inputs
        clearCodeInputs();
        
    }, 1000);
}

function initializeCodeInput() {
    const codeInputs = document.querySelectorAll('.code-input');
    
    codeInputs.forEach((input, index) => {
        // Handle input
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            if (value.length === 1) {
                // Move to next input
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                
                // Update input style
                this.classList.add('filled');
                this.classList.remove('error');
                
                // Check if all inputs are filled
                checkCodeCompletion();
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
        
        // Handle paste
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
                fillCodeInputs(pastedData);
            }
        });
    });
}

function fillCodeInputs(code) {
    const codeInputs = document.querySelectorAll('.code-input');
    
    codeInputs.forEach((input, index) => {
        if (index < code.length) {
            input.value = code[index];
            input.classList.add('filled');
            input.classList.remove('error');
        }
    });
    
    // Focus last input
    if (codeInputs[5]) {
        codeInputs[5].focus();
    }
    
    checkCodeCompletion();
}

function clearCodeInputs() {
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error');
    });
    
    // Focus first input
    if (codeInputs[0]) {
        codeInputs[0].focus();
    }
    
    // Disable verify button
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    if (verifyCodeBtn) {
        verifyCodeBtn.disabled = true;
    }
}

function getEnteredCode() {
    const codeInputs = document.querySelectorAll('.code-input');
    let code = '';
    codeInputs.forEach(input => {
        code += input.value;
    });
    return code;
}

function checkCodeCompletion() {
    const code = getEnteredCode();
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    
    if (verifyCodeBtn) {
        verifyCodeBtn.disabled = code.length !== 6;
    }
}

function initializePasswordStrength() {
    const passwordInput = document.getElementById('newPassword');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        checkPasswordStrength(password);
        validatePasswordRequirements(password);
    });
    
    // Password toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    });
}

function checkPasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    strengthFill.className = 'strength-fill ' + strength.level;
    strengthFill.style.width = strength.score * 20 + '%';
    strengthText.textContent = strength.level.charAt(0).toUpperCase() + strength.level.slice(1);
    strengthText.className = 'strength-text ' + strength.level;
}

function validatePasswordRequirements(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    Object.keys(requirements).forEach(req => {
        const element = document.querySelector(`[data-requirement="${req}"]`);
        if (element) {
            if (requirements[req]) {
                element.classList.add('valid');
                element.classList.remove('invalid');
            } else {
                element.classList.remove('valid');
                element.classList.add('invalid');
            }
        }
    });
}

function isPasswordStrong(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    return Object.values(requirements).every(req => req);
}

function initializeTimers() {
    // Timers will be started when needed
}

function startCodeTimer() {
    let timeLeft = 300; // 5 minutes
    
    clearInterval(countdownTimer);
    
    countdownTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            showNotification('Verification code has expired', 'warning');
            // Optionally go back to email step
        }
        
        timeLeft--;
    }, 1000);
}

function startResendTimer() {
    let timeLeft = 60; // 1 minute
    const resendCodeBtn = document.getElementById('resendCode');
    const resendTimerElement = document.getElementById('resendTimer');
    
    if (!resendCodeBtn || !resendTimerElement) return;
    
    resendCodeBtn.disabled = true;
    
    clearInterval(resendTimer);
    
    resendTimer = setInterval(() => {
        resendTimerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(resendTimer);
            resendCodeBtn.disabled = false;
            resendCodeBtn.innerHTML = 'Resend code';
        }
        
        timeLeft--;
    }, 1000);
}

function clearTimers() {
    clearInterval(countdownTimer);
    clearInterval(resendTimer);
}

// Utility Functions
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

function showFieldError(element, message) {
    if (!element) return;
    
    element.textContent = message;
    element.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

function addShakeAnimation(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.add('error-shake');
        setTimeout(() => {
            element.classList.remove('error-shake');
        }, 500);
    }
}

// Security Modal Functions
function openSecurityModal() {
    const modal = document.getElementById('securityModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeSecurityModal() {
    const modal = document.getElementById('securityModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function verifySecurityAnswer() {
    const answer = document.getElementById('securityAnswer').value.trim();
    const securityError = document.getElementById('securityError');
    
    if (!answer) {
        showFieldError(securityError, 'Please enter your answer');
        return;
    }
    
    // In a real app, this would verify against stored security answer
    // For demo, we'll accept any non-empty answer
    showNotification('Security question verified!', 'success');
    closeSecurityModal();
    nextStep();
}

// Enhanced notification system for forgot password
function showForgotPasswordNotification(message, type = 'info', duration = 4000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.forgot-password-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `forgot-password-notification notification-${type}`;
    
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
    
    // Add forgot password notification styles if not already added
    if (!document.querySelector('#forgot-password-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'forgot-password-notification-styles';
        styles.textContent = `
            .forgot-password-notification {
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
            
            .forgot-password-notification.notification-success {
                border-left-color: var(--success-color);
            }
            
            .forgot-password-notification.notification-error {
                border-left-color: var(--danger-color);
            }
            
            .forgot-password-notification.notification-warning {
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
            
            .forgot-password-notification.notification-success .notification-content i:first-child {
                color: var(--success-color);
            }
            
            .forgot-password-notification.notification-error .notification-content i:first-child {
                color: var(--danger-color);
            }
            
            .forgot-password-notification.notification-warning .notification-content i:first-child {
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

// Override the showNotification function for forgot password page
function showNotification(message, type = 'info') {
    showForgotPasswordNotification(message, type, 4000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const securityModal = document.getElementById('securityModal');
    if (securityModal && e.target === securityModal) {
        closeSecurityModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeSecurityModal();
    }
    
    // Enter to submit forms based on current step
    if (e.key === 'Enter') {
        const activeStep = document.querySelector('.reset-step.active');
        if (activeStep) {
            const form = activeStep.querySelector('form');
            if (form) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }
        }
    }
});

// Initialize when page loads
window.addEventListener('load', function() {
    // Add loading animation
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        authCard.style.opacity = '0';
        authCard.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            authCard.style.opacity = '1';
        }, 300);
    }
    
    // Focus email input on load
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.focus();
    }
});

// Clean up timers when leaving page
window.addEventListener('beforeunload', function() {
    clearTimers();
});