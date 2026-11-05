document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-ready");
});

document.addEventListener("click", event => {
    const link = event.composedPath().find(
    element => element instanceof HTMLAnchorElement
);

    if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
    ) return;

    const destination = new URL(link.href, window.location.href);

    if (destination.origin !== window.location.origin) return;

    event.preventDefault();
    document.body.classList.add("page-leaving");

    setTimeout(() => {
        window.location.href = destination.href;
    }, 220);
});
