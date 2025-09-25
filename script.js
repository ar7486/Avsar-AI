// Multi-page navigation and functionality

// Navigation functionality
function setupNavigation() {
    // Highlight active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
           (currentPage === 'index.html' && href === 'index.html') ||
           (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// UX4G Map Implementation (Only the map part)
function initializeMap() {
    // Map data
    var data = [
        ['in-py', 0], ['in-ld', 1], ['in-wb', 2], ['in-or', 3], ['in-br', 4],
        ['in-sk', 5], ['in-ct', 6], ['in-tn', 7], ['in-mp', 8], ['in-2984', 9],
        ['in-ga', 10], ['in-nl', 11], ['in-mn', 12], ['in-ar', 13], ['in-mz', 14],
        ['in-tr', 15], ['in-3464', 16], ['in-dl', 17], ['in-hr', 18], ['in-ch', 19],
        ['in-hp', 20], ['in-jk', 21], ['in-kl', 22], ['in-ka', 23], ['in-dn', 24],
        ['in-mh', 25], ['in-as', 26], ['in-ap', 27], ['in-ml', 28], ['in-pb', 29],
        ['in-rj', 30], ['in-up', 31], ['in-ut', 32], ['in-jh', 33]
    ];

    // Check if UX4Gmap is available
    if (typeof UX4Gmap !== 'undefined') {
        // Create the map chart with orange theme
        UX4Gmap.mapChart('ux4g-map', {
            chart: {
                map: 'countries/in/in-all',
            },
            title: { text: '' },
            subtitle: { text: '' },
            legend: { enabled: false },
            tooltip: {
                useHTML: true,
                headerFormat: '',
                pointFormat: `<div style="color: white; background-color: #3D4A8A; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; position: relative;">
                    {point.name}
                    <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #3D4A8A; margin: 0 auto; position: absolute; left: 50%; transform: translateX(-50%); bottom: -6px;"></div>
                </div>`,
                backgroundColor: null,
                borderWidth: 0,
                shadow: false
            },
            navigation: {
                buttonOptions: { enabled: false }
            },
            credits: { enabled: false },
            series: [{
                data: data,
                allowPointSelect: true,
                cursor: 'pointer',
                color: '#FFE4D1',
                borderColor: '#FF7A00',
                borderWidth: 1,
                states: {
                    hover: {
                        color: '#FFB380',
                        borderColor: '#FF5500'
                    },
                    select: {
                        color: '#FF7A00'
                    }
                },
                dataLabels: { enabled: false },
                point: {
                    events: {
                        click: function () {
                            showStateInternships(this.name);
                        }
                    }
                }
            }]
        });
    } else {
        console.error('UX4Gmap library not loaded');
        const mapElement = document.getElementById('ux4g-map');
        if (mapElement) {
            mapElement.innerHTML = 
                '<div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 8px; color: #666; text-align: center;"><div><p>India Map</p><p style="font-size: 0.9rem; margin-top: 0.5rem;">Interactive map loading...</p></div></div>';
        }
    }
}

// Skills and internship filtering (for My Journey page)
function setupSkillsFiltering() {
    const skillInputs = document.querySelectorAll('.skills-input input');
    const internshipCards = document.querySelectorAll('.internship-card');

    if (skillInputs.length === 0) return;

    skillInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                addSkill(this.value.trim());
                this.value = '';
                filterInternships();
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value.toLowerCase();
            filterInternships(query);
        }, 300));
    }
}

// Form handling (for Profile page)
function setupProfileForm() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(profileForm);
        const profileData = Object.fromEntries(formData.entries());
        
        // Save to localStorage (in a real app, this would go to a server)
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        
        showNotification('Profile saved successfully!');
    });

    // File upload handling
    const fileInput = document.getElementById('resume');
    const uploadArea = document.querySelector('.upload-area');
    
    if (uploadArea) {
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#FF7A00';
            this.style.backgroundColor = '#fff5f0';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = '#fafafa';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = '#fafafa';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });

        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                handleFileUpload(this.files[0]);
            }
        });
    }
}

// Utility functions
function addSkill(skillName) {
    const skillsContainer = document.querySelector('.skills-list');
    if (!skillsContainer) return;

    const skillTag = document.createElement('span');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = `${skillName} <span class="remove">×</span>`;
    
    skillsContainer.appendChild(skillTag);
}

