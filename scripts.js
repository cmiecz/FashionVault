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
        try {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized successfully');
        } catch (err) {
            console.error('Failed to initialize Supabase client:', err);
        }
    } else {
        console.error('Supabase library not loaded! Check if the script tag is in the HTML.');
    }
    
    // Sign-up Modal functionality
    const signupModal = document.getElementById('signup-modal');
    const signupModalClose = document.getElementById('signup-modal-close');
    const signupForm = document.getElementById('signup-form');
    const signupEmailInput = document.getElementById('signup-email');
    const signupMessage = document.getElementById('signup-message');
    const signupSubmitBtn = document.getElementById('signup-submit-btn');
    // Find all sign-up buttons by class (most reliable)
    const signupButtons = document.querySelectorAll('.signup-btn');
    
    // Also find by aria-label as fallback
    const signupButtonsByAria = document.querySelectorAll('button[aria-label="Sign up"], button[aria-label="Sign Up"]');
    
    // Combine both methods (use Set to avoid duplicates)
    const allSignupButtons = new Set([...signupButtons, ...signupButtonsByAria]);
    
    // Open modal when any sign-up button is clicked
    allSignupButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Sign-up button clicked');
            openSignupModal();
        });
    });
    
    console.log('Sign-up buttons found:', allSignupButtons.size);
    
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
        console.log('openSignupModal called, modal element:', signupModal);
        if (signupModal) {
            signupModal.classList.add('active');
            signupEmailInput?.focus();
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            console.log('Modal opened');
        } else {
            console.error('Sign-up modal element not found!');
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
                console.log('Attempting to insert email:', email);
                console.log('Supabase client:', supabaseClient);
                
                // Insert email using database function (bypasses RLS)
                const { data, error } = await supabaseClient
                    .rpc('insert_signup', { email_address: email });
                
                console.log('Supabase response - data:', data, 'error:', error);
                
                if (error) {
                    // Check if it's a duplicate email error
                    if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique') || error.message.includes('conflict')) {
                        showMessage('This email is already on the waitlist!', false);
                    } else {
                        console.error('Supabase error details:', {
                            code: error.code,
                            message: error.message,
                            details: error.details,
                            hint: error.hint
                        });
                        showMessage(`Error: ${error.message || 'Something went wrong. Please try again later.'}`, true);
                    }
                } else {
                    // Success - function returns array, check if we got a result
                    if (data && data.length > 0) {
                        console.log('Successfully added email to waitlist:', data);
                        showMessage('Thank you! You\'ve been added to the waitlist.', false);
                    } else {
                        // Function returned empty (likely duplicate)
                        showMessage('This email is already on the waitlist!', false);
                    }
                    signupEmailInput.value = '';
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        closeSignupModal();
                    }, 2000);
                }
            } catch (err) {
                console.error('Sign-up error:', err);
                console.error('Error stack:', err.stack);
                showMessage(`Error: ${err.message || 'Something went wrong. Please try again later.'}`, true);
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

