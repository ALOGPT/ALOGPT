document.addEventListener("DOMContentLoaded", () => {
    const sections = [...document.querySelectorAll(".faq-section")];
    const tabs = [...document.querySelectorAll(".category-tab")];
    const search = document.querySelector("#faq-search");
    const status = document.querySelector("#search-status");
    const allItems = () => sections.flatMap((section) => [...section.querySelectorAll(".faq-item")]);

    const setActiveCategory = (category) => {
        tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.category === category));
        sections.forEach((section) => {
            const visible = section.dataset.section === category || section.dataset.section === "final";
            section.classList.toggle("is-visible", visible);
            section.hidden = !visible;
        });
        search.value = "";
        status.textContent = "";
        allItems().forEach((item) => item.hidden = false);
    };

    tabs.forEach((tab) => tab.addEventListener("click", () => setActiveCategory(tab.dataset.category)));

    search.addEventListener("input", () => {
        const query = search.value.trim().toLocaleLowerCase("fa");
        let count = 0;
        sections.forEach((section) => {
            let sectionHasMatch = false;
            section.querySelectorAll(".faq-item").forEach((item) => {
                const match = !query || item.textContent.toLocaleLowerCase("fa").includes(query);
                item.hidden = !match;
                sectionHasMatch ||= match;
                if (query && match) item.open = true;
            });
            section.hidden = Boolean(query) && !sectionHasMatch;
            section.classList.toggle("is-visible", sectionHasMatch || !query);
            if (sectionHasMatch) count += [...section.querySelectorAll(".faq-item")].filter((item) => !item.hidden).length;
        });
        tabs.forEach((tab) => tab.classList.remove("is-active"));
        status.textContent = query ? `${count} نتیجه پیدا شد` : "";
    });

    const schemaQuestions = allItems().map((item) => ({
        "@type": "Question",
        name: item.querySelector("summary").textContent.trim(),
        acceptedAnswer: { "@type": "Answer", text: item.querySelector("p").textContent.trim() }
    }));
    document.querySelector("#faq-schema").textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: "fa-IR",
        mainEntity: schemaQuestions
    });

    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    menuButton.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(open));
    });
});
