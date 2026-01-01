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
        
        // Remove active state from all tabs and panels
        featureTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
            tab.classList.remove('border-accent', 'text-text-primary');
            tab.classList.add('border-transparent', 'text-text-secondary');
        });
        
        featurePanels.forEach(panel => {
            panel.classList.add('hidden');
        });
        
        // Add active state to selected tab and panel
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-selected', 'true');
        targetTab.setAttribute('tabindex', '0');
        targetTab.classList.remove('border-transparent', 'text-text-secondary');
        targetTab.classList.add('border-accent', 'text-text-primary');
        
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
});

