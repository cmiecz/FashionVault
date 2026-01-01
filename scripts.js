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
    
    // Feature Accordion functionality
    const featureAccordionItems = document.querySelectorAll('.feature-accordion-item');
    featureAccordionItems.forEach(item => {
        const header = item.querySelector('.feature-accordion-header');
        const content = item.querySelector('.feature-accordion-content');
        
        if (header && content) {
            // Set initial state - first item (Core Features) is active by default
            if (item === featureAccordionItems[0]) {
                item.classList.add('active');
                content.classList.remove('hidden');
                header.setAttribute('aria-expanded', 'true');
            }
            
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other accordion items (only one open at a time)
                featureAccordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.feature-accordion-content');
                        const otherHeader = otherItem.querySelector('.feature-accordion-header');
                        if (otherContent) {
                            otherContent.classList.add('hidden');
                        }
                        if (otherHeader) {
                            otherHeader.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    content.classList.add('hidden');
                    header.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    content.classList.remove('hidden');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
            
            // Keyboard navigation support
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const currentIndex = Array.from(featureAccordionItems).indexOf(item);
                    let targetIndex;
                    if (e.key === 'ArrowDown') {
                        targetIndex = (currentIndex + 1) % featureAccordionItems.length;
                    } else {
                        targetIndex = (currentIndex - 1 + featureAccordionItems.length) % featureAccordionItems.length;
                    }
                    featureAccordionItems[targetIndex].querySelector('.feature-accordion-header').focus();
                }
            });
        }
    });
});