function filterInternships(query = '') {
    const internshipCards = document.querySelectorAll('.internship-card');
    internshipCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const company = card.querySelector('.company')?.textContent.toLowerCase() || '';
        const skills = card.querySelector('.skills')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || company.includes(query) || skills.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function handleFileUpload(file) {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const uploadArea = document.querySelector('.upload-area');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div style="text-align: center;">
                    <div style="color: #FF7A00; font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                    <p style="margin: 0; font-weight: 600;">${file.name}</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; color: #666;">File uploaded successfully</p>
                </div>
            `;
        }
    } else {
        showNotification('Please upload a PDF file.');
    }
}

function showStateInternships(stateName) {
    const stateInternships = {
        'Andhra Pradesh': { opportunities: 45, companies: 23, topSector: 'IT Services' },
        'Karnataka': { opportunities: 67, companies: 34, topSector: 'Technology' },
        'Maharashtra': { opportunities: 89, companies: 45, topSector: 'Finance' },
        'Tamil Nadu': { opportunities: 56, companies: 28, topSector: 'Manufacturing' },
        'West Bengal': { opportunities: 43, companies: 21, topSector: 'Healthcare' },
        'Madhya Pradesh': { opportunities: 35, companies: 18, topSector: 'Agriculture Tech' },
        'Uttar Pradesh': { opportunities: 52, companies: 26, topSector: 'E-commerce' },
        'Rajasthan': { opportunities: 38, companies: 19, topSector: 'Tourism Tech' },
        'Gujarat': { opportunities: 41, companies: 22, topSector: 'Chemical' },
        'Delhi': { opportunities: 78, companies: 39, topSector: 'Fintech' }
    };

    const info = stateInternships[stateName] || { opportunities: 25, companies: 12, topSector: 'General' };
    
    showNotification(`
        <strong>${stateName}</strong><br>
        🎯 ${info.opportunities} Internship Opportunities<br>
        🏢 ${info.companies} Companies Hiring<br>
        📊 Top Sector: ${info.topSector}
    `);
}

function showNotification(message) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3D4A8A;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 300px;
        font-size: 0.9rem;
        line-height: 1.4;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
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

// Button event handlers
function setupButtonHandlers() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-orange')) {
            const btn = e.target.closest('.btn-orange');
            const text = btn.textContent.trim();
            
            if (text === 'Apply Now') {
                handleApplyNow(btn);
            } else if (text === 'Analyse resume') {
                handleAnalyzeResume();
            } else if (text === 'Explore Opportunities') {
                window.location.href = 'my-journey.html';
            } else if (text === 'Sign Up') {
                openAuthModal('signup');
            }
        }
        
        if (e.target.closest('.btn-secondary')) {
            const btn = e.target.closest('.btn-secondary');
            const text = btn.textContent.trim();
            
            if (text === 'Sign In') {
                openAuthModal('signin');
            } else if (text === 'Analyze Internship') {
                openAnalysisModal(btn);
            }
        }
        
        // Remove skill tags
        if (e.target.classList.contains('remove')) {
            e.target.closest('.skill-tag').remove();
        }
        
        // Modal close functionality
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-overlay')) {
            closeAuthModal();
        }
        
        // Analysis modal close functionality
        if (e.target.classList.contains('analysis-modal-close') || e.target.classList.contains('analysis-modal-overlay')) {
            closeAnalysisModal();
        }
    });
}

function handleApplyNow(btn) {
    const card = btn.closest('.internship-card');
    const company = card.querySelector('.company').textContent;
    const position = card.querySelector('h3').textContent;
    
    showNotification(`Application submitted for ${position} at ${company}!`);
}

function handleAnalyzeResume() {
    showNotification('Resume analysis started! Check your journey page for detailed insights.');
}

// Initialize page-specific functionality
function initializePage() {
    setupNavigation();
    setupButtonHandlers();
    
    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeMap();
            break;
        case 'my-journey.html':
            setupSkillsFiltering();
            break;
        case 'profile.html':
            setupProfileForm();
            break;
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', initializePage);

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { ...defaultHeaders, ...options.headers },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message || 'Network error occurred');
        throw error;
    }
}

// Auth Modal Functions
function openAuthModal(type) {
    const modal = document.getElementById('authModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.querySelector('.modal-submit');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    
    if (type === 'signup') {
        modalTitle.textContent = 'Sign Up';
        submitBtn.textContent = 'Sign Up';
        confirmPasswordGroup.style.display = 'block';
    } else {
        modalTitle.textContent = 'Sign In';
        submitBtn.textContent = 'Sign In';
        confirmPasswordGroup.style.display = 'none';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    const form = document.getElementById('authForm');
    if (form) {
        form.reset();
    }
}

// Handle auth form submission
document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const isSignUp = document.getElementById('modalTitle').textContent === 'Sign Up';
            
            if (isSignUp && password !== confirmPassword) {
                showNotification('Passwords do not match!');
                return;
            }
            
            if (username && password) {
                try {
                    const endpoint = isSignUp ? '/auth/register' : '/auth/login';
                    const payload = isSignUp ? 
                        { username, email: username, password, confirmPassword } : 
                        { username, password };
                    
                    const data = await apiCall(endpoint, {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                    
                    // Store token
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    showNotification(`${isSignUp ? 'Account created' : 'Logged in'} successfully!`);
                    closeAuthModal();
                    
                    // Update nav for logged in user
                    updateNavForLoggedInUser(data.user.username);
                    
                } catch (error) {
                    // Error already handled in apiCall
                }
            }
        });
    }
});

function updateNavForLoggedInUser(username) {
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.innerHTML = `
            <span class="user-name">Welcome, ${username}</span>
            <button class="btn btn-orange" onclick="handleLogout()">Log Out</button>
        `;
    }
}

async function handleLogout() {
    try {
        await apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
        // Continue with logout even if API call fails
    }
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Reset navigation
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.innerHTML = `
            <button class="btn btn-secondary">Sign In</button>
            <button class="btn btn-orange">Sign Up</button>
        `;
    }
    
    showNotification('Logged out successfully!');
}

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            updateNavForLoggedInUser(userData.username);
        } catch (error) {
            console.error('Invalid user data in localStorage');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    }
}

// Load internships from API
async function loadInternships() {
    try {
        const data = await apiCall('/internships');
        displayInternships(data.internships);
    } catch (error) {
        console.error('Failed to load internships');
    }
}

function displayInternships(internships) {
    const container = document.querySelector('.internships-container');
    if (!container) return;

    container.innerHTML = internships.map(internship => `
        <div class="internship-card" data-id="${internship._id}">
            <div class="company-info">
                <h3>${internship.title}</h3>
                <p class="company">${internship.company.name}</p>
                <p class="location">${internship.company.location.city}, ${internship.company.location.state}</p>
            </div>
            <div class="internship-details">
                <span class="stipend">₹${internship.details.stipend.amount}/${internship.details.stipend.period}</span>
                <span class="duration">${internship.details.duration}</span>
                <span class="category">${internship.category}</span>
            </div>
            <div class="skills">${internship.requirements.skills.join(', ')}</div>
            <div class="card-actions">
                <button class="btn btn-secondary" onclick="viewInternship('${internship._id}')">View Details</button>
                <button class="btn btn-orange" onclick="applyForInternship('${internship._id}')">Apply Now</button>
            </div>
        </div>
    `).join('');
}

async function applyForInternship(internshipId) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        showNotification('Please sign in to apply for internships');
        openAuthModal('signin');
        return;
    }

    try {
        const data = await apiCall(`/internships/${internshipId}/apply`, {
            method: 'POST'
        });
        
        showNotification(data.message);
    } catch (error) {
        // Error already handled in apiCall
    }
}

function viewInternship(internshipId) {
    // Navigate to detailed view or open modal
    window.open(`/internship/${internshipId}`, '_blank');
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAuthModal();
        closeAnalysisModal();
    }
});

// Analysis Modal Functions
function openAnalysisModal(btn) {
    const modal = document.getElementById('analysisModal');
    if (!modal) return;
    
    // Get internship card details
    const internshipCard = btn.closest('.internship-card');
    if (internshipCard) {
        // Update modal content with specific internship data
        updateAnalysisModalContent(internshipCard);
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Show loading animation briefly
    showNotification('Analyzing internship match...');
}

function closeAnalysisModal() {
    const modal = document.getElementById('analysisModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateAnalysisModalContent(internshipCard) {
    // Extract internship details from the card
    const title = internshipCard.querySelector('h3')?.textContent || 'Internship';
    const company = internshipCard.querySelector('.company')?.textContent || 'Company';
    const skills = Array.from(internshipCard.querySelectorAll('.skill-tag')).map(tag => tag.textContent);
    const matchScore = internshipCard.querySelector('.match-score')?.textContent || '75%';
    
    // Update modal content dynamically
    const modal = document.getElementById('analysisModal');
    const internshipInfo = modal.querySelector('.internship-info ul');
    const matchHighlight = modal.querySelector('.match-highlight');
    const skillsList = modal.querySelector('.skills-section .skills-list');
    
    if (internshipInfo) {
        internshipInfo.innerHTML = `
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Required Skills:</strong> ${skills.join(', ')}</li>
            <li><strong>Skill Match Score:</strong> <span class="match-highlight">${matchScore}</span></li>
        `;
    }
    
    if (matchHighlight) {
        matchHighlight.textContent = matchScore;
    }
}

// Initialize auth status on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    
    // Load internships if on my-journey page
    if (window.location.pathname.includes('my-journey')) {
        loadInternships();
    }
});

// Password toggle functionality
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🙈'; // Hide icon
        toggleButton.setAttribute('aria-label', 'Hide password');
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️'; // Show icon
        toggleButton.setAttribute('aria-label', 'Show password');
    }
}

// Enhanced Profile Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Avatar upload functionality
    const avatarContainer = document.querySelector('.avatar-image');
    const avatarUpload = document.getElementById('avatarUpload');
    
    if (avatarContainer && avatarUpload) {
        avatarContainer.addEventListener('click', () => {
            avatarUpload.click();
        });
        
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarContainer.style.backgroundImage = `url(${e.target.result})`;
                    avatarContainer.style.backgroundSize = 'cover';
                    avatarContainer.style.backgroundPosition = 'center';
                    avatarContainer.innerHTML = ''; // Remove SVG icon
                    showNotification('Profile picture updated!');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Skills functionality
    const skillInput = document.getElementById('skillInput');
    if (skillInput) {
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }
});

// Skills management functions
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skillsDisplay = document.getElementById('skillsDisplay');
    const skillText = skillInput.value.trim();
    
    if (skillText && !isSkillAlreadyAdded(skillText)) {
        const skillTag = createSkillTag(skillText);
        skillsDisplay.appendChild(skillTag);
        skillInput.value = '';
        updateProfileCompletion();
        showNotification(`Added skill: ${skillText}`);
    } else if (isSkillAlreadyAdded(skillText)) {
        showNotification('Skill already added!');
    }
}

function addSkillFromSuggestion(skillText) {
    const skillsDisplay = document.getElementById('skillsDisplay');
    
    if (!isSkillAlreadyAdded(skillText)) {
        const skillTag = createSkillTag(skillText);
        skillsDisplay.appendChild(skillTag);
        updateProfileCompletion();
        showNotification(`Added skill: ${skillText}`);
    } else {
        showNotification('Skill already added!');
    }
}

function createSkillTag(skillText) {
    const skillTag = document.createElement('span');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = `
        ${skillText}
        <button class="remove-skill" onclick="removeSkillTag(this)">×</button>
    `;
    return skillTag;
}

function removeSkillTag(button) {
    const skillTag = button.parentElement;
    const skillText = skillTag.textContent.replace('×', '').trim();
    skillTag.remove();
    updateProfileCompletion();
    showNotification(`Removed skill: ${skillText}`);
}

function isSkillAlreadyAdded(skillText) {
    const existingSkills = document.querySelectorAll('.skill-tag');
    return Array.from(existingSkills).some(tag => 
        tag.textContent.replace('×', '').trim().toLowerCase() === skillText.toLowerCase()
    );
}

// File upload functions
function triggerFileUpload(fileType) {
    document.getElementById(fileType).click();
}

function removeFile(fileType) {
    const fileInput = document.getElementById(fileType);
    const fileInfo = document.getElementById(fileType + 'Info');
    const uploadArea = fileInfo.previousElementSibling;
    
    fileInput.value = '';
    fileInfo.style.display = 'none';
    uploadArea.style.display = 'block';
    updateProfileCompletion();
    showNotification('File removed');
}

// Set up file upload listeners
document.addEventListener('DOMContentLoaded', function() {
    const fileInputs = ['resume', 'portfolio', 'certificate'];
    
    fileInputs.forEach(inputId => {
        const fileInput = document.getElementById(inputId);
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                const files = e.target.files;
                if (files.length > 0) {
                    const fileInfo = document.getElementById(inputId + 'Info');
                    const uploadArea = fileInfo.previousElementSibling;
                    const fileName = files[0].name;
                    
                    fileInfo.querySelector('.file-name').textContent = fileName;
                    fileInfo.style.display = 'flex';
                    uploadArea.style.display = 'none';
                    updateProfileCompletion();
                    showNotification(`${fileName} uploaded successfully!`);
                }
            });
        }
    });
});

// Profile completion tracking
function updateProfileCompletion() {
    const fields = [
        'fullName', 'email', 'phone', 'dob', 'address'
    ];
    
    let filledFields = 0;
    const totalFields = fields.length + 3; // +3 for skills, resume, experience
    
    // Check form fields
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim()) {
            filledFields++;
        }
    });
    
    // Check skills
    const skills = document.querySelectorAll('.skill-tag');
    if (skills.length > 0) filledFields++;
    
    // Check resume upload
    const resumeInfo = document.getElementById('resumeInfo');
    if (resumeInfo && resumeInfo.style.display !== 'none') filledFields++;
    
    // Check experience level
    const experienceInputs = document.querySelectorAll('input[name="experience"]:checked');
    if (experienceInputs.length > 0) filledFields++;
    
    const completionPercentage = Math.round((filledFields / totalFields) * 100);
    
    // Update completion bar
    const completionFill = document.querySelector('.completion-fill');
    const completionText = document.querySelector('.completion-text');
    
    if (completionFill) {
        completionFill.style.width = `${completionPercentage}%`;
    }
    if (completionText) {
        completionText.textContent = `Profile ${completionPercentage}% Complete`;
    }
}

// Form actions
function saveProfile() {
    const profileData = {
        fullName: document.getElementById('fullName')?.value,
        email: document.getElementById('email')?.value,
        phone: document.getElementById('phone')?.value,
        dob: document.getElementById('dob')?.value,
        address: document.getElementById('address')?.value,
        university: document.getElementById('university')?.value,
        course: document.getElementById('course')?.value,
        skills: Array.from(document.querySelectorAll('.skill-tag')).map(tag => 
            tag.textContent.replace('×', '').trim()
        ),
        experience: document.querySelector('input[name="experience"]:checked')?.value,
        interests: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
        github: document.getElementById('github')?.value,
        linkedin: document.getElementById('linkedin')?.value,
        website: document.getElementById('website')?.value
    };
    
    // Here you would typically send the data to your backend
    console.log('Profile data:', profileData);
    
    // Show success message
    showNotification('Profile saved successfully! 🎉');
    
    // Update completion
    updateProfileCompletion();
}

function resetForm() {
    if (confirm('Are you sure you want to reset the entire form? This action cannot be undone.')) {
        // Reset all form fields
        document.querySelectorAll('.form-input').forEach(input => {
            input.value = '';
        });
        
        // Reset checkboxes and radio buttons
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        // Reset skills
        const skillsDisplay = document.getElementById('skillsDisplay');
        if (skillsDisplay) {
            skillsDisplay.innerHTML = '';
        }
        
        // Reset file uploads
        ['resume', 'portfolio', 'certificate'].forEach(fileType => {
            const fileInput = document.getElementById(fileType);
            const fileInfo = document.getElementById(fileType + 'Info');
            const uploadArea = fileInfo?.previousElementSibling;
            
            if (fileInput) fileInput.value = '';
            if (fileInfo) fileInfo.style.display = 'none';
            if (uploadArea) uploadArea.style.display = 'block';
        });
        
        // Reset avatar
        const avatarContainer = document.querySelector('.avatar-image');
        if (avatarContainer) {
            avatarContainer.style.backgroundImage = '';
            avatarContainer.innerHTML = `
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#FF7A00" stroke-width="2"/>
                    <circle cx="12" cy="7" r="4" stroke="#FF7A00" stroke-width="2"/>
                </svg>
            `;
        }
        
        updateProfileCompletion();
        showNotification('Form has been reset');
    }
}