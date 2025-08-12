// Main application logic
class NotezillaApp {
    constructor() {
        this.resources = this.loadResources();
        this.comments = this.loadComments();
        this.initializeApp();
    }

    // Load resources from localStorage
    loadResources() {
        const stored = localStorage.getItem('notezilla_resources');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Initialize with sample data
        const sampleResources = [
            {
                id: '1',
                title: 'Database Management Systems - T2 Question Paper',
                description: 'Mid-term exam questions covering normalization, SQL queries, and transaction management.',
                fileName: 'DBMS_T2_2024.pdf',
                fileUrl: '#',
                fileSize: '2.4 MB',
                fileType: 'PDF',
                year: '2nd Year',
                semester: 'Semester 3',
                subject: 'Database Management Systems',
                examType: 'T2',
                uploaderId: '1',
                uploaderName: 'John Doe',
                uploadDate: '2024-01-15',
                downloadCount: 142,
                likes: 23,
                isApproved: true,
                tags: ['DBMS', 'SQL', 'Normalization']
            },
            {
                id: '2',
                title: 'Data Structures Lab Manual',
                description: 'Complete lab manual with implementations of stacks, queues, linked lists, and trees.',
                fileName: 'DS_Lab_Manual.pdf',
                fileUrl: '#',
                fileSize: '5.8 MB',
                fileType: 'PDF',
                year: '2nd Year',
                semester: 'Semester 2',
                subject: 'Data Structures',
                examType: 'Lab',
                uploaderId: '2',
                uploaderName: 'Admin User',
                uploadDate: '2024-01-10',
                downloadCount: 89,
                likes: 31,
                isApproved: true,
                tags: ['Data Structures', 'C++', 'Algorithms']
            },
            {
                id: '3',
                title: 'Operating Systems Summative Notes',
                description: 'Comprehensive notes covering process management, memory management, and file systems.',
                fileName: 'OS_Summative_Notes.pdf',
                fileUrl: '#',
                fileSize: '3.2 MB',
                fileType: 'PDF',
                year: '3rd Year',
                semester: 'Semester 5',
                subject: 'Operating Systems',
                examType: 'Summative',
                uploaderId: '1',
                uploaderName: 'John Doe',
                uploadDate: '2024-01-20',
                downloadCount: 76,
                likes: 18,
                isApproved: true,
                tags: ['OS', 'Process', 'Memory Management']
            },
            {
                id: '4',
                title: 'Computer Networks T1 Solutions',
                description: 'Solved question paper with detailed explanations for network protocols and OSI model.',
                fileName: 'CN_T1_Solutions.pdf',
                fileUrl: '#',
                fileSize: '1.9 MB',
                fileType: 'PDF',
                year: '3rd Year',
                semester: 'Semester 6',
                subject: 'Computer Networks',
                examType: 'T1',
                uploaderId: '3',
                uploaderName: 'Jane Smith',
                uploadDate: '2024-01-18',
                downloadCount: 54,
                likes: 12,
                isApproved: true,
                tags: ['Networks', 'OSI', 'TCP/IP']
            },
            {
                id: '5',
                title: 'Software Engineering Project Report Template',
                description: 'Professional template for final year project reports with proper formatting and sections.',
                fileName: 'SE_Project_Template.docx',
                fileUrl: '#',
                fileSize: '234 KB',
                fileType: 'DOCX',
                year: '4th Year',
                semester: 'Semester 8',
                subject: 'Software Engineering',
                examType: 'Project',
                uploaderId: '2',
                uploaderName: 'Admin User',
                uploadDate: '2024-01-12',
                downloadCount: 95,
                likes: 28,
                isApproved: true,
                tags: ['Software Engineering', 'Project', 'Template']
            },
            {
                id: '6',
                title: 'Machine Learning Algorithms Presentation',
                description: 'PowerPoint presentation covering linear regression, decision trees, and neural networks.',
                fileName: 'ML_Algorithms.pptx',
                fileUrl: '#',
                fileSize: '8.7 MB',
                fileType: 'PPTX',
                year: '4th Year',
                semester: 'Semester 7',
                subject: 'Machine Learning',
                examType: 'Presentation',
                uploaderId: '1',
                uploaderName: 'John Doe',
                uploadDate: '2024-01-25',
                downloadCount: 67,
                likes: 21,
                isApproved: true,
                tags: ['ML', 'AI', 'Algorithms']
            }
        ];
        
        this.saveResources(sampleResources);
        return sampleResources;
    }

    // Save resources to localStorage
    saveResources(resources = null) {
        const resourcesToSave = resources || this.resources;
        localStorage.setItem('notezilla_resources', JSON.stringify(resourcesToSave));
    }

    // Load comments from localStorage
    loadComments() {
        const stored = localStorage.getItem('notezilla_comments');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Initialize with sample comments
        const sampleComments = [
            {
                id: '1',
                resourceId: '1',
                userId: '2',
                userName: 'Admin User',
                content: 'Great resource! The explanations are very clear and helped me understand normalization better.',
                timestamp: '2024-01-16T10:30:00Z',
                likes: 5,
                dislikes: 0
            },
            {
                id: '2',
                resourceId: '1',
                userId: '3',
                userName: 'Jane Smith',
                content: 'Question 3 seems to have an error in the answer. Can someone verify?',
                timestamp: '2024-01-17T14:20:00Z',
                likes: 2,
                dislikes: 0
            },
            {
                id: '3',
                resourceId: '2',
                userId: '1',
                userName: 'John Doe',
                content: 'The tree implementation example on page 15 is particularly helpful. Thanks for sharing!',
                timestamp: '2024-01-11T16:45:00Z',
                likes: 8,
                dislikes: 0
            }
        ];
        
        this.saveComments(sampleComments);
        return sampleComments;
    }

