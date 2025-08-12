// Authentication system with local storage
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.initializeDefaultUsers();
    }

    // Load users from localStorage
    loadUsers() {
        const stored = localStorage.getItem('notezilla_users');
        return stored ? JSON.parse(stored) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('notezilla_users', JSON.stringify(this.users));
    }

    // Load current user from localStorage
    loadCurrentUser() {
        const stored = localStorage.getItem('notezilla_current_user');
        return stored ? JSON.parse(stored) : null;
    }

    // Save current user to localStorage
    saveCurrentUser(user) {
        if (user) {
            localStorage.setItem('notezilla_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('notezilla_current_user');
        }
        this.currentUser = user;
    }

    // Initialize with default users if none exist
    initializeDefaultUsers() {
        if (this.users.length === 0) {
            const defaultUsers = [
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@college.edu',
                    password: 'password123',
                    role: 'student',
                    college: 'MIT College of Engineering',
                    createdAt: new Date('2024-01-15').toISOString(),
                    uploadCount: 5,
                    downloadCount: 23
                },
                {
                    id: '2',
                    name: 'Admin User',
                    email: 'admin@college.edu',
                    password: 'admin123',
                    role: 'admin',
                    college: 'MIT College of Engineering',
                    createdAt: new Date('2023-12-01').toISOString(),
                    uploadCount: 12,
                    downloadCount: 45
                },
                {
                    id: '3',
                    name: 'Jane Smith',
                    email: 'jane@college.edu',
                    password: 'password123',
                    role: 'moderator',
                    college: 'Stanford University',
                    createdAt: new Date('2024-02-10').toISOString(),
                    uploadCount: 8,
                    downloadCount: 34
                }
            ];
            
            this.users = defaultUsers;
            this.saveUsers();
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Hash password (simple implementation for demo)
    hashPassword(password) {
        // In a real app, use proper hashing like bcrypt
        return btoa(password + 'notezilla_salt');
    }

    // Verify password
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    // Login user
    async login(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = this.users.find(u => u.email === email);
                
                if (user && this.verifyPassword(password, user.password)) {
                    const userWithoutPassword = { ...user };
                    delete userWithoutPassword.password;
                    this.saveCurrentUser(userWithoutPassword);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 1000); // Simulate network delay
        });
    }

    // Register new user
    async register(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Check if user already exists
                const existingUser = this.users.find(u => u.email === userData.email);
                if (existingUser) {
                    resolve(false);
                    return;
                }

                // Create new user
                const newUser = {
                    id: this.generateId(),
                    name: userData.name,
                    email: userData.email,
                    password: this.hashPassword(userData.password),
                    role: userData.role || 'student',
                    college: userData.college,
                    createdAt: new Date().toISOString(),
                    uploadCount: 0,
                    downloadCount: 0
                };

                this.users.push(newUser);
                this.saveUsers();

                // Auto-login after registration
                const userWithoutPassword = { ...newUser };
                delete userWithoutPassword.password;
                this.saveCurrentUser(userWithoutPassword);
                
                resolve(true);
            }, 1500); // Simulate network delay
        });
    }

    // Logout user
    logout() {
        this.saveCurrentUser(null);
        window.location.href = 'index.html';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Update user profile
    async updateProfile(updates) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!this.currentUser) {
                    resolve(false);
                    return;
                }

                // Update user in users array
                const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
                if (userIndex !== -1) {
                    this.users[userIndex] = { ...this.users[userIndex], ...updates };
                    this.saveUsers();

                    // Update current user
                    const updatedUser = { ...this.users[userIndex] };
                    delete updatedUser.password;
                    this.saveCurrentUser(updatedUser);
                }

                resolve(true);
            }, 800);
        });
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!this.currentUser) {
                    resolve(false);
                    return;
                }

                const user = this.users.find(u => u.id === this.currentUser.id);
                if (!user || !this.verifyPassword(currentPassword, user.password)) {
                    resolve(false);
                    return;
                }

                user.password = this.hashPassword(newPassword);
                this.saveUsers();
                resolve(true);
            }, 800);
        });
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Global auth functions
window.login = (email, password) => authSystem.login(email, password);
window.register = (userData) => authSystem.register(userData);
window.logout = () => authSystem.logout();
window.getCurrentUser = () => authSystem.getCurrentUser();
window.isLoggedIn = () => authSystem.isLoggedIn();
window.updateProfile = (updates) => authSystem.updateProfile(updates);
window.changePassword = (current, newPassword) => authSystem.changePassword(current, newPassword);

// Update UI based on auth state
function updateAuthUI() {
    const user = getCurrentUser();
    const userMenu = document.getElementById('userMenu');
    const authButtons = document.getElementById('authButtons');
    
    if (user && userMenu && authButtons) {
        userMenu.style.display = 'block';
        authButtons.style.display = 'none';
        
        // Update user avatar with initials
        const avatar = document.getElementById('userAvatar');
        if (avatar) {
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            avatar.innerHTML = `<span style="font-weight: 600; font-size: 0.875rem;">${initials}</span>`;
        }
    } else if (userMenu && authButtons) {
        userMenu.style.display = 'none';
        authButtons.style.display = 'flex';
    }
}

// Logout button handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    updateAuthUI();
});

// Update auth UI when user changes
window.addEventListener('storage', updateAuthUI);