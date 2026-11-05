
document.addEventListener("DOMContentLoaded", () => {
    const galleryLinks = document.querySelectorAll(".card-cg-pair a");

    if (!galleryLinks.length) return;

    // Create the lightbox
    const lightbox = document.createElement("div");
    lightbox.className = "card-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Card artwork preview");

    lightbox.innerHTML = `
        <button class="card-lightbox-close" aria-label="Close image">
            &times;
        </button>
        <img class="card-lightbox-image" src="" alt="">
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".card-lightbox-image");
    const closeButton = lightbox.querySelector(".card-lightbox-close");

    // Open the lightbox
    galleryLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const image = link.querySelector("img");

            lightboxImage.src = link.href;
            lightboxImage.alt = image.alt;

            lightbox.classList.add("is-open");
            closeButton.focus();
        });
    });

    // Close the lightbox
    function closeLightbox() {
        lightbox.classList.remove("is-open");
        lightboxImage.src = "";
    }

    closeButton.addEventListener("click", closeLightbox);

    // Close when clicking the dark background
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Close with Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });
});
