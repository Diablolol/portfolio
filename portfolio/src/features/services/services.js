import { fetchJSON } from '../../core/utils/fetch.js';

const servicesGrid = document.getElementById('services-grid');
const tabButtons = document.querySelectorAll('.service-tab');
const dataUrl = new URL('./services.data.json', import.meta.url);

function renderItem(service) {
    return `<article data-category="${service.category}" class="service-card glass-card rounded-2xl p-6 transition-all duration-300">
        <div class="w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-4">
            <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${service.icon}
            </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">${service.title}</h3>
        <p class="text-slate-400 text-sm mb-4">${service.description}</p>
        <ul class="text-xs text-slate-500 space-y-1">
            ${service.highlights.map(item => `<li class="flex items-center gap-2"><svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>${item}</li>`).join('')}
        </ul>
    </article>`;
}

function renderServices(services) {
    if (!servicesGrid) return;
    servicesGrid.innerHTML = services.map(renderItem).join('');
}

function activateTab(selectedButton) {
    tabButtons.forEach(button => {
        button.classList.remove('tab-active');
        button.classList.add('bg-slate-800');
        button.setAttribute('aria-selected', 'false');
    });
    selectedButton.classList.add('tab-active');
    selectedButton.classList.remove('bg-slate-800');
    selectedButton.setAttribute('aria-selected', 'true');
}

function filterServices(category) {
    const cards = document.querySelectorAll('#services-grid [data-category]');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            card.classList.add('visible');
        } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
        }
    });
}

export async function initServices() {
    const services = await fetchJSON(dataUrl);
    renderServices(services);

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            activateTab(button);
            filterServices(button.dataset.category);
        });
    });
}
