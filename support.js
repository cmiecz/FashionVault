// Support page functionality: search and filter
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const articleCards = document.querySelectorAll('.article-card');
    const videoCards = document.querySelectorAll('.video-card');
    const noResults = document.getElementById('no-results');
    const articlesContainer = document.getElementById('articles-container');
    const videosContainer = document.getElementById('videos-container');
    
    let currentCategory = 'all';
    let currentSearch = '';
    
    // Category filter functionality
    categoryFilters.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            categoryFilters.forEach(btn => {
                btn.classList.remove('border-primary', 'text-primary', 'bg-primary/10');
                btn.classList.add('border-neutral');
            });
            this.classList.add('border-primary', 'text-primary', 'bg-primary/10');
            this.classList.remove('border-neutral');
            
            currentCategory = this.getAttribute('data-category');
            filterContent();
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value.toLowerCase().trim();
            filterContent();
        });
    }
    
    // Filter content based on category and search
    function filterContent() {
        let visibleCount = 0;
        
        // Filter articles
        articleCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title').toLowerCase();
            const content = card.getAttribute('data-content').toLowerCase();
            
            const matchesCategory = currentCategory === 'all' || category === currentCategory;
            const matchesSearch = !currentSearch || 
                title.includes(currentSearch) || 
                content.includes(currentSearch);
            
            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Filter videos
        videoCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title').toLowerCase();
            const content = card.getAttribute('data-content').toLowerCase();
            
            const matchesCategory = currentCategory === 'all' || category === currentCategory;
            const matchesSearch = !currentSearch || 
                title.includes(currentSearch) || 
                content.includes(currentSearch);
            
            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
            articlesContainer.style.display = 'none';
            videosContainer.style.display = 'none';
        } else {
            noResults.classList.add('hidden');
            articlesContainer.style.display = 'grid';
            videosContainer.style.display = 'grid';
        }
    }
    
    // Set initial active category
    if (categoryFilters.length > 0) {
        categoryFilters[0].classList.add('border-primary', 'text-primary', 'bg-primary/10');
        categoryFilters[0].classList.remove('border-neutral');
    }
});

