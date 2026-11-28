
document.addEventListener("DOMContentLoaded", () => {
    const galleryLinks = Array.from(
        document.querySelectorAll(".card-cg-pair a")
    );

    if (!galleryLinks.length) return;

    let currentIndex = 0;

// uhhhhhhhhhh lightbox
    const lightbox = document.createElement("div");
    lightbox.className = "card-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Card artwork gallery");

    lightbox.innerHTML = `
        <button class="card-lightbox-close" aria-label="Close gallery">
            &times;
        </button>
        <button class="card-lightbox-prev" aria-label="Previous image">
            &#10094;
        </button>
        <img class="card-lightbox-image" src="" alt="">
        <button class="card-lightbox-next" aria-label="Next image">
            &#10095;
        </button>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".card-lightbox-image");
    const closeButton = lightbox.querySelector(".card-lightbox-close");
    const prevButton = lightbox.querySelector(".card-lightbox-prev");
    const nextButton = lightbox.querySelector(".card-lightbox-next");


    function showImage(index) {
        currentIndex = (index + galleryLinks.length) % galleryLinks.length;

        const link = galleryLinks[currentIndex];
        const image = link.querySelector("img");

        lightboxImage.src = link.href;
        lightboxImage.alt = image.alt;
    }

    galleryLinks.forEach((link, index) => {
        link.addEventListener("click", event => {
            event.preventDefault();

            showImage(index);
            lightbox.classList.add("is-open");
            closeButton.focus();
        });
    });

    prevButton.addEventListener("click", () => {
        showImage(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showImage(currentIndex + 1);
    });

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        lightboxImage.src = "";
    }

    closeButton.addEventListener("click", closeLightbox);

    
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

  
    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            showImage(currentIndex - 1);
        } else if (event.key === "ArrowRight") {
            showImage(currentIndex + 1);
        }
    });
});
