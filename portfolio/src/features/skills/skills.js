import { fetchJSON } from '../../core/utils/fetch.js';

const skillsGrid = document.getElementById('skills-grid');
const tabButtons = document.querySelectorAll('.skills-tab');
const dataUrl = new URL('./skills.data.json', import.meta.url);

function createSkillItem(skill) {
    return `<div data-skill-category="${skill.category}" class="skill-badge glass-card rounded-xl p-4 text-center hover:border-blue-400/50 transition-all duration-300 cursor-default">
        <svg class="w-10 h-10 mx-auto mb-2 text-${skill.color}" viewBox="0 0 40 40" fill="currentColor">${skill.icon}</svg>
        <span class="text-xs font-medium">${skill.name}</span>
    </div>`;
}

function renderSkills(skills) {
    if (!skillsGrid) return;
    skillsGrid.innerHTML = skills.map(createSkillItem).join('');
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

function filterSkills(category) {
    const tiles = document.querySelectorAll('#skills-grid [data-skill-category]');
    tiles.forEach(tile => {
        const tileCategory = tile.getAttribute('data-skill-category');
        if (category === 'all' || tileCategory === category) {
            tile.classList.remove('hidden');
            tile.classList.add('visible');
        } else {
            tile.classList.add('hidden');
            tile.classList.remove('visible');
        }
    });
}

export async function initSkills() {
    const skills = await fetchJSON(dataUrl);
    renderSkills(skills);

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            activateTab(button);
            filterSkills(button.dataset.category);
        });
    });
}
