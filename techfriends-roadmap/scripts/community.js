// Community JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunity();
});

function initializeCommunity() {
    // Check authentication
    checkAuthentication();
    
    // Initialize navigation
    initializeCommunityNavigation();
    
    // Initialize community interactions
    initializeCommunityInteractions();
    
    // Initialize discussion system
    initializeDiscussionSystem();
    
    // Load community data
    loadCommunityData();
}

function checkAuthentication() {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        // User is not logged in
        updateUIForGuest();
    } else {
        updateUIForUser(currentUser);
    }
}

function updateUIForGuest() {
    // Disable interactive features for guests
    const newDiscussionBtn = document.getElementById('newDiscussionBtn');
    if (newDiscussionBtn) {
        newDiscussionBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Post';
        newDiscussionBtn.onclick = redirectToLogin;
    }
    
    // Disable interaction buttons
    const actionButtons = document.querySelectorAll('.btn-text');
    actionButtons.forEach(btn => {
        btn.disabled = true;
        btn.title = 'Please login to interact';
    });
}

function updateUIForUser(user) {
    // Update user-specific UI elements
    // This could include showing user's posts, notifications, etc.
}

function initializeCommunityNavigation() {
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
    
    // Navigation items
    const navItems = document.querySelectorAll('.community-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('span').textContent;
            filterDiscussions(category);
        });
    });
}

function initializeCommunityInteractions() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.textContent.toLowerCase();
            applyDiscussionFilter(filter);
        });
    });
    
    // Sort options
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortDiscussions(this.value);
        });
    }
    
    // Like buttons
    initializeLikeButtons();
    
    // Save buttons
    initializeSaveButtons();
    
    // Reply buttons
    initializeReplyButtons();
}

function initializeDiscussionSystem() {
    // New discussion button
    const newDiscussionBtn = document.getElementById('newDiscussionBtn');
    if (newDiscussionBtn) {
        newDiscussionBtn.addEventListener('click', function() {
            openNewDiscussionModal();
        });
    }
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreDiscussions');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreDiscussions);
    }
    
    // Initialize discussion form
    initializeDiscussionForm();
}

function initializeLikeButtons() {
    const likeButtons = document.querySelectorAll('.btn-text:has(.fa-heart)');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const currentUser = UserManager.getCurrentUser();
            if (!currentUser) {
                showNotification('Please login to like discussions', 'warning');
                return;
            }
            
            const discussionCard = this.closest('.discussion-card');
            const likeCount = discussionCard.querySelector('.fa-heart').nextElementSibling;
            
            // Toggle like state
            const isLiked = this.classList.contains('liked');
            
            if (isLiked) {
                // Unlike
                this.classList.remove('liked');
                this.innerHTML = '<i class="far fa-heart"></i> Like';
                likeCount.textContent = (parseInt(likeCount.textContent) - 1) + ' likes';
            } else {
                // Like
                this.classList.add('liked');
                this.innerHTML = '<i class="fas fa-heart"></i> Liked';
                likeCount.textContent = (parseInt(likeCount.textContent) + 1) + ' likes';
            }
            
            // In a real app, this would call an API
            showNotification(isLiked ? 'Removed like' : 'Discussion liked!', 'success');
        });
    });
}

function initializeSaveButtons() {
    const saveButtons = document.querySelectorAll('.btn-text:has(.fa-bookmark)');
    
    saveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const currentUser = UserManager.getCurrentUser();
            if (!currentUser) {
                showNotification('Please login to save discussions', 'warning');
                return;
            }
            
            const discussionCard = this.closest('.discussion-card');
            const discussionTitle = discussionCard.querySelector('h3').textContent;
            
            // Toggle save state
            const isSaved = this.classList.contains('saved');
            
            if (isSaved) {
                // Unsave
                this.classList.remove('saved');
                this.innerHTML = '<i class="far fa-bookmark"></i> Save';
                showNotification('Removed from saved', 'info');
            } else {
                // Save
                this.classList.add('saved');
                this.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                showNotification('Discussion saved!', 'success');
            }
            
            // Update saved discussions in storage
            updateSavedDiscussions(discussionTitle, !isSaved);
        });
    });
}

