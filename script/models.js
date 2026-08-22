(() => {
    "use strict";

    const cards = [...document.querySelectorAll(".model-card")];
    const filters = [...document.querySelectorAll(".filter-pill")];
    const startButtons = [...document.querySelectorAll(".model-start-btn")];

    const getSelectedModel = () => {
        try {
            return window.localStorage.getItem("selectedModel");
        } catch {
            return null;
        }
    };

    const saveSelectedModel = (modelId, modelLogo) => {
        try {
            window.localStorage.setItem("selectedModel", modelId);
            if (modelLogo) {
                window.localStorage.setItem("selectedModelLogo", modelLogo);
            }
        } catch {
            // ادامه کار بدون localStorage نیز ممکن است.
        }
    };

    const highlightSelectedModel = () => {
        const selectedModel = getSelectedModel();

        if (!selectedModel) {
            return;
        }

        cards.forEach((card) => {
            card.classList.toggle("featured", card.dataset.modelId === selectedModel);
        });
    };

    const filterModels = (filter) => {
        cards.forEach((card) => {
            const categories = (card.dataset.cats || "").split(" ");
            const shouldShow = filter === "all" || categories.includes(filter);
            card.classList.toggle("hide", !shouldShow);
        });
    };

    filters.forEach((filterButton) => {
        filterButton.addEventListener("click", () => {
            filters.forEach((button) => button.classList.remove("active"));
            filterButton.classList.add("active");
            filterModels(filterButton.dataset.filter || "all");
        });
    });

    startButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".model-card");
            const modelId = card?.dataset.modelId;

            if (!modelId) {
                return;
            }

            const modelLogo = card.querySelector(".model-icon img")?.getAttribute("src");
            saveSelectedModel(modelId, modelLogo);
            window.location.href = "chatpaige.html";
        });
    });

    highlightSelectedModel();
})();
