// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
            
            // Change icon
            const icon = mobileMenuButton.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = isHidden ? 'close' : 'menu';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                        const icon = mobileMenuButton.querySelector('.material-symbols-outlined');
                        if (icon) {
                            icon.textContent = 'menu';
                        }
                    }
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenuButton && mobileMenu && 
            !mobileMenuButton.contains(event.target) && 
            !mobileMenu.contains(event.target) &&
            !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuButton.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = 'menu';
            }
        }
    });
    
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherAnswer) {
                            otherAnswer.classList.add('hidden');
                        }
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.classList.add('hidden');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    answer.classList.remove('hidden');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
            
            // Keyboard navigation support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
    
    // Feature Tabs functionality
    const featureTabs = document.querySelectorAll('.feature-tab');
    const featurePanels = document.querySelectorAll('.feature-tab-panel');
    
    function switchTab(targetTab) {
        const targetPanelId = targetTab.getAttribute('aria-controls');
        const targetPanel = document.getElementById(targetPanelId);
        
        if (!targetPanel) return;
        
        // Remove active state from all tabs and hide all panels
        featureTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
        });
        
        featurePanels.forEach(panel => {
            panel.classList.add('hidden');
        });
        
        // Add active state to selected tab and show corresponding panel
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-selected', 'true');
        targetTab.setAttribute('tabindex', '0');
        
        targetPanel.classList.remove('hidden');
    }
    
    // Add click handlers to tabs
    featureTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(tab);
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', function(e) {
            const currentIndex = Array.from(featureTabs).indexOf(tab);
            let targetIndex;
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                if (e.key === 'ArrowRight') {
                    targetIndex = (currentIndex + 1) % featureTabs.length;
                } else {
                    targetIndex = (currentIndex - 1 + featureTabs.length) % featureTabs.length;
                }
                switchTab(featureTabs[targetIndex]);
                featureTabs[targetIndex].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                switchTab(featureTabs[0]);
                featureTabs[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                switchTab(featureTabs[featureTabs.length - 1]);
                featureTabs[featureTabs.length - 1].focus();
            }
        });
    });
    
    // Initialize Supabase client
    const SUPABASE_URL = 'https://zrohbrzjkpqgfmovrddp.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyb2hicnpqa3BxZ2Ztb3ZyZGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDA0MjQsImV4cCI6MjA3ODE3NjQyNH0.X8mcOCa8nSx_4WURm5xmXjYszRHIuTvmFedow2vTlrM';
    
    let supabaseClient = null;
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    
    // Sign-up Modal functionality
    const signupModal = document.getElementById('signup-modal');
    const signupModalClose = document.getElementById('signup-modal-close');
    const signupForm = document.getElementById('signup-form');
    const signupEmailInput = document.getElementById('signup-email');
    const signupMessage = document.getElementById('signup-message');
    const signupSubmitBtn = document.getElementById('signup-submit-btn');
    const signupButtons = document.querySelectorAll('button[aria-label="Sign up"], button[aria-label="Sign Up"]');
    
    // Open modal when any sign-up button is clicked
    signupButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openSignupModal();
        });
    });
    
    // Close modal handlers
    if (signupModalClose) {
        signupModalClose.addEventListener('click', closeSignupModal);
    }
    
    // Close modal when clicking outside
    if (signupModal) {
        signupModal.addEventListener('click', function(e) {
            if (e.target === signupModal) {
                closeSignupModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && signupModal && signupModal.classList.contains('active')) {
            closeSignupModal();
        }
    });
    
    function openSignupModal() {
        if (signupModal) {
            signupModal.classList.add('active');
            signupEmailInput?.focus();
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    function closeSignupModal() {
        if (signupModal) {
            signupModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            // Reset form
            if (signupForm) {
                signupForm.reset();
            }
            hideMessage();
        }
    }
    
    function showMessage(text, isError = false) {
        if (signupMessage) {
            signupMessage.textContent = text;
            signupMessage.className = `signup-message ${isError ? 'error' : 'success'}`;
        }
    }
    
    function hideMessage() {
        if (signupMessage) {
            signupMessage.textContent = '';
            signupMessage.className = 'signup-message';
        }
    }
    
    // Handle form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = signupEmailInput?.value.trim();
            
            // Validate email
            if (!email) {
                showMessage('Please enter your email address.', true);
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', true);
                return;
            }
            
            // Disable submit button
            if (signupSubmitBtn) {
                signupSubmitBtn.disabled = true;
                signupSubmitBtn.textContent = 'Joining...';
            }
            
            hideMessage();
            
            // If Supabase is not configured, show a message
            if (!supabaseClient) {
                showMessage('Sign-up is not yet configured. Please contact support.', true);
                if (signupSubmitBtn) {
                    signupSubmitBtn.disabled = false;
                    signupSubmitBtn.textContent = 'Join Waitlist';
                }
                return;
            }
            
            try {
                // Insert email into Supabase
                const { data, error } = await supabaseClient
                    .from('signups')
                    .insert([{ email: email }])
                    .select();
                
                if (error) {
                    // Check if it's a duplicate email error
                    if (error.code === '23505' || error.message.includes('duplicate')) {
                        showMessage('This email is already on the waitlist!', false);
                    } else {
                        console.error('Supabase error:', error);
                        showMessage('Something went wrong. Please try again later.', true);
                    }
                } else {
                    // Success
                    showMessage('Thank you! You\'ve been added to the waitlist.', false);
                    signupEmailInput.value = '';
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        closeSignupModal();
                    }, 2000);
                }
            } catch (err) {
                console.error('Sign-up error:', err);
                showMessage('Something went wrong. Please try again later.', true);
            } finally {
                // Re-enable submit button
                if (signupSubmitBtn) {
                    signupSubmitBtn.disabled = false;
                    signupSubmitBtn.textContent = 'Join Waitlist';
                }
            }
        });
    }
});