function initializeReplyButtons() {
    const replyButtons = document.querySelectorAll('.btn-text:has(.fa-comment)');
    
    replyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const currentUser = UserManager.getCurrentUser();
            if (!currentUser) {
                showNotification('Please login to reply', 'warning');
                return;
            }
            
            const discussionCard = this.closest('.discussion-card');
            const discussionTitle = discussionCard.querySelector('h3').textContent;
            
            // In a real app, this would open a reply modal or redirect to discussion page
            showNotification(`Redirecting to discussion: ${discussionTitle}`, 'info');
            
            // Simulate navigation to discussion detail
            setTimeout(() => {
                // window.location.href = `discussion-detail.html?id=${discussionId}`;
            }, 1000);
        });
    });
}

function updateSavedDiscussions(discussionTitle, shouldSave) {
    const savedDiscussions = StorageManager.getItem('user_saved_discussions') || [];
    
    if (shouldSave) {
        if (!savedDiscussions.includes(discussionTitle)) {
            savedDiscussions.push(discussionTitle);
        }
    } else {
        const index = savedDiscussions.indexOf(discussionTitle);
        if (index > -1) {
            savedDiscussions.splice(index, 1);
        }
    }
    
    StorageManager.setItem('user_saved_discussions', savedDiscussions);
}

function filterDiscussions(category) {
    const discussions = document.querySelectorAll('.discussion-card');
    
    discussions.forEach(discussion => {
        if (category === 'All Discussions') {
            discussion.style.display = 'block';
        } else {
            const discussionCategory = discussion.querySelector('.category-badge span').textContent;
            if (discussionCategory === category) {
                discussion.style.display = 'block';
            } else {
                discussion.style.display = 'none';
            }
        }
    });
    
    showNotification(`Showing discussions in: ${category}`, 'info');
}

function applyDiscussionFilter(filter) {
    const discussions = document.querySelectorAll('.discussion-card');
    
    discussions.forEach(discussion => {
        switch (filter) {
            case 'all':
                discussion.style.display = 'block';
                break;
            case 'unanswered':
                const hasSolved = discussion.querySelector('.fa-check-circle.solved');
                discussion.style.display = hasSolved ? 'none' : 'block';
                break;
            case 'solved':
                const solved = discussion.querySelector('.fa-check-circle.solved');
                discussion.style.display = solved ? 'block' : 'none';
                break;
            case 'my posts':
                // This would filter to show only user's posts
                // For demo, we'll show all
                discussion.style.display = 'block';
                break;
        }
    });
}

function sortDiscussions(sortBy) {
    const discussionsContainer = document.querySelector('.discussions-list');
    const discussions = Array.from(document.querySelectorAll('.discussion-card'));
    
    discussions.sort((a, b) => {
        switch (sortBy) {
            case 'Newest First':
                return 0; // Already in order for demo
            case 'Most Popular':
                const aLikes = parseInt(a.querySelector('.fa-heart').nextElementSibling.textContent);
                const bLikes = parseInt(b.querySelector('.fa-heart').nextElementSibling.textContent);
                return bLikes - aLikes;
            case 'Most Replies':
                const aReplies = parseInt(a.querySelector('.fa-comment').nextElementSibling.textContent);
                const bReplies = parseInt(b.querySelector('.fa-comment').nextElementSibling.textContent);
                return bReplies - aReplies;
            case 'Recently Updated':
                // This would use actual timestamps
                return 0;
            default:
                return 0;
        }
    });
    
    // Reappend sorted discussions
    discussions.forEach(discussion => {
        discussionsContainer.appendChild(discussion);
    });
    
    showNotification(`Sorted by: ${sortBy}`, 'info');
}

