$(function () {
    "use strict";

    const $messageArea = $("#messageArea");
    const $messageInput = $("#messageInput");
    const $suggestion = $(".rs-suggest");
    const $extensions = $(".rs-extensions");
    const $sendButton = $(".send-button");
    const MODEL_NAMES = {
        "GPT-5.6 Lite": "GPT-5.6 Lite",
        "Claude 5 Sonnet": "Claude 5 Sonnet",
        "Gemini 2.5 Pro": "Gemini 2.5 Pro",
        "DeepSeek V4 Pro": "DeepSeek V4 Pro"
    };
    let currentModelId = localStorage.getItem("selectedModel") || "GPT-5.6 Lite";
    let conversationMessages = [];
    let conversationSaved = false;

    $(".model-select-btn span").text(MODEL_NAMES[currentModelId] || currentModelId);

    function formatTime(timestamp) {
        return new Intl.DateTimeFormat("fa-IR", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(timestamp));
    }

    function appendMessage(content, role, model, timestamp) {
        const wasNearBottom = $messageArea[0].scrollHeight - $messageArea.scrollTop() - $messageArea.innerHeight() < 90;
        const message = {
            id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            role,
            content,
            model: model || currentModelId,
            timestamp: timestamp || new Date().toISOString()
        };
        const $message = $("<article>", { class: `chat-message ${role}` });
        $("<div>", { class: "chat-bubble", text: message.content }).appendTo($message);
        $("<div>", { class: "message-meta" })
            .append($("<span>", { text: message.model }))
            .append($("<span>", { text: "·" }))
            .append($("<time>", { datetime: message.timestamp, text: formatTime(message.timestamp) }))
            .appendTo($message);
        $messageArea.append($message);
        conversationMessages.push(message);
        $messageArea.addClass("is-active");
        $("#chatContent").addClass("has-messages");
        if (role === "user" || wasNearBottom) {
            $messageArea.stop().animate({ scrollTop: $messageArea[0].scrollHeight }, 220);
        }
        return message;
    }

    function resizeComposer() {
        $messageInput.css("height", "auto");
        const maxHeight = 150;
        const nextHeight = Math.min($messageInput[0].scrollHeight, maxHeight);
        $messageInput.css("height", `${nextHeight}px`);
        $messageInput.toggleClass("is-overflowing", $messageInput[0].scrollHeight > maxHeight);
    }

    function setLoading(isLoading) {
        $sendButton.toggleClass("is-loading", isLoading).prop("disabled", isLoading);
        $sendButton.find("i").toggleClass("bi-arrow-up", !isLoading).toggleClass("bi-three-dots", isLoading);
    }

    function updateRecentChat(message) {
        const $recent = $("#recentChats");
        const title = message.content.length > 30 ? `${message.content.slice(0, 30)}…` : message.content;
        const $todayItems = $recent.find('[data-recent-group="today"] .ls-recent-items');
        const $row = $("<div>", {
            class: "ls-recent-row active",
            role: "listitem",
            "data-chat-title": title
        });
        $("<button>", { class: "ls-recent-item", type: "button" })
            .append($("<span>", { class: "ls-recent-title", text: title }))
            .append($("<time>", { text: formatTime(message.timestamp) }))
            .appendTo($row);
        $("<button>", {
            class: "ls-recent-menu-toggle",
            type: "button",
            "aria-label": `گزینه‌های ${title}`,
            "aria-expanded": "false"
        }).append($("<i>", { class: "bi bi-three-dots" })).appendTo($row);
        $("<div>", { class: "ls-recent-menu", role: "menu" })
            .append($("<button>", { type: "button", "data-action": "rename" }).append($("<i>", { class: "bi bi-pencil" }), " تغییر نام"))
            .append($("<button>", { type: "button", "data-action": "delete" }).append($("<i>", { class: "bi bi-trash3" }), " حذف"))
            .appendTo($row);
        $recent.find(".ls-recent-row.active").removeClass("active");
        $todayItems.prepend($row);
        $recent.find(".ls-recent-empty").prop("hidden", false).attr("hidden", true);
    }

    function saveConversationToRecent() {
        if (conversationSaved || !conversationMessages.length) return;
        const firstUserMessage = conversationMessages.find((message) => message.role === "user");
        if (!firstUserMessage) return;
        updateRecentChat(firstUserMessage);
        conversationSaved = true;
    }

    function startNewChat() {
        saveConversationToRecent();
        conversationMessages = [];
        conversationSaved = false;
        $messageArea.empty().removeClass("is-active");
        $("#chatContent").removeClass("has-messages");
        $suggestion.show();
        $extensions.show();
        $messageInput.val("");
        resizeComposer();
        $messageInput.trigger("focus");
    }

    function sendMessage(text) {
        const userMessage = appendMessage(text, "user");
        $messageInput.val("");
        resizeComposer();
        $suggestion.hide();
        setLoading(true);

        window.setTimeout(() => {
            appendMessage(`این یک پاسخ آزمایشی برای: ${text}`, "assistant");
            setLoading(false);
        }, 650);
    }

    $("#composerForm").on("submit", function (event) {
        event.preventDefault();
        const text = $messageInput.val().trim();
        if (text && !$sendButton.prop("disabled")) sendMessage(text);
    });

    $messageInput.on("input", resizeComposer).on("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            $("#composerForm").trigger("submit");
        }
    });

    $(".ls-menu .ls-item:first-child").on("click", function (event) {
        event.preventDefault();
        startNewChat();
    });

    $("#recentChats")
        .on("click", ".ls-recent-item", function () {
            const $row = $(this).closest(".ls-recent-row");
            $("#recentChats .ls-recent-row").removeClass("active");
            $row.addClass("active");
            $("#recentChats .ls-recent-menu").removeClass("open");
            $("#recentChats .ls-recent-menu-toggle").attr("aria-expanded", "false");
        })
        .on("click", ".ls-recent-menu-toggle", function (event) {
            event.stopPropagation();
            const $toggle = $(this);
            const $menu = $toggle.siblings(".ls-recent-menu");
            $("#recentChats .ls-recent-menu").not($menu).removeClass("open");
            $("#recentChats .ls-recent-menu-toggle").not($toggle).attr("aria-expanded", "false");
            $menu.toggleClass("open");
            $toggle.attr("aria-expanded", $menu.hasClass("open"));
        })
        .on("click", ".ls-recent-menu button", function (event) {
            event.stopPropagation();
            const $button = $(this);
            const $row = $button.closest(".ls-recent-row");
            const action = $button.data("action");
            if (action === "delete") {
                $row.remove();
                const hasRows = $("#recentChats .ls-recent-row").length > 0;
                $("#recentChats .ls-recent-empty").prop("hidden", hasRows);
            } else if (action === "rename") {
                const currentTitle = $row.attr("data-chat-title");
                const nextTitle = window.prompt("نام جدید گفتگو را وارد کنید:", currentTitle);
                if (nextTitle && nextTitle.trim()) {
                    const cleanTitle = nextTitle.trim();
                    $row.attr("data-chat-title", cleanTitle);
                    $row.find(".ls-recent-title").text(cleanTitle);
                    $row.find(".ls-recent-menu-toggle").attr("aria-label", `گزینه‌های ${cleanTitle}`);
                }
            }
            $row.find(".ls-recent-menu").removeClass("open");
            $row.find(".ls-recent-menu-toggle").attr("aria-expanded", "false");
        });
    $(document).on("click", function () {
        $("#recentChats .ls-recent-menu").removeClass("open");
        $("#recentChats .ls-recent-menu-toggle").attr("aria-expanded", "false");
    });

    $(".model-select-btn").on("click", function (event) {
        event.stopPropagation();
        const isOpen = $(".model-selector-dd").toggleClass("open").hasClass("open");
        $(this).attr("aria-expanded", isOpen);
    });
    $(document).on("click", function () {
        $(".model-selector-dd").removeClass("open");
        $(".model-select-btn").attr("aria-expanded", "false");
    });
    $(".model-item").on("click", function (event) {
        event.preventDefault();
        currentModelId = $(this).data("model-id");
        localStorage.setItem("selectedModel", currentModelId);
        $(".model-item").removeClass("active");
        $(this).addClass("active");
        $(".model-select-btn span").text(MODEL_NAMES[currentModelId] || currentModelId);
    });

    function toggleSidebar() {
        const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
        if (isMobile) {
            const isOpen = $("#sidebarPanel").toggleClass("open").hasClass("open");
            $("#sidebarOverlay").toggleClass("show", isOpen);
            $("#mobileSidebarToggle").attr("aria-expanded", isOpen);
            return;
        }

        const isCollapsed = $("body").toggleClass("sidebar-collapsed").hasClass("sidebar-collapsed");
        $("#mobileSidebarToggle").toggleClass("show-desktop", isCollapsed).attr("aria-expanded", !isCollapsed);
    }
    $("#mobileSidebarToggle, #sidebarPanel .sidebar-icon:first-child").on("click", toggleSidebar);
    $("#sidebarOverlay").on("click", toggleSidebar);

    resizeComposer();
});
