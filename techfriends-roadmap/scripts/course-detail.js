// Course Detail JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeCourseDetail();
});

function initializeCourseDetail() {
    // Check authentication
    checkAuthentication();
    
    // Initialize navigation
    initializeCourseNavigation();
    
    // Initialize course interactions
    initializeCourseInteractions();
    
    // Initialize enrollment system
    initializeEnrollmentSystem();
    
    // Initialize reviews and ratings
    initializeReviews();
    
    // Initialize FAQ system
    initializeFAQ();
    
    // Load course data
    loadCourseData();
}

function checkAuthentication() {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        // User is not logged in, but they can still view course details
        // Some features will be disabled until they login
        updateUIForGuest();
    } else {
        updateUIForUser(currentUser);
    }
}

function updateUIForGuest() {
    // Update UI elements for non-logged in users
    const enrollButtons = document.querySelectorAll('#enrollBtn, #sidebarEnrollBtn');
    enrollButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Enroll';
        btn.onclick = redirectToLogin;
    });
    
    // Disable some interactive features
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.disabled = true;
        wishlistBtn.title = 'Please login to add to wishlist';
    }
}

function updateUIForUser(user) {
    // Update UI for logged in users
    // Check if user is already enrolled
    const userProgress = getUserCourseProgress();
    if (userProgress && userProgress.enrolled) {
        updateUIForEnrolledUser(userProgress);
    }
}

function getUserCourseProgress() {
    // This would typically come from an API
    // For demo, we'll use localStorage
    const courseId = getCourseIdFromURL();
    const userProgress = StorageManager.getItem(`course_progress_${courseId}`);
    
    if (userProgress) {
        return userProgress;
    }
    
    // Return default progress for demo
    return {
        enrolled: false,
        progress: 0,
        completedLessons: [],
        currentLesson: null
    };
}

function getCourseIdFromURL() {
    // Extract course ID from URL
    // For demo, we'll use a fixed ID
    return 'frontend-development';
}

function initializeCourseNavigation() {
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

function initializeCourseInteractions() {
    // Tab system
    initializeTabSystem();
    
    // Lesson interactions
    initializeLessonInteractions();
    
    // Share functionality
    initializeShareFunctionality();
    
    // Wishlist functionality
    initializeWishlist();
    
    // Sticky sidebar
    initializeStickySidebar();
}

function initializeTabSystem() {
    // This would handle switching between overview, curriculum, reviews tabs
    // For now, we'll keep it simple with the overview tab active
}

function initializeLessonInteractions() {
    const lessons = document.querySelectorAll('.lesson:not(.upcoming)');
    
    lessons.forEach(lesson => {
        lesson.addEventListener('click', function() {
            if (this.classList.contains('current') || this.classList.contains('completed')) {
                const lessonTitle = this.querySelector('h4').textContent;
                startLesson(lessonTitle);
            }
        });
    });
    
    // Continue buttons
    const continueButtons = document.querySelectorAll('.lesson-actions .btn-primary');
    continueButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const lesson = this.closest('.lesson');
            const lessonTitle = lesson.querySelector('h4').textContent;
            startLesson(lessonTitle);
        });
    });
}

function startLesson(lessonTitle) {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Please login to access lessons', 'warning');
        redirectToLogin();
        return;
    }
    
    showNotification(`Starting lesson: ${lessonTitle}`, 'success');
    
    // In a real app, this would redirect to the lesson player
    // For demo, we'll simulate loading
    setTimeout(() => {
        // Update progress
        updateLessonProgress(lessonTitle);
    }, 1000);
}

function updateLessonProgress(lessonTitle) {
    const courseId = getCourseIdFromURL();
    let userProgress = getUserCourseProgress();
    
    if (!userProgress.enrolled) {
        showNotification('Please enroll in the course to track progress', 'warning');
        return;
    }
    
    // Mark lesson as completed
    if (!userProgress.completedLessons.includes(lessonTitle)) {
        userProgress.completedLessons.push(lessonTitle);
    }
    
    // Update current lesson
    userProgress.currentLesson = lessonTitle;
    
    // Calculate overall progress
    const totalLessons = document.querySelectorAll('.lesson').length;
    userProgress.progress = (userProgress.completedLessons.length / totalLessons) * 100;
    
    // Save progress
    StorageManager.setItem(`course_progress_${courseId}`, userProgress);
    
    // Update UI
    updateProgressUI(userProgress);
    
    showNotification('Progress updated!', 'success');
}

function updateProgressUI(progress) {
    // Update progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        // This would update individual module progress
        // For demo, we'll just update the main progress
    });
    
    // Update lesson states
    updateLessonStates(progress.completedLessons);
}