function openNewDiscussionModal() {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        redirectToLogin();
        return;
    }
    
    const modal = document.getElementById('newDiscussionModal');
    if (modal) {
        modal.classList.add('show');
        
        // Focus on title input
        const titleInput = document.getElementById('discussionTitle');
        if (titleInput) {
            titleInput.focus();
        }
    }
}

function closeNewDiscussionModal() {
    const modal = document.getElementById('newDiscussionModal');
    if (modal) {
        modal.classList.remove('show');
        
        // Reset form
        const form = document.getElementById('newDiscussionForm');
        if (form) {
            form.reset();
            document.getElementById('tagsList').innerHTML = '';
        }
    }
}

function initializeDiscussionForm() {
    const form = document.getElementById('newDiscussionForm');
    if (!form) return;
    
    form.addEventListener('submit', handleNewDiscussionSubmit);
    
    // Tags input
    const tagsInput = document.getElementById('discussionTags');
    const tagsList = document.getElementById('tagsList');
    let tags = [];
    
    if (tagsInput) {
        tagsInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = this.value.trim();
                
                if (tag && tags.length < 5) {
                    if (!tags.includes(tag)) {
                        tags.push(tag);
                        renderTags();
                    }
                    this.value = '';
                }
            }
        });
    }
    
    function renderTags() {
        tagsList.innerHTML = '';
        tags.forEach((tag, index) => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag-input-tag';
            tagElement.innerHTML = `
                ${tag}
                <button type="button" class="tag-input-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            tagsList.appendChild(tagElement);
        });
        
        // Add remove event listeners
        document.querySelectorAll('.tag-input-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                tags.splice(index, 1);
                renderTags();
            });
        });
    }
    
    // Editor toolbar
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
    const contentTextarea = document.getElementById('discussionContent');
    
    toolbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            applyFormat(format, contentTextarea);
        });
    });
}

function applyFormat(format, textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';
    
    switch (format) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `_${selectedText}_`;
            break;
        case 'code':
            formattedText = `\`${selectedText}\``;
            break;
        case 'link':
            formattedText = `[${selectedText}](url)`;
            break;
    }
    
    textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
    // Set cursor position after formatted text
    textarea.selectionStart = start + formattedText.length;
    textarea.selectionEnd = start + formattedText.length;
    textarea.focus();
}

