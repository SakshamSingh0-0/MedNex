/**
 * HealthAI+ - AI-Driven Integrated Healthcare Platform
 * Main JavaScript File
 */

// ============================================
// Global State Management
// ============================================
const AppState = {
    currentUser: null,
    theme: localStorage.getItem('theme') || 'light',
    chatHistory: [],
    selectedSymptoms: [],
    notifications: [],
    activeSection: 'home'
};

// ============================================
// Utility Functions
// ============================================
const Utils = {
    // Show loading overlay
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    },

    // Hide loading overlay
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#00B894' : type === 'error' ? '#FF6B6B' : '#0066CC'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format time
    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Generate UUID
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// Navigation Management
// ============================================
const Navigation = {
    init() {
        // Navbar scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scroll to sections
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    },

    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active section
        document.querySelectorAll('section').forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                this.setActiveLink(section.id);
            }
        });
    },

    handleNavClick(e) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Close mobile menu
        document.getElementById('navMenu').classList.remove('active');
    },

    setActiveLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
};

// ============================================
// Theme Management
// ============================================
const ThemeManager = {
    init() {
        this.applyTheme(AppState.theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    toggleTheme() {
        AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(AppState.theme);
        localStorage.setItem('theme', AppState.theme);
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
};

// ============================================
// Health Analytics Chart
// ============================================
const HealthAnalytics = {
    chart: null,
    
    init() {
        this.renderChart('heart');
        
        const chartSelector = document.getElementById('chartSelector');
        if (chartSelector) {
            chartSelector.addEventListener('change', (e) => {
                this.renderChart(e.target.value);
            });
        }
    },

    renderChart(type) {
        const ctx = document.getElementById('healthChart');
        if (!ctx) return;

        const datasets = {
            heart: {
                label: 'Heart Rate (bpm)',
                data: [68, 72, 70, 75, 71, 72, 69, 73, 72, 70, 74, 72],
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                min: 60,
                max: 100
            },
            pressure: {
                label: 'Blood Pressure (mmHg)',
                data: [118, 120, 119, 121, 120, 122, 119, 120, 121, 120, 119, 120],
                borderColor: '#6C5CE7',
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                min: 90,
                max: 140
            },
            weight: {
                label: 'Weight (lbs)',
                data: [165, 164, 165, 163, 164, 163, 162, 163, 162, 161, 162, 161],
                borderColor: '#00B894',
                backgroundColor: 'rgba(0, 184, 148, 0.1)',
                min: 150,
                max: 180
            },
            steps: {
                label: 'Daily Steps',
                data: [8500, 9200, 7800, 10500, 9800, 11200, 8900, 9500, 10200, 9800, 10800, 9500],
                borderColor: '#FFA502',
                backgroundColor: 'rgba(255, 165, 2, 0.1)',
                min: 0,
                max: 15000
            }
        };

        const config = datasets[type];

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: config.label,
                    data: config.data,
                    borderColor: config.borderColor,
                    backgroundColor: config.backgroundColor,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: config.borderColor,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: config.min,
                        max: config.max,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
};

// ============================================
// AI Symptom Checker
// ============================================
const SymptomChecker = {
    selectedSymptoms: [],
    
    init() {
        // Symptom tag selection
        document.querySelectorAll('.symptom-tag').forEach(tag => {
            tag.addEventListener('click', (e) => this.toggleSymptom(e));
        });

        // Analyze symptoms button
        const analyzeBtn = document.getElementById('analyzeSymptoms');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeSymptoms());
        }

        // Check again button
        const checkAgainBtn = document.getElementById('checkAgain');
        if (checkAgainBtn) {
            checkAgainBtn.addEventListener('click', () => this.resetChecker());
        }

        // Book from symptoms
        const bookBtn = document.getElementById('bookFromSymptoms');
        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                Utils.showNotification('Redirecting to appointment booking...', 'success');
                setTimeout(() => {
                    document.querySelector('[data-action="book-appointment"]').click();
                }, 1000);
            });
        }

        // Feature card actions
        document.querySelectorAll('.feature-card[data-feature="symptom-checker"]').forEach(card => {
            card.addEventListener('click', () => {
                document.getElementById('symptomChecker').scrollIntoView({ behavior: 'smooth' });
            });
        });
    },

    toggleSymptom(e) {
        const tag = e.currentTarget;
        const symptom = tag.dataset.symptom;
        
        tag.classList.toggle('selected');
        
        if (this.selectedSymptoms.includes(symptom)) {
            this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symptom);
        } else {
            this.selectedSymptoms.push(symptom);
        }
    },

    async analyzeSymptoms() {
        if (this.selectedSymptoms.length === 0) {
            Utils.showNotification('Please select at least one symptom', 'error');
            return;
        }

        const details = document.getElementById('symptomDetails').value;

        Utils.showLoading();

        // Simulate AI analysis
        setTimeout(() => {
            Utils.hideLoading();
            this.showResults(this.selectedSymptoms, details);
        }, 2000);
    },

    showResults(symptoms, details) {
        const resultsSection = document.getElementById('symptomResults');
        const resultsContent = document.getElementById('resultsContent');
        
        // Hide form
        document.querySelector('.symptom-step').style.display = 'none';
        
        // Generate results based on symptoms
        const analysis = this.generateAnalysis(symptoms);
        
        resultsContent.innerHTML = `
            <div class="result-item" style="padding: 1.5rem; background: #F1F5F9; border-radius: 0.75rem; margin-bottom: 1rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; color: #1E293B;">
                    <i class="fas fa-notes-medical" style="color: #0066CC;"></i>
                    Preliminary Assessment
                </h4>
                <p style="color: #475569; line-height: 1.7;">${analysis.assessment}</p>
            </div>
            
            <div class="result-item" style="padding: 1.5rem; background: #FEF3C7; border-radius: 0.75rem; margin-bottom: 1rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; color: #78350F;">
                    <i class="fas fa-exclamation-triangle" style="color: #FFA502;"></i>
                    Severity Level: ${analysis.severity}
                </h4>
                <p style="color: #92400E; line-height: 1.7;">${analysis.severityInfo}</p>
            </div>
            
            <div class="result-item" style="padding: 1.5rem; background: #DBEAFE; border-radius: 0.75rem; margin-bottom: 1rem;">
                <h4 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; color: #1E3A8A;">
                    <i class="fas fa-lightbulb" style="color: #0066CC;"></i>
                    Recommendations
                </h4>
                <ul style="list-style: none; padding: 0;">
                    ${analysis.recommendations.map(rec => `
                        <li style="padding: 0.5rem 0; color: #1E40AF; display: flex; align-items: start; gap: 0.5rem;">
                            <i class="fas fa-check-circle" style="color: #00B894; margin-top: 0.25rem;"></i>
                            <span>${rec}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="result-disclaimer" style="padding: 1rem; background: #FEE2E2; border-radius: 0.75rem; border-left: 4px solid #FF6B6B;">
                <p style="font-size: 0.875rem; color: #991B1B;">
                    <strong>Important:</strong> This is an AI-powered preliminary assessment and should not replace professional medical advice. 
                    Please consult with a healthcare provider for accurate diagnosis and treatment.
                </p>
            </div>
        `;
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    },

    generateAnalysis(symptoms) {
        // Simple symptom analysis logic
        const hasChestPain = symptoms.includes('chest-pain');
        const hasShortness = symptoms.includes('shortness');
        const hasFever = symptoms.includes('fever');
        const hasCough = symptoms.includes('cough');
        
        if (hasChestPain || hasShortness) {
            return {
                assessment: 'Your symptoms may indicate a cardiovascular or respiratory condition. Chest pain and shortness of breath should be evaluated promptly by a medical professional.',
                severity: 'High',
                severityInfo: 'These symptoms require immediate medical attention. Please seek urgent care or emergency services.',
                recommendations: [
                    'Seek immediate medical attention',
                    'Call emergency services if symptoms worsen',
                    'Avoid strenuous physical activity',
                    'Monitor your vital signs closely',
                    'Have someone stay with you'
                ]
            };
        } else if (hasFever && hasCough) {
            return {
                assessment: 'Your symptoms suggest a possible respiratory infection such as flu, cold, or other viral/bacterial infection. Rest and hydration are important.',
                severity: 'Moderate',
                severityInfo: 'These symptoms should be monitored. Consult a doctor if they persist for more than 3-5 days or worsen.',
                recommendations: [
                    'Get plenty of rest and sleep',
                    'Stay hydrated with water and fluids',
                    'Take over-the-counter fever reducers if needed',
                    'Monitor your temperature regularly',
                    'Isolate to prevent spreading to others',
                    'Schedule a consultation if symptoms persist'
                ]
            };
        } else {
            return {
                assessment: 'Based on your selected symptoms, you may be experiencing common health issues that are generally manageable with proper self-care and monitoring.',
                severity: 'Low',
                severityInfo: 'Your symptoms appear to be mild. However, if they persist or worsen, please consult a healthcare provider.',
                recommendations: [
                    'Ensure adequate rest and sleep',
                    'Maintain proper hydration',
                    'Eat nutritious, balanced meals',
                    'Take over-the-counter medications as needed',
                    'Monitor your symptoms for any changes',
                    'Consider scheduling a routine check-up'
                ]
            };
        }
    },

    resetChecker() {
        // Reset all selections
        this.selectedSymptoms = [];
        document.querySelectorAll('.symptom-tag').forEach(tag => {
            tag.classList.remove('selected');
        });
        document.getElementById('symptomDetails').value = '';
        
        // Hide results and show form
        document.getElementById('symptomResults').style.display = 'none';
        document.querySelector('.symptom-step').style.display = 'block';
    }
};

// ============================================
// AI Chatbot
// ============================================
const Chatbot = {
    isOpen: false,
    
    init() {
        const trigger = document.getElementById('chatbotTrigger');
        const chatbot = document.getElementById('chatbot');
        const closeBtn = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        if (trigger) {
            trigger.addEventListener('click', () => this.toggleChat());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleChat());
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Quick reply buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                this.handleQuickReply(e.target.textContent);
            }
        });
    },

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatbot = document.getElementById('chatbot');
        const badge = document.querySelector('.chat-badge');
        
        if (this.isOpen) {
            chatbot.classList.add('active');
            if (badge) badge.style.display = 'none';
        } else {
            chatbot.classList.remove('active');
        }
    },

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        // Simulate AI response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    },

    addMessage(text, type) {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${type === 'bot' ? 'fa-robot' : 'fa-user'}"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    handleQuickReply(text) {
        this.addMessage(text, 'user');
        
        setTimeout(() => {
            let response = '';
            
            if (text.includes('Appointment')) {
                response = 'I can help you book an appointment! Please select your preferred specialty: Cardiology, General Medicine, Dermatology, or Pediatrics.';
            } else if (text.includes('Symptoms')) {
                response = 'I\'ll guide you through our AI symptom checker. Let\'s start - what symptoms are you experiencing?';
            } else if (text.includes('Records')) {
                response = 'You can access your medical records securely through the Health Records Vault. Would you like me to navigate you there?';
            }
            
            this.addMessage(response, 'bot');
        }, 800);
    },

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
            return 'I can help you schedule an appointment. What type of doctor would you like to see?';
        } else if (lowerMessage.includes('symptom') || lowerMessage.includes('sick') || lowerMessage.includes('pain')) {
            return 'I recommend using our AI Symptom Checker for a detailed analysis. You can also schedule a consultation with a doctor right away if needed.';
        } else if (lowerMessage.includes('prescription') || lowerMessage.includes('medication')) {
            return 'You can view and manage your prescriptions in the Dashboard. Would you like me to show you your active prescriptions?';
        } else if (lowerMessage.includes('emergency')) {
            return 'For medical emergencies, please call 911 immediately or visit the nearest emergency room. I can show you nearby hospitals if you need.';
        } else if (lowerMessage.includes('record') || lowerMessage.includes('history')) {
            return 'Your medical records are securely stored in your Health Records Vault. You can access all your documents, test results, and visit history there.';
        } else {
            return 'I\'m here to help! You can ask me about appointments, symptoms, prescriptions, medical records, or emergency services. How can I assist you today?';
        }
    }
};

// ============================================
// Dashboard Actions
// ============================================
const Dashboard = {
    init() {
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Feature buttons
        document.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.feature-card');
                const feature = card.dataset.feature;
                this.handleFeatureAction(feature);
            });
        });

        // Load dashboard data
        this.loadDashboardData();
    },

    handleQuickAction(action) {
        switch(action) {
            case 'book-appointment':
                this.bookAppointment();
                break;
            case 'check-symptoms':
                document.getElementById('symptomChecker').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'view-records':
                Utils.showNotification('Opening Health Records Vault...', 'info');
                break;
            case 'chat':
                Chatbot.toggleChat();
                break;
        }
    },

    handleFeatureAction(feature) {
        const sections = {
            'symptom-checker': 'symptomChecker',
            'telemedicine': 'services',
            'health-records': 'dashboard',
            'prescription': 'dashboard',
            'analytics': 'dashboard',
            'emergency': 'emergency'
        };

        const sectionId = sections[feature];
        if (sectionId) {
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        }
    },

    bookAppointment() {
        Utils.showNotification('Appointment booking system opening...', 'success');
        
        // Simulate appointment booking modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; width: 90%;">
                <h3 style="margin-bottom: 1rem; color: #1E293B;">Book an Appointment</h3>
                <form id="appointmentForm">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Select Specialty</label>
                        <select style="width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0; border-radius: 0.5rem;">
                            <option>Cardiology</option>
                            <option>General Medicine</option>
                            <option>Dermatology</option>
                            <option>Pediatrics</option>
                            <option>Orthopedics</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Preferred Date</label>
                        <input type="date" style="width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0; border-radius: 0.5rem;">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Preferred Time</label>
                        <select style="width: 100%; padding: 0.75rem; border: 2px solid #E2E8F0; border-radius: 0.5rem;">
                            <option>9:00 AM</option>
                            <option>10:00 AM</option>
                            <option>11:00 AM</option>
                            <option>2:00 PM</option>
                            <option>3:00 PM</option>
                            <option>4:00 PM</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button type="button" class="modal-close" style="flex: 1; padding: 0.875rem; background: #F1F5F9; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" style="flex: 1; padding: 0.875rem; background: linear-gradient(135deg, #0066CC, #00B894); color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('#appointmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            modal.remove();
            Utils.showNotification('Appointment booked successfully!', 'success');
        });
    },

    async loadDashboardData() {
        // This will be connected to the RESTful API
        // For now, we'll use the static data already in the HTML
        console.log('Dashboard data loaded');
    }
};

// ============================================
// Form Handling
// ============================================
const Forms = {
    init() {
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterForm(e));
        }
    },

    handleContactForm(e) {
        e.preventDefault();
        Utils.showLoading();
        
        setTimeout(() => {
            Utils.hideLoading();
            Utils.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            e.target.reset();
        }, 1500);
    },

    handleNewsletterForm(e) {
        e.preventDefault();
        Utils.showLoading();
        
        setTimeout(() => {
            Utils.hideLoading();
            Utils.showNotification('Successfully subscribed to newsletter!', 'success');
            e.target.reset();
        }, 1000);
    }
};

// ============================================
// Emergency Services
// ============================================
const Emergency = {
    init() {
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.showEmergencyOptions());
        }
    },

    showEmergencyOptions() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 600px; width: 90%;">
                <h2 style="color: #FF6B6B; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-ambulance"></i>
                    Emergency Services
                </h2>
                
                <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
                    <a href="tel:911" style="padding: 1.5rem; background: #FF6B6B; color: white; border-radius: 0.75rem; text-decoration: none; display: flex; align-items: center; gap: 1rem; font-weight: 600; font-size: 1.125rem;">
                        <i class="fas fa-phone-alt" style="font-size: 1.5rem;"></i>
                        <div>
                            <div>Call 911</div>
                            <div style="font-size: 0.875rem; opacity: 0.9;">For immediate emergency</div>
                        </div>
                    </a>
                    
                    <button onclick="alert('Opening nearby hospitals map...')" style="padding: 1.5rem; background: #0066CC; color: white; border: none; border-radius: 0.75rem; display: flex; align-items: center; gap: 1rem; font-weight: 600; font-size: 1.125rem; cursor: pointer; text-align: left;">
                        <i class="fas fa-hospital" style="font-size: 1.5rem;"></i>
                        <div>
                            <div>Nearby Hospitals</div>
                            <div style="font-size: 0.875rem; opacity: 0.9;">Find closest emergency room</div>
                        </div>
                    </button>
                    
                    <button onclick="alert('Accessing your medical profile...')" style="padding: 1.5rem; background: #00B894; color: white; border: none; border-radius: 0.75rem; display: flex; align-items: center; gap: 1rem; font-weight: 600; font-size: 1.125rem; cursor: pointer; text-align: left;">
                        <i class="fas fa-user-md" style="font-size: 1.5rem;"></i>
                        <div>
                            <div>Medical Profile</div>
                            <div style="font-size: 0.875rem; opacity: 0.9;">Quick access to your info</div>
                        </div>
                    </button>
                </div>
                
                <button class="modal-close" style="width: 100%; padding: 0.875rem; background: #F1F5F9; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    }
};

// ============================================
// Data API Integration
// ============================================
const DataAPI = {
    baseURL: 'tables/',

    async get(table, id = null) {
        try {
            const url = id ? `${this.baseURL}${table}/${id}` : `${this.baseURL}${table}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            return null;
        }
    },

    async create(table, data) {
        try {
            const response = await fetch(`${this.baseURL}${table}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API CREATE Error:', error);
            return null;
        }
    },

    async update(table, id, data) {
        try {
            const response = await fetch(`${this.baseURL}${table}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API UPDATE Error:', error);
            return null;
        }
    },

    async delete(table, id) {
        try {
            await fetch(`${this.baseURL}${table}/${id}`, {
                method: 'DELETE'
            });
            return true;
        } catch (error) {
            console.error('API DELETE Error:', error);
            return false;
        }
    }
};

