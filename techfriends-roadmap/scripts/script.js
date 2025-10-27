// Global JavaScript for enhanced functionality

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
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

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .floating-card').forEach(el => {
        observer.observe(el);
    });

    // Form validation enhancement
    enhanceForms();
});

// Enhanced form validation
function enhanceForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            // Add real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateField(field) {
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
            if (value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters long';
            }
            break;
            
        case 'confirmPassword':
            const password = document.querySelector('input[name="password"]');
            if (password && value !== password.value) {
                isValid = false;
                errorMessage = 'Passwords do not match';
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
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    field.classList.add('success');
}

function clearFieldError(field) {
    field.classList.remove('error', 'success');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Local Storage Management
class StorageManager {
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    static getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    static removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
}

// User Management
class UserManager {
    static registerUser(userData) {
        const users = StorageManager.getItem('techfriends_users') || [];
        
        // Check if user already exists
        if (users.find(user => user.email === userData.email)) {
            throw new Error('User with this email already exists');
        }
        
        users.push({
            ...userData,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            progress: {}
        });
        
        if (StorageManager.setItem('techfriends_users', users)) {
            return this.loginUser(userData.email, userData.password);
        }
        
        throw new Error('Failed to register user');
    }

    static loginUser(email, password) {
        const users = StorageManager.getItem('techfriends_users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const session = {
                userId: user.id,
                email: user.email,
                name: user.name,
                loggedInAt: new Date().toISOString()
            };
            
            StorageManager.setItem('techfriends_session', session);
            return session;
        }
        
        throw new Error('Invalid email or password');
    }

    static getCurrentUser() {
        return StorageManager.getItem('techfriends_session');
    }

    static logoutUser() {
        StorageManager.removeItem('techfriends_session');
        return true;
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserManager, StorageManager };
}

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    
    // Insert mobile menu button
    if (navContainer && !document.querySelector('.mobile-menu-btn')) {
        navContainer.appendChild(mobileMenuBtn);
    }
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Community sidebar mobile toggle
    const communitySidebar = document.querySelector('.community-sidebar');
    if (communitySidebar) {
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'btn btn-primary d-md-none';
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i> Menu';
        sidebarToggle.style.marginBottom = '1rem';
        
        const communityHeader = document.querySelector('.community-header');
        if (communityHeader) {
            communityHeader.parentNode.insertBefore(sidebarToggle, communityHeader);
        }
        
        sidebarToggle.addEventListener('click', function() {
            communitySidebar.classList.toggle('open');
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navMenu) navMenu.classList.remove('active');
            if (communitySidebar) communitySidebar.classList.remove('open');
            if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Touch device optimizations
document.addEventListener('touchstart', function() {}, {passive: true});

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);