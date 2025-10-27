// Roadmap Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeRoadmapPage();
});

function initializeRoadmapPage() {
    // Initialize navigation interactions
    initializeNavigation();
    
    // Initialize search functionality
    initializeSearch();
    
    // Load roadmap data
    loadRoadmapData();
    
    // Initialize filters
    initializeFilters();
    
    // Initialize modal
    initializeModal();
}

function initializeNavigation() {
    // Search toggle
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.getElementById('searchClose');
    
    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', function() {
            searchBar.classList.toggle('show');
            if (searchBar.classList.contains('show')) {
                document.getElementById('roadmapSearch').focus();
            }
        });
    }
    
    if (searchClose && searchBar) {
        searchClose.addEventListener('click', function() {
            searchBar.classList.remove('show');
        });
    }
    
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
}

function handleLogout() {
    UserManager.logoutUser();
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function initializeSearch() {
    const searchInput = document.getElementById('roadmapSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const durationFilter = document.getElementById('durationFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            filterRoadmaps();
        }, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterRoadmaps);
    }
    
    if (levelFilter) {
        levelFilter.addEventListener('change', filterRoadmaps);
    }
    
    if (durationFilter) {
        durationFilter.addEventListener('change', filterRoadmaps);
    }
}

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

// Roadmap Data
const roadmapData = {
    categories: [
        {
            id: 'web',
            title: 'Web Development',
            description: 'Become a full-stack web developer with modern technologies',
            icon: 'fas fa-laptop-code',
            roadmaps: 12,
            resources: 250
        },
        {
            id: 'mobile',
            title: 'Mobile Development',
            description: 'Build cross-platform mobile applications',
            icon: 'fas fa-mobile-alt',
            roadmaps: 8,
            resources: 180
        },
        {
            id: 'data',
            title: 'Data Science',
            description: 'Master data analysis and machine learning',
            icon: 'fas fa-chart-line',
            roadmaps: 10,
            resources: 220
        },
        {
            id: 'ai',
            title: 'AI & Machine Learning',
            description: 'Dive into artificial intelligence and neural networks',
            icon: 'fas fa-brain',
            roadmaps: 6,
            resources: 150
        },
        {
            id: 'cloud',
            title: 'Cloud Computing',
            description: 'Learn cloud infrastructure and DevOps',
            icon: 'fas fa-cloud',
            roadmaps: 7,
            resources: 120
        },
        {
            id: 'cyber',
            title: 'Cyber Security',
            description: 'Protect systems and networks from threats',
            icon: 'fas fa-shield-alt',
            roadmaps: 5,
            resources: 100
        }
    ],
    
    featuredRoadmaps: [
        {
            id: 'frontend-2024',
            title: 'Frontend Development 2024',
            category: 'web',
            description: 'Complete path to becoming a modern frontend developer with React, Vue, and latest tools',
            level: 'intermediate',
            duration: '6-12',
            popularity: 95,
            students: 4500,
            progress: 0,
            icon: 'fab fa-react'
        },
        {
            id: 'fullstack-js',
            title: 'FullStack JavaScript',
            category: 'web',
            description: 'Master both frontend and backend development with JavaScript ecosystem',
            level: 'beginner',
            duration: '12+',
            popularity: 88,
            students: 3200,
            progress: 0,
            icon: 'fab fa-js-square'
        },
        {
            id: 'python-data',
            title: 'Python for Data Science',
            category: 'data',
            description: 'Learn Python, pandas, numpy and scikit-learn for data analysis and ML',
            level: 'beginner',
            duration: '3-6',
            popularity: 92,
            students: 2800,
            progress: 0,
            icon: 'fab fa-python'
        }
    ],
    
    allRoadmaps: [
        {
            id: 'web-basics',
            title: 'Web Development Basics',
            category: 'web',
            description: 'Start with HTML, CSS, and JavaScript fundamentals',
            level: 'beginner',
            duration: '1-3',
            popularity: 85,
            students: 1500,
            progress: 0,
            icon: 'fas fa-code'
        },
        {
            id: 'react-master',
            title: 'React Masterclass',
            category: 'web',
            description: 'Deep dive into React, hooks, context, and advanced patterns',
            level: 'intermediate',
            duration: '3-6',
            popularity: 90,
            students: 2200,
            progress: 0,
            icon: 'fab fa-react'
        },
        {
            id: 'node-backend',
            title: 'Node.js Backend',
            category: 'web',
            description: 'Build scalable backend services with Node.js and Express',
            level: 'intermediate',
            duration: '3-6',
            popularity: 82,
            students: 1800,
            progress: 0,
            icon: 'fab fa-node-js'
        },
        {
            id: 'flutter-dev',
            title: 'Flutter Development',
            category: 'mobile',
            description: 'Create beautiful cross-platform apps with Flutter',
            level: 'beginner',
            duration: '6-12',
            popularity: 78,
            students: 1200,
            progress: 0,
            icon: 'fas fa-mobile'
        },
        {
            id: 'android-kotlin',
            title: 'Android with Kotlin',
            category: 'mobile',
            description: 'Native Android app development using Kotlin',
            level: 'intermediate',
            duration: '6-12',
            popularity: 75,
            students: 900,
            progress: 0,
            icon: 'fab fa-android'
        },
        {
            id: 'swift-ios',
            title: 'iOS with Swift',
            category: 'mobile',
            description: 'Build iOS applications using Swift and SwiftUI',
            level: 'intermediate',
            duration: '6-12',
            popularity: 72,
            students: 800,
            progress: 0,
            icon: 'fab fa-apple'
        },
        {
            id: 'data-analysis',
            title: 'Data Analysis',
            category: 'data',
            description: 'Learn data cleaning, visualization, and analysis techniques',
            level: 'beginner',
            duration: '3-6',
            popularity: 80,
            students: 1100,
            progress: 0,
            icon: 'fas fa-chart-bar'
        },
        {
            id: 'ml-fundamentals',
            title: 'Machine Learning Fundamentals',
            category: 'ai',
            description: 'Introduction to machine learning algorithms and concepts',
            level: 'intermediate',
            duration: '6-12',
            popularity: 85,
            students: 1300,
            progress: 0,
            icon: 'fas fa-robot'
        },
        {
            id: 'aws-cloud',
            title: 'AWS Cloud Practitioner',
            category: 'cloud',
            description: 'Amazon Web Services fundamentals and certification prep',
            level: 'beginner',
            duration: '1-3',
            popularity: 79,
            students: 950,
            progress: 0,
            icon: 'fab fa-aws'
        },
        {
            id: 'cyber-basics',
            title: 'Cyber Security Basics',
            category: 'cyber',
            description: 'Introduction to security concepts and best practices',
            level: 'beginner',
            duration: '1-3',
            popularity: 76,
            students: 700,
            progress: 0,
            icon: 'fas fa-shield-alt'
        }
    ]
};

