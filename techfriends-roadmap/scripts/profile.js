// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
});

function initializeProfilePage() {
    // Check authentication
    checkAuthentication();
    
    // Initialize navigation
    initializeProfileNavigation();
    
    // Initialize form handling
    initializeProfileForms();
    
    // Initialize tab system
    initializeTabSystem();
    
    // Load profile data
    loadProfileData();
    
    // Initialize interactive elements
    initializeInteractiveElements();
}

function checkAuthentication() {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Please login to access profile', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Load user data
    loadUserData(currentUser);
}

function loadUserData(user) {
    // Update user info throughout the profile
    updateUserInfo(user);
}

function updateUserInfo(user) {
    // Update profile elements with user data
    const profileName = document.getElementById('profileName');
    const profileTitle = document.getElementById('profileTitle');
    const profileBio = document.getElementById('profileBio');
    
    if (profileName) profileName.textContent = user.name || 'Demo User';
    if (profileTitle) profileTitle.textContent = user.title || 'Web Development Student';
    if (profileBio) profileBio.textContent = user.bio || 'Passionate about learning web technologies and building amazing projects.';
    
    // Update form fields
    updateFormFields(user);
}

function updateFormFields(user) {
    // This would populate form fields with user data from database
    // For demo, we're using default values
}

function initializeProfileNavigation() {
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
    const navItems = document.querySelectorAll('.profile-nav .nav-item');
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
            localStorage.setItem('activeProfileTab', targetTab);
        });
    });
    
    // Restore active tab from localStorage
    const savedTab = localStorage.getItem('activeProfileTab') || 'personal-info';
    const savedNavItem = document.querySelector(`[data-tab="${savedTab}"]`);
    const savedTabContent = document.getElementById(savedTab);
    
    if (savedNavItem && savedTabContent) {
        navItems.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        savedNavItem.classList.add('active');
        savedTabContent.classList.add('active');
    }
}

function initializeProfileForms() {
    // Personal info form
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', handlePersonalInfoSubmit);
    }
    
    // Bio character count
    const bioTextarea = document.getElementById('bio');
    const bioCharCount = document.getElementById('bioCharCount');
    
    if (bioTextarea && bioCharCount) {
        bioTextarea.addEventListener('input', function() {
            const remaining = 500 - this.value.length;
            bioCharCount.textContent = remaining;
            bioCharCount.style.color = remaining < 50 ? '#ef4444' : '#64748b';
        });
    }
    
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
}

function handlePersonalInfoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    // Simulate API call
    setTimeout(() => {
        // Update profile summary
        updateProfileSummary(data);
        
        // Show success message
        showNotification('Profile updated successfully!', 'success');
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }, 1500);
}

function updateProfileSummary(data) {
    const profileName = document.getElementById('profileName');
    const profileTitle = document.getElementById('profileTitle');
    const profileBio = document.getElementById('profileBio');
    
    if (profileName) {
        profileName.textContent = `${data.firstName} ${data.lastName}`;
    }
    
    if (profileTitle && data.jobTitle) {
        profileTitle.textContent = data.jobTitle;
    }
    
    if (profileBio && data.bio) {
        profileBio.textContent = data.bio;
    }
    
    // Update user in navigation
    const userNames = document.querySelectorAll('.user-name, .user-details strong');
    userNames.forEach(element => {
        element.textContent = `${data.firstName} ${data.lastName}`;
    });
}

function resetForm() {
    if (confirm('Are you sure you want to reset all changes?')) {
        document.getElementById('personalInfoForm').reset();
        showNotification('Form reset to original values', 'info');
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

function initializeInteractiveElements() {
    // Continue learning buttons
    const continueButtons = document.querySelectorAll('.btn-primary.btn-sm');
    continueButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseItem = this.closest('.course-progress-item');
            const courseName = courseItem.querySelector('h4').textContent;
            showNotification(`Continuing with ${courseName}...`, 'success');
        });
    });
    
    // Initialize progress animations
    initializeProgressAnimations();
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
    }, { threshold: 0.3 });
    
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
    
    // Animate circular progress
    const progressCircle = document.querySelector('.circle-progress');
    if (progressCircle) {
        observer.observe(progressCircle);
    }
}

function animateProgressBar(progressBar) {
    const fill = progressBar.querySelector('.progress-fill');
    if (!fill) return;
    
    const currentWidth = fill.style.width;
    fill.style.width = '0%';
    
    setTimeout(() => {
        fill.style.transition = 'width 1s ease-in-out';
        fill.style.width = currentWidth;
    }, 100);
}

function loadProfileData() {
    // This would load user data from an API
    // For demo, we're using static data
    
    // Simulate loading
    setTimeout(() => {
        // Animate progress bars
        animateProgressBars();
    }, 500);
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
    
    // Animate circular progress
    const progressCircle = document.querySelector('.circle-progress');
    if (progressCircle) {
        progressCircle.style.transition = 'transform 2s ease-in-out';
        setTimeout(() => {
            progressCircle.style.transform = 'rotate(234deg)'; // 65% of 360
        }, 100);
    }
}

// Avatar Editor Functions
function openAvatarEditor() {
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeAvatarEditor() {
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function uploadAvatar() {
    // This would handle actual file upload
    // For demo, we'll simulate it
    showNotification('Avatar upload functionality would be implemented here', 'info');
}

function generateAvatar() {
    // Generate random avatar
    const randomId = Math.random().toString(36).substr(2, 9);
    const newAvatarUrl = `https://ui-avatars.com/api/?name=User${randomId}&background=6366f1&color=fff`;
    
    const avatarPreview = document.getElementById('avatarPreview');
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (avatarPreview) avatarPreview.src = newAvatarUrl;
    if (profileAvatar) profileAvatar.src = newAvatarUrl;
    
    showNotification('New avatar generated!', 'success');
}

// Password Modal Functions
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
    }
}

function handleLogout() {
    UserManager.logoutUser();
    showNotification('Logged out successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Enhanced notification system for profile
function showProfileNotification(message, type = 'info', duration = 4000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.profile-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `profile-notification notification-${type}`;
    
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
    
    // Add profile notification styles if not already added
    if (!document.querySelector('#profile-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'profile-notification-styles';
        styles.textContent = `
            .profile-notification {
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
            
            .profile-notification.notification-success {
                border-left-color: var(--success-color);
            }
            
            .profile-notification.notification-error {
                border-left-color: var(--danger-color);
            }
            
            .profile-notification.notification-warning {
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
            
            .profile-notification.notification-success .notification-content i:first-child {
                color: var(--success-color);
            }
            
            .profile-notification.notification-error .notification-content i:first-child {
                color: var(--danger-color);
            }
            
            .profile-notification.notification-warning .notification-content i:first-child {
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

// Override the showNotification function for profile page
function showNotification(message, type = 'info') {
    showProfileNotification(message, type, 4000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const avatarModal = document.getElementById('avatarModal');
    const passwordModal = document.getElementById('passwordModal');
    
    if (avatarModal && e.target === avatarModal) {
        closeAvatarEditor();
    }
    
    if (passwordModal && e.target === passwordModal) {
        closePasswordModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeAvatarEditor();
        closePasswordModal();
        
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.classList.remove('show');
        }
    }
});

// Initialize profile when page loads
window.addEventListener('load', function() {
    // Add loading animation
    const mainContent = document.querySelector('.profile-main');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 300);
    }
});