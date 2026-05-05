async function loadPartial(path) {
    const url = new URL(path, import.meta.url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    return response.text();
}

async function mountApp() {
    const app = document.getElementById("app");
    if (!app) {
        throw new Error("Missing app container");
    }

    const navbar = await loadPartial("./features/navbar/navbar.html");
    const hero = await loadPartial("./features/hero/hero.html");
    const services = await loadPartial("./features/services/services.html");
    const skills = await loadPartial("./features/skills/skills.html");
    const portfolio = await loadPartial("./features/portfolio/portfolio.html");
    const contact = await loadPartial("./features/contact/contact.html");

    app.innerHTML = `${navbar}${hero}${services}${skills}${portfolio}${contact}`;

    await Promise.all([
        import("./features/navbar/navbar.js").then(module => module.initNavbar()),
        import("./features/services/services.js").then(module => module.initServices()),
        import("./features/skills/skills.js").then(module => module.initSkills()),
        import("./features/portfolio/portfolio.js").then(module => module.initPortfolio()),
        import("./features/contact/contact.js").then(module => module.initContact()),
    ]);

    document.getElementById("copyright-year").textContent = new Date().getFullYear();
}

mountApp().catch(error => {
    console.error("Portfolio app failed to initialize:", error);
});