function loadRoadmapData() {
    loadCategories();
    loadFeaturedRoadmaps();
    loadAllRoadmaps();
}

function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = roadmapData.categories.map(category => `
        <div class="category-card" onclick="showCategoryRoadmaps('${category.id}')">
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3>${category.title}</h3>
            <p>${category.description}</p>
            <div class="category-stats">
                <span>${category.roadmaps} Roadmaps</span>
                <span>${category.resources}+ Resources</span>
            </div>
        </div>
    `).join('');
}

function loadFeaturedRoadmaps() {
    const featuredRoadmaps = document.getElementById('featuredRoadmaps');
    if (!featuredRoadmaps) return;
    
    featuredRoadmaps.innerHTML = roadmapData.featuredRoadmaps.map(roadmap => `
        <div class="roadmap-card" onclick="showRoadmapDetails('${roadmap.id}')">
            <div class="roadmap-header">
                <div class="roadmap-icon">
                    <i class="${roadmap.icon}"></i>
                </div>
                <div class="roadmap-info">
                    <h3>${roadmap.title}</h3>
                    <p>${getCategoryName(roadmap.category)} • ${getLevelText(roadmap.level)}</p>
                </div>
            </div>
            <div class="roadmap-body">
                <div class="roadmap-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${getDurationText(roadmap.duration)}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <span>${roadmap.students.toLocaleString()}+ students</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${roadmap.popularity}%</span>
                    </div>
                </div>
                <p class="roadmap-description">${roadmap.description}</p>
                ${roadmap.progress > 0 ? `
                    <div class="roadmap-progress">
                        <div class="progress-label">
                            <span>Your Progress</span>
                            <span>${roadmap.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${roadmap.progress}%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="roadmap-footer">
                <div class="roadmap-difficulty">
                    ${getDifficultyDots(roadmap.level)}
                </div>
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); startRoadmap('${roadmap.id}')">
                    Start Learning
                </button>
            </div>
        </div>
    `).join('');
}

function loadAllRoadmaps() {
    const roadmapsList = document.getElementById('roadmapsList');
    if (!roadmapsList) return;
    
    updateRoadmapsList(roadmapData.allRoadmaps);
}

function updateRoadmapsList(roadmaps) {
    const roadmapsList = document.getElementById('roadmapsList');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!roadmapsList) return;
    
    roadmapsList.innerHTML = roadmaps.map(roadmap => `
        <div class="roadmap-list-item" onclick="showRoadmapDetails('${roadmap.id}')">
            <div class="list-item-icon">
                <i class="${roadmap.icon}"></i>
            </div>
            <div class="list-item-content">
                <h4>${roadmap.title}</h4>
                <p>${roadmap.description}</p>
                <div class="list-item-meta">
                    <span><i class="fas fa-tag"></i> ${getCategoryName(roadmap.category)}</span>
                    <span><i class="fas fa-signal"></i> ${getLevelText(roadmap.level)}</span>
                    <span><i class="fas fa-clock"></i> ${getDurationText(roadmap.duration)}</span>
                    <span><i class="fas fa-users"></i> ${roadmap.students.toLocaleString()}</span>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); startRoadmap('${roadmap.id}')">
                    Start
                </button>
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); showRoadmapDetails('${roadmap.id}')">
                    Details
                </button>
            </div>
        </div>
    `).join('');
    
    if (resultsCount) {
        resultsCount.textContent = roadmaps.length;
    }
}

function getCategoryName(categoryId) {
    const category = roadmapData.categories.find(cat => cat.id === categoryId);
    return category ? category.title : categoryId;
}

function getLevelText(level) {
    const levels = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
    };
    return levels[level] || level;
}

function getDurationText(duration) {
    const durations = {
        '1-3': '1-3 months',
        '3-6': '3-6 months',
        '6-12': '6-12 months',
        '12+': '12+ months'
    };
    return durations[duration] || duration;
}

function getDifficultyDots(level) {
    const dots = {
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3
    };
    
    const activeDots = dots[level] || 1;
    let html = '';
    
    for (let i = 1; i <= 3; i++) {
        html += `<div class="difficulty-dot ${i <= activeDots ? 'active' : ''}"></div>`;
    }
    
    return html;
}

function initializeFilters() {
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const sortBy = document.getElementById('sortBy');
    
    if (applyFilters) {
        applyFilters.addEventListener('click', filterRoadmaps);
    }
    
    if (resetFilters) {
        resetFilters.addEventListener('click', resetAllFilters);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', sortRoadmaps);
    }
}

function filterRoadmaps() {
    const searchTerm = document.getElementById('roadmapSearch')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const level = document.getElementById('levelFilter')?.value || '';
    const duration = document.getElementById('durationFilter')?.value || '';
    
    // Get checkbox filters
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const selectedLevels = Array.from(document.querySelectorAll('input[name="level"]:checked')).map(cb => cb.value);
    const selectedDurations = Array.from(document.querySelectorAll('input[name="duration"]:checked')).map(cb => cb.value);
    
    let filteredRoadmaps = roadmapData.allRoadmaps.filter(roadmap => {
        // Search filter
        const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm) || 
                            roadmap.description.toLowerCase().includes(searchTerm);
        
        // Dropdown filters (search bar)
        const matchesCategory = !category || roadmap.category === category;
        const matchesLevel = !level || roadmap.level === level;
        const matchesDuration = !duration || roadmap.duration === duration;
        
        // Checkbox filters (sidebar)
        const matchesCategories = selectedCategories.length === 0 || selectedCategories.includes(roadmap.category);
        const matchesLevels = selectedLevels.length === 0 || selectedLevels.includes(roadmap.level);
        const matchesDurations = selectedDurations.length === 0 || selectedDurations.includes(roadmap.duration);
        
        return matchesSearch && matchesCategory && matchesLevel && matchesDuration && 
               matchesCategories && matchesLevels && matchesDurations;
    });
    
    updateRoadmapsList(filteredRoadmaps);
}

function resetAllFilters() {
    // Reset search bar
    const searchInput = document.getElementById('roadmapSearch');
    if (searchInput) searchInput.value = '';
    
    // Reset dropdowns
    const dropdowns = ['categoryFilter', 'levelFilter', 'durationFilter'];
    dropdowns.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    // Reset checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Reset sort
    const sortBy = document.getElementById('sortBy');
    if (sortBy) sortBy.value = 'popularity';
    
    filterRoadmaps();
}

function sortRoadmaps() {
    const sortBy = document.getElementById('sortBy')?.value || 'popularity';
    let roadmaps = [...roadmapData.allRoadmaps];
    
    switch(sortBy) {
        case 'popularity':
            roadmaps.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'newest':
            // For demo, we'll sort by students (assuming newer have fewer students)
            roadmaps.sort((a, b) => b.students - a.students);
            break;
        case 'duration':
            const durationOrder = {'1-3': 1, '3-6': 2, '6-12': 3, '12+': 4};
            roadmaps.sort((a, b) => durationOrder[a.duration] - durationOrder[b.duration]);
            break;
        case 'difficulty':
            const levelOrder = {'beginner': 1, 'intermediate': 2, 'advanced': 3};
            roadmaps.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
            break;
    }
    
    updateRoadmapsList(roadmaps);
}

function initializeModal() {
    // Modal will be handled by individual functions
}

function showCategoryRoadmaps(categoryId) {
    const category = roadmapData.categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    // For now, just filter by category
    document.getElementById('categoryFilter').value = categoryId;
    filterRoadmaps();
    
    // Scroll to all roadmaps section
    document.querySelector('.all-roadmaps').scrollIntoView({
        behavior: 'smooth'
    });
}

function showRoadmapDetails(roadmapId) {
    const roadmap = [...roadmapData.featuredRoadmaps, ...roadmapData.allRoadmaps].find(r => r.id === roadmapId);
    if (!roadmap) return;
    
    const modal = document.getElementById('roadmapModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = roadmap.title;
    
    modalBody.innerHTML = `
        <div class="roadmap-modal-content">
            <div class="modal-header-info">
                <div class="modal-icon">
                    <i class="${roadmap.icon}"></i>
                </div>
                <div class="modal-meta">
                    <div class="meta-badges">
                        <span class="badge badge-category">${getCategoryName(roadmap.category)}</span>
                        <span class="badge badge-level">${getLevelText(roadmap.level)}</span>
                        <span class="badge badge-duration">${getDurationText(roadmap.duration)}</span>
                    </div>
                    <div class="modal-stats">
                        <div class="stat">
                            <i class="fas fa-users"></i>
                            <span>${roadmap.students.toLocaleString()}+ students</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-star"></i>
                            <span>${roadmap.popularity}% popularity</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-description">
                <h4>Description</h4>
                <p>${roadmap.description}</p>
            </div>
            
            <div class="modal-curriculum">
                <h4>Curriculum Overview</h4>
                <div class="curriculum-steps">
                    ${getCurriculumSteps(roadmap.level).map(step => `
                        <div class="curriculum-step">
                            <div class="step-number">${step.number}</div>
                            <div class="step-content">
                                <h5>${step.title}</h5>
                                <p>${step.description}</p>
                                <div class="step-topics">
                                    ${step.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary btn-large" onclick="startRoadmap('${roadmap.id}')">
                    <i class="fas fa-play"></i>
                    Start Learning Journey
                </button>
                <button class="btn btn-outline" onclick="closeRoadmapModal()">
                    Browse More
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function getCurriculumSteps(level) {
    const baseSteps = [
        {
            number: 1,
            title: 'Fundamentals & Setup',
            description: 'Learn the basics and set up your development environment',
            topics: ['Introduction', 'Tools Setup', 'Basic Concepts']
        },
        {
            number: 2,
            title: 'Core Concepts',
            description: 'Master the essential building blocks',
            topics: ['Syntax', 'Data Structures', 'Basic Algorithms']
        },
        {
            number: 3,
            title: 'Practical Applications',
            description: 'Build real projects and apply your knowledge',
            topics: ['Projects', 'Best Practices', 'Debugging']
        }
    ];
    
    if (level === 'intermediate') {
        baseSteps.push({
            number: 4,
            title: 'Advanced Topics',
            description: 'Dive deeper into complex concepts',
            topics: ['Advanced Patterns', 'Performance', 'Architecture']
        });
    } else if (level === 'advanced') {
        baseSteps.push(
            {
                number: 4,
                title: 'Advanced Concepts',
                description: 'Explore sophisticated techniques',
                topics: ['Complex Algorithms', 'System Design', 'Optimization']
            },
            {
                number: 5,
                title: 'Specialization',
                description: 'Focus on specific advanced areas',
                topics: ['Specialized Libraries', 'Advanced Tools', 'Research Topics']
            }
        );
    }
    
    return baseSteps;
}

function closeRoadmapModal() {
    const modal = document.getElementById('roadmapModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function startRoadmap(roadmapId) {
    const currentUser = UserManager.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Please login to start learning!', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    showNotification(`Starting ${getRoadmapTitle(roadmapId)}...`, 'success');
    
    // Close modal if open
    closeRoadmapModal();
    
    // In a real app, this would redirect to the first lesson
    setTimeout(() => {
        // For demo, redirect to dashboard
        window.location.href = 'dashboard.html';
    }, 1500);
}

function getRoadmapTitle(roadmapId) {
    const roadmap = [...roadmapData.featuredRoadmaps, ...roadmapData.allRoadmaps].find(r => r.id === roadmapId);
    return roadmap ? roadmap.title : 'Roadmap';
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('roadmapModal');
    if (modal && e.target === modal) {
        closeRoadmapModal();
    }
});

// Load more functionality
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more roadmaps
            showNotification('Loading more roadmaps...', 'info');
            
            // In a real app, this would fetch more data from an API
            setTimeout(() => {
                showNotification('No more roadmaps to load', 'info');
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = 'All Roadmaps Loaded';
            }, 1000);
        });
    }
});