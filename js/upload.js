// Upload page functionality
class UploadPage {
    constructor() {
        this.selectedFile = null;
        this.tags = [];
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/jpg',
            'image/png'
        ];
        
        this.initializePage();
    }

    // Initialize the upload page
    initializePage() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.checkAuthStatus();
        });
    }

    // Check if user is authenticated
    checkAuthStatus() {
        const user = getCurrentUser();
        if (!user) {
            // Redirect to login if not authenticated
            window.location.href = 'login.html?redirect=upload.html';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // File upload area
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('fileInput');

        if (fileUploadArea && fileInput) {
            // Click to upload
            fileUploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            // Drag and drop
            fileUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.classList.add('dragover');
            });

            fileUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('dragover');
            });

            fileUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileSelect(files[0]);
                }
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelect(e.target.files[0]);
                }
            });
        }

        // Tags input
        const tagsInput = document.getElementById('tagsInput');
        if (tagsInput) {
            tagsInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTag(tagsInput.value.trim());
                    tagsInput.value = '';
                }
            });

            tagsInput.addEventListener('blur', () => {
                if (tagsInput.value.trim()) {
                    this.addTag(tagsInput.value.trim());
                    tagsInput.value = '';
                }
            });
        }

        // Form submission
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }

        // Save draft button
        const saveDraftBtn = document.getElementById('saveDraftBtn');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => {
                this.saveDraft();
            });
        }
    }

    // Handle file selection
    handleFileSelect(file) {
        // Validate file type
        if (!this.allowedTypes.includes(file.type)) {
            alert('Invalid file type. Please select a PDF, DOC, PPT, or image file.');
            return;
        }

        // Validate file size
        if (file.size > this.maxFileSize) {
            alert('File is too large. Maximum size allowed is 10MB.');
            return;
        }

        this.selectedFile = file;
        this.displayFilePreview(file);
    }

    // Display file preview
    displayFilePreview(file) {
        const filePreview = document.getElementById('filePreview');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');
        
        if (filePreview && uploadPlaceholder) {
            uploadPlaceholder.style.display = 'none';
            filePreview.style.display = 'block';
            
            const fileSize = this.formatFileSize(file.size);
            const fileType = this.getFileType(file.type);
            const fileIcon = this.getFileIcon(file.type);

            filePreview.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        ${fileIcon}
                    </div>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${fileType} • ${fileSize}</p>
                    </div>
                    <button type="button" class="btn btn-outline btn-sm" onclick="uploadPage.removeFile()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Remove
                    </button>
                </div>
            `;
        }
    }

    // Remove selected file
    removeFile() {
        this.selectedFile = null;
        const filePreview = document.getElementById('filePreview');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');
        const fileInput = document.getElementById('fileInput');
        
        if (filePreview && uploadPlaceholder && fileInput) {
            filePreview.style.display = 'none';
            uploadPlaceholder.style.display = 'block';
            fileInput.value = '';
        }
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Get file type display name
    getFileType(mimeType) {
        const types = {
            'application/pdf': 'PDF',
            'application/msword': 'DOC',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
            'application/vnd.ms-powerpoint': 'PPT',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
            'image/jpeg': 'JPEG',
            'image/jpg': 'JPG',
            'image/png': 'PNG'
        };
        return types[mimeType] || 'File';
    }

    // Get file icon SVG
    getFileIcon(mimeType) {
        if (mimeType.startsWith('image/')) {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
            </svg>`;
        } else if (mimeType.includes('presentation')) {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>`;
        } else {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
            </svg>`;
        }
    }

    // Add tag
    addTag(tagText) {
        if (!tagText || this.tags.includes(tagText) || this.tags.length >= 10) {
            return;
        }

        this.tags.push(tagText);
        this.updateTagsDisplay();
        this.updateHiddenTagsInput();
    }

    // Remove tag
    removeTag(tagText) {
        this.tags = this.tags.filter(tag => tag !== tagText);
        this.updateTagsDisplay();
        this.updateHiddenTagsInput();
    }

    // Update tags display
    updateTagsDisplay() {
        const tagsList = document.getElementById('tagsList');
        if (!tagsList) return;

        tagsList.innerHTML = this.tags.map(tag => `
            <div class="tag">
                ${tag}
                <button type="button" class="tag-remove" onclick="uploadPage.removeTag('${tag}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    // Update hidden tags input
    updateHiddenTagsInput() {
        const tagsInput = document.getElementById('tags');
        if (tagsInput) {
            tagsInput.value = this.tags.join(',');
        }
    }

    // Validate form
    validateForm(formData) {
        const errors = {};

        // Check if file is selected
        if (!this.selectedFile) {
            errors.file = 'Please select a file to upload';
        }

        // Validate required fields
        const requiredFields = ['title', 'description', 'year', 'semester', 'subject', 'examType'];
        requiredFields.forEach(field => {
            if (!formData.get(field)?.trim()) {
                errors[field] = 'This field is required';
            }
        });

        // Validate checkboxes
        const requiredCheckboxes = ['originalContent', 'communityGuidelines', 'moderationProcess'];
        requiredCheckboxes.forEach(field => {
            if (!formData.get(field)) {
                errors[field] = 'You must agree to this requirement';
            }
        });

        return errors;
    }

    // Display validation errors
    displayErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });

        // Display new errors
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${field}Error`);
            if (errorElement) {
                errorElement.textContent = errors[field];
            }
        });
    }

    // Handle form submission
    async handleSubmit(e) {
        const formData = new FormData(e.target);
        const errors = this.validateForm(formData);

        if (Object.keys(errors).length > 0) {
            this.displayErrors(errors);
            return;
        }

        const uploadBtn = document.getElementById('uploadBtn');
        const btnText = uploadBtn.querySelector('.btn-text');
        const loading = uploadBtn.querySelector('.loading');

        // Show loading state
        btnText.classList.add('hidden');
        loading.classList.remove('hidden');
        uploadBtn.disabled = true;

        try {
            // Simulate upload process
            await this.uploadFile(formData);
            
            // Show success message
            this.showSuccessMessage('Resource uploaded successfully! It will be reviewed and published shortly.');
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            alert('Upload failed. Please try again.');
        } finally {
            // Hide loading state
            btnText.classList.remove('hidden');
            loading.classList.add('hidden');
            uploadBtn.disabled = false;
        }
    }

    // Upload file (simulated)
    async uploadFile(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = getCurrentUser();
                
                const resourceData = {
                    title: formData.get('title'),
                    description: formData.get('description'),
                    fileName: this.selectedFile.name,
                    fileUrl: '#', // Would be actual file URL in real implementation
                    fileSize: this.formatFileSize(this.selectedFile.size),
                    fileType: this.getFileType(this.selectedFile.type),
                    year: formData.get('year'),
                    semester: formData.get('semester'),
                    subject: formData.get('subject'),
                    examType: formData.get('examType'),
                    uploaderId: user?.id || '1',
                    uploaderName: user?.name || 'Anonymous',
                    tags: this.tags,
                    isApproved: false // Requires admin approval
                };

                // Add resource to storage
                addResource(resourceData);
                
                resolve();
            }, 2000);
        });
    }

    // Save draft
    saveDraft() {
        const form = document.getElementById('uploadForm');
        const formData = new FormData(form);
        
        const draftData = {
            title: formData.get('title') || '',
            description: formData.get('description') || '',
            year: formData.get('year') || '',
            semester: formData.get('semester') || '',
            subject: formData.get('subject') || '',
            examType: formData.get('examType') || '',
            tags: this.tags,
            fileName: this.selectedFile?.name || '',
            savedAt: new Date().toISOString()
        };

        localStorage.setItem('notezilla_upload_draft', JSON.stringify(draftData));
        
        // Show temporary success message
        const saveDraftBtn = document.getElementById('saveDraftBtn');
        const originalText = saveDraftBtn.innerHTML;
        saveDraftBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            Saved!
        `;
        saveDraftBtn.disabled = true;

        setTimeout(() => {
            saveDraftBtn.innerHTML = originalText;
            saveDraftBtn.disabled = false;
        }, 2000);
    }

    // Load draft
    loadDraft() {
        const draftData = localStorage.getItem('notezilla_upload_draft');
        if (!draftData) return;

        try {
            const draft = JSON.parse(draftData);
            
            // Populate form fields
            const fields = ['title', 'description', 'year', 'semester', 'subject', 'examType'];
            fields.forEach(field => {
                const element = document.getElementById(field);
                if (element && draft[field]) {
                    element.value = draft[field];
                }
            });

            // Restore tags
            if (draft.tags && draft.tags.length > 0) {
                this.tags = [...draft.tags];
                this.updateTagsDisplay();
                this.updateHiddenTagsInput();
            }

            // Show notification
            if (confirm('A draft was found. Would you like to restore it?')) {
                // Draft is already loaded
            } else {
                localStorage.removeItem('notezilla_upload_draft');
            }
            
        } catch (error) {
            console.error('Error loading draft:', error);
            localStorage.removeItem('notezilla_upload_draft');
        }
    }

    // Show success message
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--space-2);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1.25rem; height: 1.25rem;">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                ${message}
            </div>
        `;

        const form = document.getElementById('uploadForm');
        form.insertBefore(successDiv, form.firstChild);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Reset form
    resetForm() {
        const form = document.getElementById('uploadForm');
        form.reset();
        
        this.selectedFile = null;
        this.tags = [];
        
        this.removeFile();
        this.updateTagsDisplay();
        this.updateHiddenTagsInput();
        
        // Clear draft
        localStorage.removeItem('notezilla_upload_draft');
    }
}

// Initialize upload page
const uploadPage = new UploadPage();

// Load draft on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        uploadPage.loadDraft();
    }, 1000);
});