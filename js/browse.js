// Browse page functionality
class BrowsePage {
    constructor() {
        this.currentFilters = {
            search: '',
            year: '',
            semester: '',
            subject: '',
            examType: ''
        };
        this.currentSort = 'newest';
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.allResources = [];
        this.filteredResources = [];
        
        this.initializePage();
    }

    // Initialize the browse page
    initializePage() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadResources();
            this.populateSubjects();
            this.setupEventListeners();
            this.applyFilters();
        });
    }

    // Load all resources
    loadResources() {
        this.allResources = getResources();
        this.filteredResources = [...this.allResources];
    }

    // Populate subjects dropdown based on available resources
    populateSubjects() {
        const subjectFilter = document.getElementById('subjectFilter');
        if (!subjectFilter) return;

        const subjects = [...new Set(this.allResources.map(r => r.subject))].sort();
        
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectFilter.appendChild(option);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.updateClearSearchVisibility();
            });
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.currentFilters.search = '';
                this.currentPage = 1;
                this.applyFilters();
                this.updateClearSearchVisibility();
            });
        }

        // Filter dropdowns
        const filterInputs = ['yearFilter', 'semesterFilter', 'subjectFilter', 'examTypeFilter'];
        filterInputs.forEach(filterId => {
            const filterElement = document.getElementById(filterId);
            if (filterElement) {
                filterElement.addEventListener('change', (e) => {
                    const filterKey = filterId.replace('Filter', '');
                    this.currentFilters[filterKey] = e.target.value;
                    this.currentPage = 1;
                    this.applyFilters();
                });
            }
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        // View toggle
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        if (gridView && listView) {
            gridView.addEventListener('click', () => {
                this.setView('grid');
            });
            
            listView.addEventListener('click', () => {
                this.setView('list');
            });
        }

        // Clear filters
        const clearFilters = document.getElementById('clearFilters');
        const clearFiltersFromEmpty = document.getElementById('clearFiltersFromEmpty');
        
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
        
        if (clearFiltersFromEmpty) {
            clearFiltersFromEmpty.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    // Update clear search button visibility
    updateClearSearchVisibility() {
        const clearSearch = document.getElementById('clearSearch');
        const searchInput = document.getElementById('searchInput');
        
        if (clearSearch && searchInput) {
            clearSearch.style.display = searchInput.value ? 'flex' : 'none';
        }
    }

    // Apply current filters and sorting
    applyFilters() {
        // Show loading state
        this.showLoading(true);
        
        // Simulate async filtering (for smooth UX)
        setTimeout(() => {
            // Filter resources
            this.filteredResources = this.allResources.filter(resource => {
                return this.matchesFilters(resource);
            });

            // Sort resources
            this.sortResources();

            // Update UI
            this.updateResultsCount();
            this.renderResources();
            this.renderPagination();
            this.showLoading(false);
        }, 300);
    }

    // Check if resource matches current filters
    matchesFilters(resource) {
        // Search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            const matchesSearch = 
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.subject.toLowerCase().includes(searchTerm) ||
                resource.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            if (!matchesSearch) return false;
        }

        // Year filter
        if (this.currentFilters.year && resource.year !== this.currentFilters.year) {
            return false;
        }

        // Semester filter
        if (this.currentFilters.semester && resource.semester !== this.currentFilters.semester) {
            return false;
        }

        // Subject filter
        if (this.currentFilters.subject && resource.subject !== this.currentFilters.subject) {
            return false;
        }

        // Exam type filter
        if (this.currentFilters.examType && resource.examType !== this.currentFilters.examType) {
            return false;
        }

        return true;
    }

    // Sort filtered resources
    sortResources() {
        this.filteredResources.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.uploadDate) - new Date(a.uploadDate);
                case 'oldest':
                    return new Date(a.uploadDate) - new Date(b.uploadDate);
                case 'most-downloaded':
                    return b.downloadCount - a.downloadCount;
                case 'most-liked':
                    return b.likes - a.likes;
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
    }

    // Update results count
    updateResultsCount() {
        const resultCount = document.getElementById('resultCount');
        if (resultCount) {
            resultCount.textContent = this.filteredResources.length;
        }
    }

    // Render resources
    renderResources() {
        const container = document.getElementById('resourcesGrid');
        if (!container) return;

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageResources = this.filteredResources.slice(startIndex, endIndex);

        // Clear container
        container.innerHTML = '';

        // Apply view class
        container.className = `resources-grid ${this.currentView}-view`;

        if (pageResources.length === 0) {
            this.showEmptyState(true);
            return;
        }

        this.showEmptyState(false);

        // Render resource cards
        pageResources.forEach((resource, index) => {
            const card = this.createResourceCard(resource);
            container.appendChild(card);
            
            // Animate cards
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 50);
        });
    }

    // Create resource card element
    createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = `resource-card ${this.currentView}-view`;
        
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        const fileTypeIcon = this.getFileTypeIcon(resource.fileType);

        card.innerHTML = `
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
                <div class="resource-tags">
                    ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
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
                            <circle cx="12" cy="12" r="4"></circle>
                            <path d="M16 8v5a3 3 0 0 0 6 0v-5a4 4 0 1 0-8 8v-1a2 2 0 1 1 4 0"></path>
                        </svg>
                        ${resource.fileSize}
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
                <div class="resource-actions">
                    <button class="btn btn-outline btn-sm" onclick="downloadResource('${resource.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7,10 12,15 17,10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download
                    </button>
                    <a href="resource.html?id=${resource.id}" class="btn btn-primary btn-sm">
                        View Details
                    </a>
                </div>
            </div>
        `;

        return card;
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

    // Render pagination
    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;

        const totalPages = Math.ceil(this.filteredResources.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const pagination = [];

        // Previous button
        pagination.push(`
            <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" ${this.currentPage === 1 ? 'disabled' : ''} onclick="browsePage.goToPage(${this.currentPage - 1})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
            </button>
        `);

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pagination.push(`<button class="pagination-btn" onclick="browsePage.goToPage(1)">1</button>`);
            if (startPage > 2) {
                pagination.push(`<span class="pagination-ellipsis">...</span>`);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination.push(`
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="browsePage.goToPage(${i})">
                    ${i}
                </button>
            `);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pagination.push(`<span class="pagination-ellipsis">...</span>`);
            }
            pagination.push(`<button class="pagination-btn" onclick="browsePage.goToPage(${totalPages})">${totalPages}</button>`);
        }

        // Next button
        pagination.push(`
            <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="browsePage.goToPage(${this.currentPage + 1})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
            </button>
        `);

        // Pagination info
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredResources.length);
        
        pagination.push(`
            <div class="pagination-info">
                Showing ${startItem}-${endItem} of ${this.filteredResources.length} resources
            </div>
        `);

        container.innerHTML = pagination.join('');
    }

    // Go to specific page
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredResources.length / this.itemsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderResources();
        this.renderPagination();
        
        // Scroll to top of results
        document.querySelector('.results-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Set view mode
    setView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Re-render resources with new view
        this.renderResources();
    }

    // Clear all filters
    clearAllFilters() {
        // Reset filters
        this.currentFilters = {
            search: '',
            year: '',
            semester: '',
            subject: '',
            examType: ''
        };
        this.currentPage = 1;

        // Reset form elements
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';

        const filterSelects = ['yearFilter', 'semesterFilter', 'subjectFilter', 'examTypeFilter'];
        filterSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) select.value = '';
        });

        this.updateClearSearchVisibility();
        this.applyFilters();
    }

    // Show/hide loading state
    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        const resourcesGrid = document.getElementById('resourcesGrid');
        
        if (loadingState) {
            loadingState.style.display = show ? 'flex' : 'none';
        }
        
        if (resourcesGrid) {
            resourcesGrid.style.opacity = show ? '0.5' : '1';
        }
    }

    // Show/hide empty state
    showEmptyState(show) {
        const emptyState = document.getElementById('emptyState');
        const resourcesGrid = document.getElementById('resourcesGrid');
        
        if (emptyState) {
            emptyState.style.display = show ? 'flex' : 'none';
        }
        
        if (resourcesGrid) {
            resourcesGrid.style.display = show ? 'none' : 'grid';
        }
    }
}

// Global function for downloading resources
window.downloadResource = function(resourceId) {
    const resource = getResourceById(resourceId);
    if (resource) {
        // Simulate download (in real app, this would trigger actual download)
        alert(`Downloading: ${resource.title}\nFile: ${resource.fileName}\nSize: ${resource.fileSize}`);
        
        // Update download count (in real app, this would be handled by backend)
        resource.downloadCount++;
        
        // Update local storage
        const resources = JSON.parse(localStorage.getItem('notezilla_resources') || '[]');
        const resourceIndex = resources.findIndex(r => r.id === resourceId);
        if (resourceIndex !== -1) {
            resources[resourceIndex].downloadCount++;
            localStorage.setItem('notezilla_resources', JSON.stringify(resources));
        }
    }
};

// Initialize browse page
const browsePage = new BrowsePage();