function handleNewDiscussionSubmit(e) {
    e.preventDefault();
    
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
        showNotification('Please login to post discussions', 'warning');
        return;
    }
    
    const formData = new FormData(e.target);
    const title = document.getElementById('discussionTitle').value;
    const category = document.getElementById('discussionCategory').value;
    const content = document.getElementById('discussionContent').value;
    const tags = Array.from(document.querySelectorAll('.tag-input-tag')).map(tag => 
        tag.textContent.trim()
    );
    
    // Validate form
    if (!title || !category || !content) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Create new discussion
        const newDiscussion = {
            id: Date.now().toString(),
            title: title,
            category: category,
            content: content,
            tags: tags,
            author: currentUser.name,
            authorAvatar: currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6366f1&color=fff`,
            timestamp: new Date().toISOString(),
            views: 0,
            replies: 0,
            likes: 0,
            isSolved: false,
            isFeatured: false
        };
        
        // Save to storage (in real app, this would be an API call)
        saveNewDiscussion(newDiscussion);
        
        // Close modal and show success
        closeNewDiscussionModal();
        showNotification('Discussion posted successfully!', 'success');
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Add new discussion to the list
        addNewDiscussionToDOM(newDiscussion);
        
    }, 2000);
}

function saveNewDiscussion(discussion) {
    const discussions = StorageManager.getItem('community_discussions') || [];
    discussions.unshift(discussion);
    StorageManager.setItem('community_discussions', discussions);
}

function addNewDiscussionToDOM(discussion) {
    const discussionsList = document.querySelector('.discussions-list');
    
    const discussionCard = document.createElement('div');
    discussionCard.className = 'discussion-card new';
    discussionCard.innerHTML = `
        <div class="discussion-header">
            <div class="user-info">
                <img src="${discussion.authorAvatar}" alt="${discussion.author}" class="user-avatar">
                <div class="user-details">
                    <strong>${discussion.author}</strong>
                    <span>Just now • <i class="fas fa-eye"></i> 0</span>
                </div>
            </div>
            <div class="discussion-meta">
                <span class="badge category-badge">
                    <i class="fas fa-tag"></i>
                    ${discussion.category}
                </span>
            </div>
        </div>
        
        <div class="discussion-content">
            <h3>${discussion.title}</h3>
            <p>${discussion.content.substring(0, 200)}...</p>
            <div class="discussion-tags">
                ${discussion.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>

        <div class="discussion-footer">
            <div class="discussion-stats">
                <div class="stat">
                    <i class="fas fa-comment"></i>
                    <span>0 replies</span>
                </div>
                <div class="stat">
                    <i class="fas fa-heart"></i>
                    <span>0 likes</span>
                </div>
                <div class="stat">
                    <i class="fas fa-clock unanswered"></i>
                    <span>Unanswered</span>
                </div>
            </div>
            <div class="discussion-actions">
                <button class="btn-text">
                    <i class="far fa-bookmark"></i>
                    Save
                </button>
                <button class="btn-text">
                    <i class="far fa-heart"></i>
                    Like
                </button>
                <button class="btn-text">
                    <i class="far fa-comment"></i>
                    Reply
                </button>
            </div>
        </div>
    `;
    
    // Add to the top of the list
    discussionsList.insertBefore(discussionCard, discussionsList.firstChild);
    
    // Reinitialize interactions for the new card
    initializeCommunityInteractions();
}

function loadMoreDiscussions() {
    const loadMoreBtn = document.getElementById('loadMoreDiscussions');
    const spinner = loadMoreBtn.querySelector('.fa-spinner');
    
    // Show loading
    spinner.style.display = 'inline-block';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more discussions
    setTimeout(() => {
        // In a real app, this would fetch more discussions from an API
        showNotification('Loaded more discussions', 'info');
        
        // Hide loading
        spinner.style.display = 'none';
        loadMoreBtn.disabled = false;
        
        // For demo, we'll just disable the button
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = 'No more discussions to load';
    }, 1500);
}

function loadCommunityData() {
    // This would load community data from an API
    // For demo, we're using static data
    
    // Simulate loading
    setTimeout(() => {
        // Any initialization after data load
    }, 500);
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function handleLogout() {
    UserManager.logoutUser();
    showNotification('Logged out successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Enhanced notification system for community
function showCommunityNotification(message, type = 'info', duration = 4000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.community-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `community-notification notification-${type}`;
    
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
    
    // Add community notification styles if not already added
    if (!document.querySelector('#community-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'community-notification-styles';
        styles.textContent = `
            .community-notification {
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
            
            .community-notification.notification-success {
                border-left-color: var(--success-color);
            }
            
            .community-notification.notification-error {
                border-left-color: var(--danger-color);
            }
            
            .community-notification.notification-warning {
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
            
            .community-notification.notification-success .notification-content i:first-child {
                color: var(--success-color);
            }
            
            .community-notification.notification-error .notification-content i:first-child {
                color: var(--danger-color);
            }
            
            .community-notification.notification-warning .notification-content i:first-child {
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

// Override the showNotification function for community page
function showNotification(message, type = 'info') {
    showCommunityNotification(message, type, 4000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const newDiscussionModal = document.getElementById('newDiscussionModal');
    if (newDiscussionModal && e.target === newDiscussionModal) {
        closeNewDiscussionModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N for new discussion
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openNewDiscussionModal();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeNewDiscussionModal();
    }
});

// Initialize community when page loads
window.addEventListener('load', function() {
    // Add loading animation
    const communityMain = document.querySelector('.community-main');
    if (communityMain) {
        communityMain.style.opacity = '0';
        communityMain.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            communityMain.style.opacity = '1';
        }, 300);
    }
});