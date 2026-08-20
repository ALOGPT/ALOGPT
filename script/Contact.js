(() => {
    "use strict";

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#site-navigation");
    const themeToggle = document.querySelector(".theme-toggle");
    const copyButtons = document.querySelectorAll("[data-copy]");
    const toast = document.querySelector(".toast");

    const showToast = (message) => {
        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.setAttribute("aria-hidden", "false");
        toast.classList.add("is-visible");

        window.setTimeout(() => {
            toast.classList.remove("is-visible");
            toast.setAttribute("aria-hidden", "true");
        }, 2200);
    };

    menuToggle?.addEventListener("click", () => {
        const isOpen = navigation?.classList.toggle("is-open") ?? false;
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("is-open");
            menuToggle?.setAttribute("aria-expanded", "false");
        });
    });

    themeToggle?.addEventListener("click", () => {
        const isPressed = themeToggle.getAttribute("aria-pressed") === "true";
        themeToggle.setAttribute("aria-pressed", String(!isPressed));
        document.body.classList.toggle("is-soft-theme", !isPressed);
        themeToggle.innerHTML = `<i class="fa-regular fa-${isPressed ? "moon" : "sun"}" aria-hidden="true"></i>`;
    });

    copyButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const value = button.dataset.copy;

            if (!value || !navigator.clipboard?.writeText) {
                showToast("کپی خودکار در این مرورگر در دسترس نیست.");
                return;
            }

            try {
                await navigator.clipboard.writeText(value);
                showToast("شناسه با موفقیت کپی شد.");
            } catch {
                showToast("کپی انجام نشد؛ لطفاً شناسه را دستی انتخاب کنید.");
            }
        });
    });
})();
