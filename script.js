// ========== PEAK MOMENTS STUDIO - FULL WORKING SCRIPT ==========

const albums = {
    home: Array.from({length: 11}, (_, i) => ({
        url: `featured/${i + 1}.jpg`,
        alt: `Featured work ${i+1} - Peak Moments Sri Lanka`,
        albumTitle: 'Featured'
    })),
    
    maternity: [
        ...Array.from({length: 14}, (_, i) => ({ url: `maternity & newborn/name-1/${i+1}.jpg`, alt: 'Sanjala & Love Maternity Photoshoot Sri Lanka', albumTitle: 'Sanjala & Love - Maternity' })),
        ...Array.from({length: 7}, (_, i) => ({ url: `maternity & newborn/name-2/${i+1}.jpg`, alt: "Tiffany's Joy Maternity Session Sri Lanka", albumTitle: "Tiffany's Joy - Maternity" }))
    ],
    
    branding: [
        ...Array.from({length: 6}, (_, i) => ({ url: `personal branding/name-1/${i+1}.jpg`, alt: 'Senuri Refind Personal Branding Photography Sri Lanka', albumTitle: 'Senuri Refind - Branding' })),
        ...Array.from({length: 16}, (_, i) => ({ url: `personal branding/name-2/${i+1}.jpg`, alt: 'Her Lehenga Story Branding Photoshoot Sri Lanka', albumTitle: 'Her Lehenga Story - Branding' }))
    ],
    
    birthdays: [
        ...Array.from({length: 11}, (_, i) => ({ url: `birthdays & celebrations/name-1/${i+1}.jpg`, alt: 'Ameera turns one Birthday Photography Sri Lanka', albumTitle: 'Ameera turns one - Birthdays' })),
        ...Array.from({length: 10}, (_, i) => ({ url: `birthdays & celebrations/name-2/${i+1}.jpg`, alt: "Emie's First Birthday Photography Sri Lanka", albumTitle: "Emie's First Birthday - Birthdays" })),
        ...Array.from({length: 14}, (_, i) => ({ url: `birthdays & celebrations/name-3/${i+1}.jpg`, alt: 'Sweet Thej Birthday Photography Sri Lanka', albumTitle: 'Sweet Thej - Birthdays' }))
    ],
    
    family: [
        ...Array.from({length: 5}, (_, i) => ({ url: `family & couples/name-1/${i+1}.jpg`, alt: 'Cozy Christmas Family Photography Sri Lanka', albumTitle: 'Cozy Christmas - Family' })),
        ...Array.from({length: 6}, (_, i) => ({ url: `family & couples/name-2/${i+1}.jpg`, alt: "Nauki's Christmas Family Session Sri Lanka", albumTitle: "Nauki's Christmas - Family" })),
        ...Array.from({length: 6}, (_, i) => ({ url: `family & couples/name-3/${i+1}.jpg`, alt: 'Little Artist Family Photography Sri Lanka', albumTitle: 'Little Artist - Family' }))
    ],
    
    events: [
        ...Array.from({length: 9}, (_, i) => ({ url: `events & gathering/name-1/${i+1}.jpg`, alt: "Prithika's Bridal Shower Event Photography Sri Lanka", albumTitle: "Prithika's Bridal Shower - Events" }))
    ]
};

// Master list for search
let masterPhotos = [];
Object.keys(albums).forEach(key => {
    if (key !== 'home') {
        albums[key].forEach(p => masterPhotos.push(p));
    }
});

// State
let currentPage = 'home';
let currentPhotos = [];
let currentIndex = 0;
let currentCategory = 'all';

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-section');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Theme
let isDark = localStorage.getItem('theme') === 'dark';
if (isDark) {
    document.body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    isDark = !isDark;
    if (isDark) {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    }
});

// Page Navigation
function showPage(pageId) {
    currentPage = pageId;
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) item.classList.add('active');
    });

    if (pageId === 'portfolio') {
        document.body.classList.add('portfolio-active');
        checkTopButtonVisibility();
    } else {
        document.body.classList.remove('portfolio-active');
    }

    if (pageId === 'home') loadHomeFeatured();
    if (pageId === 'portfolio') loadPortfolio();
}

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(item.dataset.page);
    });
});

window.showPage = showPage;
window.showPortfolioCategory = function(category) {
    showPage('portfolio');
    setTimeout(() => filterByCategory(category), 100);
};