    // Save comments to localStorage
    saveComments(comments = null) {
        const commentsToSave = comments || this.comments;
        localStorage.setItem('notezilla_comments', JSON.stringify(commentsToSave));
    }

    // Initialize the application
    initializeApp() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeNavigation();
            this.initializeMobileMenu();
            this.initializeScrollEffects();
            this.populateHomePage();
        });
    }

    // Initialize navigation highlighting
    initializeNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Initialize mobile menu
    initializeMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
    }

    // Initialize scroll effects
    initializeScrollEffects() {
        const navbar = document.getElementById('navbar');
        
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-card, .resource-card, .stat-card');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Populate home page with dynamic content
    populateHomePage() {
        this.updateStats();
        this.populatePopularResources();
    }

    // Update statistics on home page
    updateStats() {
        const totalResourcesEl = document.getElementById('totalResources');
        const totalUsersEl = document.getElementById('totalUsers');
        const totalDownloadsEl = document.getElementById('totalDownloads');

        if (totalResourcesEl) {
            totalResourcesEl.textContent = this.resources.length.toLocaleString();
        }
        
        if (totalUsersEl) {
            // Get total users from auth system
            const users = JSON.parse(localStorage.getItem('notezilla_users') || '[]');
            totalUsersEl.textContent = users.length.toLocaleString();
        }
        
        if (totalDownloadsEl) {
            const totalDownloads = this.resources.reduce((sum, resource) => sum + resource.downloadCount, 0);
            totalDownloadsEl.textContent = totalDownloads.toLocaleString();
        }
    }

    // Populate popular resources section
    populatePopularResources() {
        const container = document.getElementById('popularResourcesGrid');
        if (!container) return;

        // Sort resources by download count and take top 6
        const popularResources = [...this.resources]
            .sort((a, b) => b.downloadCount - a.downloadCount)
            .slice(0, 6);

        container.innerHTML = popularResources.map(resource => this.createResourceCard(resource)).join('');
    }

    // Create resource card HTML
    createResourceCard(resource) {
        const fileTypeIcon = this.getFileTypeIcon(resource.fileType);
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        return `
            <div class="resource-card">
                <div class="resource-header">
                    <h3 class="resource-title">${resource.title}</h3>
                    <div class="resource-meta">
                        <span class="resource-badge">${resource.year}</span>
                        <span class="resource-badge">${resource.semester}</span>
                        <span class="resource-badge">${resource.examType}</span>
                        <span class="resource-badge">${resource.fileType}</span>
                    </div>
                </div>
                
                <div class="resource-body">
                    <p class="resource-description">${resource.description}</p>
                </div>
                
                <div class="resource-footer">
                    <div class="resource-stats">
                        <div class="resource-stat">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7,10 12,15 17,10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            ${resource.downloadCount}
                        </div>
                        <div class="resource-stat">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            ${resource.likes}
                        </div>
                        <div class="resource-stat">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            ${formatDate(resource.uploadDate)}
                        </div>
                    </div>
                    <a href="resource.html?id=${resource.id}" class="btn btn-primary">View</a>
                </div>
            </div>
        `;
    }

    // Get file type icon
    getFileTypeIcon(fileType) {
        const icons = {
            'PDF': 'file-text',
            'DOCX': 'file-text',
            'PPTX': 'presentation',
            'JPG': 'image',
            'PNG': 'image'
        };
        return icons[fileType] || 'file';
    }

    // Get resources with filtering
    getResources(filters = {}) {
        let filtered = [...this.resources];

        if (filters.year) {
            filtered = filtered.filter(r => r.year === filters.year);
        }
        
        if (filters.semester) {
            filtered = filtered.filter(r => r.semester === filters.semester);
        }
        
        if (filters.subject) {
            filtered = filtered.filter(r => r.subject === filters.subject);
        }
        
        if (filters.examType) {
            filtered = filtered.filter(r => r.examType === filters.examType);
        }
        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(r => 
                r.title.toLowerCase().includes(searchTerm) ||
                r.description.toLowerCase().includes(searchTerm) ||
                r.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        return filtered;
    }

    // Get resource by ID
    getResourceById(id) {
        return this.resources.find(r => r.id === id);
    }

    // Add new resource
    addResource(resourceData) {
        const newResource = {
            id: Date.now().toString(),
            ...resourceData,
            uploadDate: new Date().toISOString(),
            downloadCount: 0,
            likes: 0,
            isApproved: false
        };
        
        this.resources.push(newResource);
        this.saveResources();
        return newResource;
    }

    // Get comments for a resource
    getComments(resourceId) {
        return this.comments.filter(c => c.resourceId === resourceId);
    }

    // Add comment
    addComment(commentData) {
        const newComment = {
            id: Date.now().toString(),
            ...commentData,
            timestamp: new Date().toISOString(),
            likes: 0,
            dislikes: 0
        };
        
        this.comments.push(newComment);
        this.saveComments();
        return newComment;
    }
}

// Initialize the application
const app = new NotezillaApp();

// Global app functions
window.getResources = (filters) => app.getResources(filters);
window.getResourceById = (id) => app.getResourceById(id);
window.addResource = (data) => app.addResource(data);
window.getComments = (resourceId) => app.getComments(resourceId);
window.addComment = (data) => app.addComment(data);