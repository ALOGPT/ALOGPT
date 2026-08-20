$(document).ready(function () {

    const API_BASE = "http://185.105.239.203/api/v1";

    let verificationId = null;
    let currentPhone = null;

    // محدود کردن اینپوت شماره موبایل فقط به عدد
    $("#phoneInput").on("keydown", function (e) {
        const allowedKeys = [
            "Backspace", "Delete", "Tab", "Escape", "Enter",
            "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"
        ];

        if (e.ctrlKey || e.metaKey) return;
        if (allowedKeys.includes(e.key)) return;
        if (!/^\d$/.test(e.key)) e.preventDefault();
    });

    $("#phoneInput").on("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });

    // محدود کردن اینپوت کد تایید فقط به عدد
    $("#otpInput").on("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });

    $("#sendOtpBtn").on("click", async function () {
        const phone = $("#phoneInput").val().trim();
        $("#phoneError").text("");

        if (!/^09\d{9}$/.test(phone)) {
            $("#phoneError").text("شماره موبایل معتبر نیست.");
            return;
        }

        $(this).prop("disabled", true).text("در حال ارسال...");

        try {
            const response = await fetch(API_BASE + "/auth/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                $("#phoneError").text(data.error?.message || "خطایی رخ داد.");
                $(this).prop("disabled", false).text("ارسال کد تایید");
                return;
            }

            verificationId = data.data.verification_id;
            currentPhone = phone;

            $("#otpPhoneDisplay").text(phone);
            $("#stepPhone").fadeOut(200, function () {
                $("#stepOtp").fadeIn(200);
            });

        } catch (err) {
            console.error(err);
            $("#phoneError").text("مشکلی در ارتباط با سرور پیش اومد.");
        }

        $(this).prop("disabled", false).text("ارسال کد تایید");
    });

    $("#verifyOtpBtn").on("click", async function () {
        const otp = $("#otpInput").val().trim();
        $("#otpError").text("");

        if (otp.length < 4) {
            $("#otpError").text("کد تایید معتبر نیست.");
            return;
        }

        $(this).prop("disabled", true).text("در حال بررسی...");

        try {
            const response = await fetch(API_BASE + "/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: currentPhone,
                    otp: otp,
                    verification_id: verificationId,
                    device_name: navigator.userAgent
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                $("#otpError").text(data.error?.message || "کد نادرست است.");
                $(this).prop("disabled", false).text("تایید و ورود");
                return;
            }

            localStorage.setItem("accessToken", data.data.access_token);
            localStorage.setItem("refreshToken", data.data.refresh_token);

            window.location.href = "/html/chatpaige.html";

        } catch (err) {
            console.error(err);
            $("#otpError").text("مشکلی در ارتباط با سرور پیش اومد.");
            $(this).prop("disabled", false).text("تایید و ورود");
        }
    });

    $("#backToPhone").on("click", function (e) {
        e.preventDefault();
        $("#stepOtp").fadeOut(200, function () {
            $("#stepPhone").fadeIn(200);
        });
    });

});
