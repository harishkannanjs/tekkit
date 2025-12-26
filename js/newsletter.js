document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("brxe-cquari");
    const submitBtn = document.getElementById("newsletter-submit");
    const popup = document.getElementById("newsletter-popup");

    // If page doesn't have footer, do nothing
    if (!form || !submitBtn || !popup) return;

    const textEl = submitBtn.querySelector(".text");
    const loaderEl = submitBtn.querySelector(".loading");
    const emailInput = form.querySelector('input[type="email"]');

    const popupMsg = document.getElementById("popup-message");
    const popupClose = document.getElementById("popup-close");
    const popupBox = popup.querySelector(".popup-box");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email) {
            showPopup("Please enter a valid email.", true);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "https://tekkit.netlify.app/.netlify/functions/newsletter-subscribe",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Subscription failed");
            }

            emailInput.value = "";
            showPopup("🎉 You’re successfully subscribed!");
        } catch (err) {
            showPopup(err.message || "Something went wrong", true);
        } finally {
            setLoading(false);
        }
    });

    popupClose.addEventListener("click", () => {
        popup.classList.add("hidden");
    });

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            textEl.style.display = "none";
            loaderEl.style.display = "inline-block";
        } else {
            submitBtn.disabled = false;
            loaderEl.style.display = "none";
            textEl.style.display = "inline";
        }
    }

    function showPopup(message, isError = false) {
        popupMsg.textContent = message;
        popupBox.classList.toggle("error", isError);
        popup.classList.remove("hidden");
    }
});
