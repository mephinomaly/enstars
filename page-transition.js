// Soft page transitions
document.addEventListener("DOMContentLoaded", () => {
        // Fade in when the page loads
    document.body.classList.add("page-ready");

    // Fade out gently when navigating to another page
    document.querySelectorAll("a[href]").forEach(link => {

        link.addEventListener("click", event => {
            const destination = new URL(link.href, window.location.href);

            // Ignore external links and special link behaviours
            if (
                destination.origin !== window.location.origin ||
                link.target === "_blank" ||
                link.hasAttribute("download") ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            event.preventDefault();

            document.body.classList.add("page-leaving");

            setTimeout(() => {
                window.location.href = destination.href;
            }, 220);
        });
    });
});