// Home Featured
function loadHomeFeatured() {
    const container = document.getElementById('home-featured');
    const allPhotos = [...albums.maternity, ...albums.branding, ...albums.birthdays, ...albums.family, ...albums.events];
    const shuffled = allPhotos.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    container.innerHTML = '';
    shuffled.forEach((photo, idx) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `<img src="${photo.url}" alt="${photo.alt}" onerror="this.src='https://via.placeholder.com/300?text=Image+Not+Found'"><div class="caption">${photo.albumTitle}</div>`;
        card.addEventListener('click', () => openLightbox(shuffled, idx));
        container.appendChild(card);
    });
}

// Portfolio Functions
function loadPortfolio() {
    buildAlbumChips();
    filterByCategory('all');
    setupSearch();
}

function buildAlbumChips() {
    const chips = [
        { id: 'all', name: 'All' },
        { id: 'maternity', name: 'Maternity' },
        { id: 'branding', name: 'Branding' },
        { id: 'birthdays', name: 'Birthdays' },
        { id: 'family', name: 'Family' },
        { id: 'events', name: 'Events' }
    ];
    const container = document.getElementById('albumChips');
    container.innerHTML = '';
    chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.className = `album-chip ${chip.id === currentCategory ? 'active' : ''}`;
        btn.textContent = chip.name;
        btn.dataset.category = chip.id;
        btn.addEventListener('click', () => filterByCategory(chip.id));
        container.appendChild(btn);
    });
}

function filterByCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.album-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.category === category);
    });
    const photos = category === 'all' ? masterPhotos : (albums[category] || []);
    displayPortfolioPhotos(photos);
}

function displayPortfolioPhotos(photos) {
    currentPhotos = photos;
    const grid = document.getElementById('portfolio-grid');
    if (photos.length === 0) {
        grid.innerHTML = '<p style="text-align:center; padding:40px;">No photos found</p>';
        return;
    }
    grid.innerHTML = '';
    photos.forEach((photo, idx) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `<img src="${photo.url}" alt="${photo.alt}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=Not+Found'"><div class="caption">${photo.albumTitle}</div>`;
        card.addEventListener('click', () => openLightbox(photos, idx));
        grid.appendChild(card);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (!term) return filterByCategory(currentCategory);
        const results = masterPhotos.filter(p => 
            p.alt.toLowerCase().includes(term) || p.albumTitle.toLowerCase().includes(term)
        );
        displayPortfolioPhotos(results);
    });
}

// Lightbox
function openLightbox(photos, index) {
    currentPhotos = photos;
    currentIndex = index;
    updateLightbox();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function updateLightbox() {
    const photo = currentPhotos[currentIndex];
    lightboxImg.src = photo.url;
    lightboxImg.alt = photo.alt;
    lightboxCaption.textContent = `${photo.albumTitle} (${currentIndex + 1}/${currentPhotos.length})`;
}

lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
});

lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateLightbox();
});

lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    updateLightbox();
});

document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
    if (e.key === 'Escape') lightboxClose.click();
});

let touchStartX = 0;
lightbox.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) lightboxNext.click();
        else lightboxPrev.click();
    }
});

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightboxClose.click();
});

// Top Button
const topBtn = document.createElement('button');
topBtn.className = 'top-btn';
topBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
topBtn.setAttribute('aria-label', 'Scroll to top');
topBtn.addEventListener('click', () => {
    document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
});
document.body.appendChild(topBtn);

function checkTopButtonVisibility() {
    if (!document.body.classList.contains('portfolio-active')) return;
    const portfolioTop = document.getElementById('portfolio').offsetTop;
    topBtn.style.display = (window.scrollY > portfolioTop + 100) ? 'flex' : 'none';
}
window.addEventListener('scroll', checkTopButtonVisibility);

// Initial Load
loadHomeFeatured();

// ================== නව features ==================

// Header hide on scroll down, show on scroll up
let lastScrollY = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;

    // Top button visibility (portfolio එකේ විතරයි)
    checkTopButtonVisibility();
});

// Top button එක center කරලා තියෙන නිසා function එක update කරන්න
function checkTopButtonVisibility() {
    if (!document.body.classList.contains('portfolio-active')) return;
    
    const portfolioSection = document.getElementById('portfolio');
    if (!portfolioSection) return;
    
    const portfolioTop = portfolioSection.offsetTop;
    const scrollY = window.scrollY;
    
    if (scrollY > portfolioTop + 100) {
        topBtn.style.display = 'flex';
    } else {
        topBtn.style.display = 'none';
    }
}

// Search bar එක portfolio එකේ විතරයි active කරන්න (අනිත් පිටුවල hide වෙන්න එපා)
document.addEventListener('DOMContentLoaded', () => {
    const searchWrapper = document.querySelector('.search-wrapper');
    if (searchWrapper) {
        searchWrapper.style.top = '0px';
    }
});