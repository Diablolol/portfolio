import { fetchJSON } from '../../core/utils/fetch.js';

const portfolioGrid = document.getElementById('portfolio-grid');
const viewAllButton = document.getElementById('view-all-portfolio');
const modal = document.getElementById('portfolio-modal');
const closeModalButton = document.getElementById('close-portfolio');
const detailsGrid = document.getElementById('portfolio-details-grid');
const detailView = document.getElementById('portfolio-detail-view');
const detailContent = document.getElementById('portfolio-detail-content');
const backToGalleryButton = document.getElementById('back-to-gallery');
const dataUrl = new URL('./portfolio.data.json', import.meta.url);

function createCard(item) {
    return `<article data-portfolio-id="${item.id}"
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
            </div>
        </article>`;
}

function createModalCard(item) {
    return `<article data-portfolio-id="${item.id}"
            class="group glass-card rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
            <div class="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <svg class="w-16 h-16 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="8" y="8" width="48" height="48" rx="4" />
                    <path d="M8 20h48M20 8v48" />
                </svg>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-blue-400 uppercase tracking-wider">${item.category}</span>
                    <span class="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-300">ดู</span>
                </div>
                <h3 class="text-lg font-semibold mt-2 mb-2">${item.title}</h3>
                <p class="text-slate-400 text-sm">${item.description}</p>
                <div class="mt-4 pt-4 border-t border-slate-700">
                    <p class="text-xs text-slate-500">Tags:</p>
                    <div class="flex flex-wrap gap-2 mt-2">
                        ${item.technologies.map(tech => `<span class="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        </article>`;
}

function renderPortfolio(items) {
    if (portfolioGrid) {
        portfolioGrid.innerHTML = items.map(createCard).join('');
    }
    if (detailsGrid) {
        detailsGrid.innerHTML = items.map(createModalCard).join('');
    }
}

function openModal() {
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
    detailsGrid?.classList.remove('hidden');
    detailView?.classList.add('hidden');
}

function closeModal() {
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
}

function showDetail(item) {
    if (!detailView || !detailContent) return;
    detailView.classList.remove('hidden');
    detailsGrid?.classList.add('hidden');

    detailContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div class="md:col-span-2">
                <h3 class="text-3xl font-bold mb-2">${item.title}</h3>
                <span class="text-sm font-medium text-blue-400 uppercase tracking-wider">${item.category}</span>
                <p class="text-slate-400 text-lg mt-4 mb-6">${item.description}</p>
                <p class="text-slate-300 leading-relaxed mb-6">${item.details}</p>
                <h4 class="text-lg font-semibold mb-3">ฟีเจอร์หลัก</h4>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    ${item.features.map(feature => `<li class="flex items-center gap-2 text-slate-300"><svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="glass-card rounded-2xl p-6 h-fit">
                <h4 class="font-semibold mb-4">รายละเอียดโปรเจกต์</h4>
                <div class="space-y-4 text-sm text-slate-300">
                    <div>
                        <p class="text-slate-500 text-xs uppercase tracking-wider">Client</p>
                        <p class="font-medium">${item.client}</p>
                    </div>
                    <div>
                        <p class="text-slate-500 text-xs uppercase tracking-wider">Completion Year</p>
                        <p class="font-medium">${item.year}</p>
                    </div>
                    ${item.result ? `
                    <div>
                        <p class="text-slate-500 text-xs uppercase tracking-wider">Result</p>
                        <p class="text-green-400 font-medium">${item.result}</p>
                    </div>
                    ` : ''}
                    <div>
                        <p class="text-slate-500 text-xs uppercase tracking-wider mb-2">Technologies</p>
                        <div class="flex flex-wrap gap-2">
                            ${item.technologies.map(tech => `<span class="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function initPortfolio() {
    const items = await fetchJSON(dataUrl);
    renderPortfolio(items);

    viewAllButton?.addEventListener('click', openModal);
    closeModalButton?.addEventListener('click', closeModal);
    modal?.addEventListener('click', event => {
        if (event.target === modal) closeModal();
    });
    backToGalleryButton?.addEventListener('click', () => {
        detailView?.classList.add('hidden');
        detailsGrid?.classList.remove('hidden');
    });

    const clickHandler = event => {
        const card = event.currentTarget;
        const id = card.getAttribute('data-portfolio-id');
        const selected = items.find(item => item.id === id);
        if (selected) {
            openModal();
            showDetail(selected);
        }
    };

    document.querySelectorAll('[data-portfolio-id]').forEach(card => {
        card.addEventListener('click', clickHandler);
    });
}