function updateLessonStates(completedLessons) {
    const lessons = document.querySelectorAll('.lesson');
    lessons.forEach(lesson => {
        const lessonTitle = lesson.querySelector('h4').textContent;
        
        if (completedLessons.includes(lessonTitle)) {
            lesson.classList.add('completed');
            lesson.classList.remove('current', 'upcoming');
            
            const actions = lesson.querySelector('.lesson-actions');
            if (actions) {
                actions.innerHTML = '<i class="fas fa-check"></i>';
            }
        }
    });
}

function initializeShareFunctionality() {
    const shareBtn = document.getElementById('shareBtn');
    const shareButtons = document.querySelectorAll('.share-btn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            shareCourse();
        });
    }
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList[1]; // facebook, twitter, etc.
            shareOnPlatform(platform);
        });
    });
}

function shareCourse() {
    const courseTitle = document.querySelector('h1').textContent;
    const courseUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: courseTitle,
            text: `Check out this course: ${courseTitle}`,
            url: courseUrl
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(courseUrl).then(() => {
            showNotification('Course link copied to clipboard!', 'success');
        });
    }
}

function shareOnPlatform(platform) {
    const courseTitle = document.querySelector('h1').textContent;
    const courseUrl = window.location.href;
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(courseTitle)}&url=${encodeURIComponent(courseUrl)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(courseUrl)}`;
            break;
        case 'link':
            navigator.clipboard.writeText(courseUrl).then(() => {
                showNotification('Course link copied to clipboard!', 'success');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function initializeWishlist() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    
    if (wishlistBtn) {
        // Check if course is in wishlist
        const isInWishlist = checkWishlistStatus();
        updateWishlistButton(wishlistBtn, isInWishlist);
        
        wishlistBtn.addEventListener('click', function() {
            toggleWishlist(wishlistBtn);
        });
    }
}

function checkWishlistStatus() {
    const courseId = getCourseIdFromURL();
    const wishlist = StorageManager.getItem('user_wishlist') || [];
    return wishlist.includes(courseId);
}

function updateWishlistButton(button, isInWishlist) {
    if (isInWishlist) {
        button.innerHTML = '<i class="fas fa-heart"></i> Remove from Wishlist';
        button.classList.add('active');
    } else {
        button.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        button.classList.remove('active');
    }
}

function toggleWishlist(button) {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Please login to manage wishlist', 'warning');
        redirectToLogin();
        return;
    }
    
    const courseId = getCourseIdFromURL();
    let wishlist = StorageManager.getItem('user_wishlist') || [];
    const isInWishlist = wishlist.includes(courseId);
    
    if (isInWishlist) {
        // Remove from wishlist
        wishlist = wishlist.filter(id => id !== courseId);
        StorageManager.setItem('user_wishlist', wishlist);
        updateWishlistButton(button, false);
        showNotification('Removed from wishlist', 'success');
    } else {
        // Add to wishlist
        wishlist.push(courseId);
        StorageManager.setItem('user_wishlist', wishlist);
        updateWishlistButton(button, true);
        showNotification('Added to wishlist!', 'success');
    }
}

function initializeStickySidebar() {
    const sidebar = document.querySelector('.course-sidebar');
    const main = document.querySelector('.course-main');
    
    if (!sidebar || !main) return;
    
    const sidebarTop = sidebar.offsetTop;
    const mainBottom = main.offsetTop + main.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.innerWidth > 1200) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop >= sidebarTop && scrollTop <= mainBottom - sidebar.offsetHeight) {
                sidebar.classList.add('sticky');
            } else {
                sidebar.classList.remove('sticky');
            }
        }
    });
}

function initializeEnrollmentSystem() {
    const enrollButtons = document.querySelectorAll('#enrollBtn, #sidebarEnrollBtn');
    
    enrollButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleEnrollment();
        });
    });
}

function handleEnrollment() {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        redirectToLogin();
        return;
    }
    
    // Check if already enrolled
    const userProgress = getUserCourseProgress();
    if (userProgress.enrolled) {
        showNotification('You are already enrolled in this course!', 'info');
        // Redirect to course player
        redirectToCoursePlayer();
        return;
    }
    
    // Show enrollment modal
    openEnrollmentModal();
}

function openEnrollmentModal() {
    const modal = document.getElementById('enrollmentModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeEnrollmentModal() {
    const modal = document.getElementById('enrollmentModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function processEnrollment() {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Please login to enroll', 'warning');
        return;
    }
    
    const enrollBtn = document.querySelector('#enrollmentModal .btn-primary');
    const originalText = enrollBtn.innerHTML;
    
    // Show loading state
    enrollBtn.classList.add('loading');
    enrollBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Enroll user
        enrollUserInCourse();
        
        // Update UI
        updateUIForEnrolledUser({
            enrolled: true,
            progress: 0,
            completedLessons: [],
            currentLesson: null
        });
        
        // Close modal and show success
        closeEnrollmentModal();
        showNotification('Successfully enrolled in the course!', 'success');
        
        // Reset button
        enrollBtn.classList.remove('loading');
        enrollBtn.disabled = false;
        enrollBtn.innerHTML = originalText;
        
        // Redirect to course player after a delay
        setTimeout(() => {
            redirectToCoursePlayer();
        }, 2000);
        
    }, 3000);
}

function enrollUserInCourse() {
    const courseId = getCourseIdFromURL();
    const userProgress = {
        enrolled: true,
        progress: 0,
        completedLessons: [],
        currentLesson: null,
        enrolledAt: new Date().toISOString()
    };
    
    StorageManager.setItem(`course_progress_${courseId}`, userProgress);
    
    // Add to user's courses
    const userCourses = StorageManager.getItem('user_courses') || [];
    if (!userCourses.includes(courseId)) {
        userCourses.push(courseId);
        StorageManager.setItem('user_courses', userCourses);
    }
}

function updateUIForEnrolledUser(progress) {
    // Update enroll buttons
    const enrollButtons = document.querySelectorAll('#enrollBtn, #sidebarEnrollBtn');
    enrollButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-play-circle"></i> Continue Learning';
        btn.onclick = redirectToCoursePlayer;
    });
    
    // Enable all lessons
    const upcomingLessons = document.querySelectorAll('.lesson.upcoming');
    upcomingLessons.forEach(lesson => {
        lesson.classList.remove('upcoming');
        lesson.classList.add('current');
    });
}

function redirectToCoursePlayer() {
    // In a real app, this would redirect to the course player
    showNotification('Redirecting to course player...', 'info');
    // window.location.href = 'course-player.html';
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function initializeReviews() {
    // Helpful buttons
    const helpfulButtons = document.querySelectorAll('.review-helpful .btn-text');
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            const review = this.closest('.review');
            markReviewHelpful(review, this.textContent === 'Yes');
        });
    });
}

function markReviewHelpful(review, isHelpful) {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Please login to rate reviews', 'warning');
        return;
    }
    
    const reviewer = review.querySelector('h4').textContent;
    const action = isHelpful ? 'found helpful' : 'not found helpful';
    
    showNotification(`Marked review by ${reviewer} as ${action}`, 'success');
    
    // Update UI
    const helpfulSection = review.querySelector('.review-helpful');
    helpfulSection.innerHTML = '<span>Thank you for your feedback!</span>';
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

function loadCourseData() {
    // This would load course data from an API
    // For demo, we're using static data
    
    // Simulate loading
    setTimeout(() => {
        // Any initialization after data load
        initializeProgressAnimations();
    }, 500);
}

function initializeProgressAnimations() {
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-in-out';
            bar.style.width = width;
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

// Enhanced notification system for course detail
function showCourseNotification(message, type = 'info', duration = 4000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.course-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `course-notification notification-${type}`;
    
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
    
    // Add course notification styles if not already added
    if (!document.querySelector('#course-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'course-notification-styles';
        styles.textContent = `
            .course-notification {
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
            
            .course-notification.notification-success {
                border-left-color: var(--success-color);
            }
            
            .course-notification.notification-error {
                border-left-color: var(--danger-color);
            }
            
            .course-notification.notification-warning {
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
            
            .course-notification.notification-success .notification-content i:first-child {
                color: var(--success-color);
            }
            
            .course-notification.notification-error .notification-content i:first-child {
                color: var(--danger-color);
            }
            
            .course-notification.notification-warning .notification-content i:first-child {
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

// Override the showNotification function for course detail page
function showNotification(message, type = 'info') {
    showCourseNotification(message, type, 4000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const enrollmentModal = document.getElementById('enrollmentModal');
    if (enrollmentModal && e.target === enrollmentModal) {
        closeEnrollmentModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeEnrollmentModal();
    }
    
    // Spacebar to play/pause video (if implemented)
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        // Video play/pause logic would go here
    }
});

// Initialize course when page loads
window.addEventListener('load', function() {
    // Add loading animation
    const courseContent = document.querySelector('.course-content');
    if (courseContent) {
        courseContent.style.opacity = '0';
        courseContent.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            courseContent.style.opacity = '1';
        }, 300);
    }
});