// ============================================
// Button Actions
// ============================================
const ButtonActions = {
    init() {
        // Hero buttons
        const getStartedBtn = document.getElementById('getStartedBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');

        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
                Utils.showNotification('Welcome to your health dashboard!', 'success');
            });
        }

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                Utils.showNotification('Demo video coming soon!', 'info');
            });
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                Utils.showNotification('Login feature - Demo mode', 'info');
            });
        }

        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                Utils.showNotification('Sign up feature - Demo mode', 'info');
            });
        }
    }
};

// ============================================
// Animations on Scroll
// ============================================
const ScrollAnimations = {
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .dashboard-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
};

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏥 HealthAI+ Platform Initializing...');
    
    // Initialize all modules
    Navigation.init();
    ThemeManager.init();
    HealthAnalytics.init();
    SymptomChecker.init();
    Chatbot.init();
    Dashboard.init();
    Forms.init();
    Emergency.init();
    ButtonActions.init();
    ScrollAnimations.init();
    
    console.log('✅ HealthAI+ Platform Ready!');
    
    // Welcome notification
    setTimeout(() => {
        Utils.showNotification('Welcome to HealthAI+ - Your health, powered by AI', 'success');
    }, 1000);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        Utils,
        Navigation,
        ThemeManager,
        HealthAnalytics,
        SymptomChecker,
        Chatbot,
        Dashboard,
        DataAPI
    };
}