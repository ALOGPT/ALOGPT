(() => {
    "use strict";

    const pills = [...document.querySelectorAll(".tab-pill")];
    const sections = [...document.querySelectorAll(".rules-section")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setActivePill = (id) => {
        pills.forEach((pill) => {
            const isActive = pill.getAttribute("href") === `#${id}`;
            pill.classList.toggle("is-active", isActive);
            if (isActive) {
                pill.setAttribute("aria-current", "location");
            } else {
                pill.removeAttribute("aria-current");
            }
        });
    };

    pills.forEach((pill) => {
        pill.addEventListener("click", (event) => {
            const targetId = pill.getAttribute("href");
            const target = targetId ? document.querySelector(targetId) : null;

            if (!target) {
                return;
            }

            event.preventDefault();
            setActivePill(target.id);
            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            if (window.history.replaceState) {
                window.history.replaceState(null, "", targetId);
            }
        });
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            const visibleSection = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visibleSection) {
                setActivePill(visibleSection.target.id);
            }
        }, {
            rootMargin: "-20% 0px -65% 0px",
            threshold: [0.1, 0.25, 0.5]
        });

        sections.forEach((section) => observer.observe(section));
    }

    const initialId = window.location.hash.slice(1);
    if (initialId && sections.some((section) => section.id === initialId)) {
        setActivePill(initialId);
    } else if (sections[0]) {
        setActivePill(sections[0].id);
    }
})();
