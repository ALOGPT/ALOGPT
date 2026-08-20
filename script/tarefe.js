(() => {
    "use strict";
    const rsMenuToggle = document.querySelector(".rs-menu-toggle");
    const rsMainNav = document.querySelector("#rs-main-nav");
    const rsBillingButtons = document.querySelectorAll(".rs-billing-button");
    const rsPriceItems = document.querySelectorAll("[data-monthly][data-yearly]");
    const rsRevealItems = document.querySelectorAll(".rs-reveal");

    if (rsMenuToggle && rsMainNav) {
        rsMenuToggle.addEventListener("click", () => {
            const rsIsOpen = rsMainNav.classList.toggle("rs-is-open");
            rsMenuToggle.setAttribute("aria-expanded", String(rsIsOpen));
            rsMenuToggle.setAttribute("aria-label", rsIsOpen ? "بستن منو" : "باز کردن منو");
        });
        rsMainNav.querySelectorAll("a").forEach((rsLink) => rsLink.addEventListener("click", () => {
            rsMainNav.classList.remove("rs-is-open");
            rsMenuToggle.setAttribute("aria-expanded", "false");
        }));
        document.addEventListener("click", (rsEvent) => {
            if (!rsMainNav.contains(rsEvent.target) && !rsMenuToggle.contains(rsEvent.target)) {
                rsMainNav.classList.remove("rs-is-open");
                rsMenuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    rsBillingButtons.forEach((rsButton) => rsButton.addEventListener("click", () => {
        const rsBilling = rsButton.dataset.billing;
        rsBillingButtons.forEach((rsItem) => {
            const rsActive = rsItem === rsButton;
            rsItem.classList.toggle("rs-is-active", rsActive);
            rsItem.setAttribute("aria-pressed", String(rsActive));
        });
        rsPriceItems.forEach((rsPrice) => { rsPrice.textContent = rsPrice.dataset[rsBilling]; });
    }));

    if ("IntersectionObserver" in window && rsRevealItems.length) {
        const rsObserver = new IntersectionObserver((rsEntries, rsObserverInstance) => {
            rsEntries.forEach((rsEntry) => {
                if (rsEntry.isIntersecting) {
                    rsEntry.target.classList.add("rs-is-visible");
                    rsObserverInstance.unobserve(rsEntry.target);
                }
            });
        }, { threshold: .1 });
        rsRevealItems.forEach((rsItem) => rsObserver.observe(rsItem));
    } else {
        rsRevealItems.forEach((rsItem) => rsItem.classList.add("rs-is-visible"));
    }
})();
