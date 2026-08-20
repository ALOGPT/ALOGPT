(() => {
    "use strict";

    const rsMenuToggle = document.querySelector(".rs-menu-toggle");
    const rsMainNav = document.querySelector("#rs-main-nav");
    const rsNavLinks = document.querySelectorAll("#rs-main-nav a");
    const rsRevealItems = document.querySelectorAll(".rs-reveal");

    if (rsMenuToggle && rsMainNav) {
        rsMenuToggle.addEventListener("click", () => {
            const rsIsOpen = rsMainNav.classList.toggle("rs-is-open");
            rsMenuToggle.setAttribute("aria-expanded", String(rsIsOpen));
            rsMenuToggle.setAttribute("aria-label", rsIsOpen ? "بستن منو" : "باز کردن منو");
        });

        rsNavLinks.forEach((rsLink) => {
            rsLink.addEventListener("click", () => {
                rsMainNav.classList.remove("rs-is-open");
                rsMenuToggle.setAttribute("aria-expanded", "false");
                rsMenuToggle.setAttribute("aria-label", "باز کردن منو");
            });
        });

        document.addEventListener("click", (rsEvent) => {
            if (!rsMainNav.contains(rsEvent.target) && !rsMenuToggle.contains(rsEvent.target)) {
                rsMainNav.classList.remove("rs-is-open");
                rsMenuToggle.setAttribute("aria-expanded", "false");
                rsMenuToggle.setAttribute("aria-label", "باز کردن منو");
            }
        });
    }

    if ("IntersectionObserver" in window && rsRevealItems.length) {
        const rsObserver = new IntersectionObserver((rsEntries, rsObserverInstance) => {
            rsEntries.forEach((rsEntry) => {
                if (!rsEntry.isIntersecting) {
                    return;
                }

                rsEntry.target.classList.add("rs-is-visible");
                rsObserverInstance.unobserve(rsEntry.target);
            });
        }, { threshold: 0.12 });

        rsRevealItems.forEach((rsItem) => rsObserver.observe(rsItem));
    } else {
        rsRevealItems.forEach((rsItem) => rsItem.classList.add("rs-is-visible"));
    }
})();
