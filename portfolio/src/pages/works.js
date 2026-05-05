import { fetchJSON } from '../core/utils/fetch.js';

const worksGrid = document.getElementById('works-grid');
const filterButtons = document.querySelectorAll('.portfolio-filter');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const dataUrl = new URL('../features/portfolio/portfolio.data.json', import.meta.url);

let allItems = [];
let currentCategory = 'all';
let currentSearch = '';

function createWorkCard(item) {
    return `<article data-work-id="${item.id}" data-category="${item.category}"
            class="group glass-card rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
            <div class="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <svg class="w-16 h-16 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="8" y="8" width="48" height="48" rx="4" />
                    <path d="M8 20h48M20 8v48" />
                </svg>
            </div>
            <div class="p-6">
                <span class="text-xs font-medium text-blue-400 uppercase tracking-wider">${item.category}</span>
                <h3 class="text-lg font-semibold mt-2 mb-2">${item.title}</h3>
                <p class="text-slate-400 text-sm">${item.description}</p>
                <div class="mt-4 pt-4 border-t border-slate-700">
                    <p class="text-xs text-slate-500">Technologies:</p>
                    <div class="flex flex-wrap gap-2 mt-2">
                        ${item.technologies.map(tech => `<span class="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        </article>`;
}

function renderWorks(items) {
    if (!worksGrid) return;

    if (items.length === 0) {
        worksGrid.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        worksGrid.innerHTML = items.map(createWorkCard).join('');
        noResults.classList.add('hidden');
    }
}

function filterItems() {
    let filtered = allItems;

    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(item => item.category === currentCategory);
    }

    // Filter by search
    if (currentSearch.trim()) {
        const searchTerm = currentSearch.toLowerCase();
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
        );
    }

    renderWorks(filtered);
}

function activateFilter(selectedButton) {
    filterButtons.forEach(button => {
        button.classList.remove('tab-active');
        button.classList.add('bg-slate-800');
        button.setAttribute('aria-selected', 'false');
    });
    selectedButton.classList.add('tab-active');
    selectedButton.classList.remove('bg-slate-800');
    selectedButton.setAttribute('aria-selected', 'true');
}

async function initWorks() {
    try {
        allItems = await fetchJSON(dataUrl);
        renderWorks(allItems);
    } catch (error) {
        console.error('Failed to load portfolio data:', error);
    }

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentCategory = button.dataset.category;
            activateFilter(button);
            filterItems();
        });
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterItems();
        });
    }

    // Mobile menu
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu?.classList.add('hidden');
            mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        });
    });

    // Update copyright year
    document.getElementById("copyright-year").textContent = new Date().getFullYear();
}

initWorks();