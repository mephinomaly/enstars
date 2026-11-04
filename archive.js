
const characterGrid = document.getElementById("character-grid");
const storyList = document.getElementById("story-list");
const searchInput = document.getElementById("search");
const unitFilter = document.getElementById("unit-filter");
const typeFilter = document.getElementById("type-filter");
const resultCount = document.getElementById("result-count");

let characters = [];
let stories = [];
let selectedCharacters = [];

const unitNames = {
    undead: "Undead",
    eden: "Eden"
};

function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
}

function renderCharacters() {
    characterGrid.replaceChildren();

    const visibleCharacters = characters.filter(character => {
        return !unitFilter.value || character.unit === unitFilter.value;
    });

    visibleCharacters.forEach(character => {
        const button = makeElement("button", "character-button");
        button.type = "button";
        button.classList.toggle(
            "selected",
            selectedCharacters.includes(character.id)
        );
        button.setAttribute(
            "aria-pressed",
            selectedCharacters.includes(character.id)
        );
        button.setAttribute(
            "aria-label",
            "Filter by " + character.name
        );

        const placeholder = makeElement(
            "div",
            "character-placeholder",
            character.name.charAt(0)
        );

        if (character.image) {
            const image = document.createElement("img");
            image.src = character.image;
            image.alt = character.name;
            image.loading = "lazy";

            image.addEventListener("error", () => {
                image.replaceWith(placeholder);
            });

            button.appendChild(image);
        } else {
            button.appendChild(placeholder);
        }

     button.title = character.name;

        button.addEventListener("click", () => {
            if (selectedCharacters.includes(character.id)) {
                selectedCharacters = selectedCharacters.filter(
                    id => id !== character.id
                );
            } else {
                selectedCharacters.push(character.id);
            }

            renderCharacters();
            renderStories();
        });

        characterGrid.appendChild(button);
    });
}


function renderStories() {
    const search = searchInput.value.trim().toLowerCase();

    const filteredStories = stories.filter(story => {
        const storyCharacters = (story.characters || [])
            .map(id => characters.find(character => character.id === id))
            .filter(Boolean);

        const searchableText = [
            story.title,
            story.description,
            story.type,
            story.unit,
            ...storyCharacters.map(character => character.name)
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(search);

        const matchesUnit =
            !unitFilter.value || story.unit === unitFilter.value;

        const matchesType =
            !typeFilter.value || story.type === typeFilter.value;

        const matchesCharacters = selectedCharacters.every(id =>
            (story.characters || []).includes(id)
        );

        return (
            matchesSearch &&
            matchesUnit &&
            matchesType &&
            matchesCharacters
        );
    });

    storyList.replaceChildren();

    resultCount.textContent =
        filteredStories.length +
        (filteredStories.length === 1 ? " story" : " stories");

    if (filteredStories.length === 0) {
        const empty = makeElement(
            "div",
            "empty-state",
            "No translations found ♡ Try changing your search or filters."
        );

        storyList.appendChild(empty);
        return;
    }

    filteredStories.forEach(story => {
        // Create the expandable card
        const card = makeElement("details", "story-card");

        // The always-visible part of the card
        const summary = makeElement("summary", "story-card-summary");

        // Story thumbnail
        const thumbnail = makeElement("div", "story-thumbnail");

        if (story.image) {
            const image = document.createElement("img");
            image.src = story.image;
            image.alt = story.title;
            image.loading = "lazy";

            image.addEventListener("error", () => {
                image.replaceWith(
                    makeElement("span", "story-image-placeholder", "♡")
                );
            });

            thumbnail.appendChild(image);
        } else {
            thumbnail.appendChild(
                makeElement("span", "story-image-placeholder", "♡")
            );
        }

        summary.appendChild(thumbnail);

        // Title and story information
        const heading = makeElement("div", "story-heading");

        heading.appendChild(
            makeElement("h3", "story-title", story.title)
        );

        const typeName = (story.type || "story")
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, letter => letter.toUpperCase());

        heading.appendChild(
            makeElement("span", "story-type", typeName)
        );

        summary.appendChild(heading);

        // Expand arrow
        summary.appendChild(
            makeElement("span", "story-chevron", "⌄")
        );

        card.appendChild(summary);

        // The expandable content
        const expanded = makeElement("div", "story-expanded");

        const storyCharacters = (story.characters || [])
            .map(id => characters.find(character => character.id === id))
            .filter(Boolean);

        if (storyCharacters.length) {
            expanded.appendChild(
                makeElement("h4", "expanded-heading", "Characters")
            );

            const characterRow = makeElement(
                "div",
                "story-character-list"
            );

            storyCharacters.forEach(character => {
                const characterItem = makeElement(
                    "div",
                    "story-character"
                );

                if (character.image) {
                    const image = document.createElement("img");
                    image.src = character.image;
                    image.alt = character.name;
                    image.loading = "lazy";

                    image.addEventListener("error", () => {
                        image.replaceWith(
                            makeElement(
                                "span",
                                "story-character-placeholder",
                                character.name.charAt(0)
                            )
                        );
                    });

                    characterItem.appendChild(image);
                } else {
                    characterItem.appendChild(
                        makeElement(
                            "span",
                            "story-character-placeholder",
                            character.name.charAt(0)
                        )
                    );
                }

                characterItem.appendChild(
                    makeElement("span", "", character.name)
                );

                characterRow.appendChild(characterItem);
            });

            expanded.appendChild(characterRow);
        }

        // Story description
        if (story.description) {
            expanded.appendChild(
                makeElement("h4", "expanded-heading", "Summary")
            );

            expanded.appendChild(
                makeElement("p", "story-description", story.description)
            );
        }

        // Read story link
        const link = makeElement(
            "a",
            "story-link",
            "Read translation →"
        );

        link.href = story.url;

        expanded.appendChild(link);
        card.appendChild(expanded);

        storyList.appendChild(card);
    });
}


function clearFilters() {
    searchInput.value = "";
    unitFilter.value = "";
    typeFilter.value = "";
    selectedCharacters = [];

    renderCharacters();
    renderStories();
}

async function loadArchive() {
    try {
        const response = await fetch("./data/stories.json");

        if (!response.ok) {
            throw new Error("Could not load stories.json");
        }

        const data = await response.json();

        characters = data.characters || [];
        stories = data.stories || [];

        renderCharacters();
        renderStories();

    } catch (error) {
        console.error(error);

        characterGrid.textContent = "Could not load character information.";

        storyList.textContent =
            "Could not load the archive. Please check data/stories.json.";
    }
}

searchInput.addEventListener("input", renderStories);

unitFilter.addEventListener("change", () => {
    selectedCharacters = selectedCharacters.filter(id => {
        const character = characters.find(item => item.id === id);
        return character &&
            (!unitFilter.value || character.unit === unitFilter.value);
    });

    renderCharacters();
    renderStories();
});

typeFilter.addEventListener("change", renderStories);

document.getElementById("clear-filters")
    .addEventListener("click", clearFilters);

// Light/dark theme toggle
const themeButton = document.getElementById("theme-toggle");

function updateThemeButton() {
    const isDark =
        document.documentElement.dataset.theme === "dark";

    themeButton.textContent = isDark
        ? "☀ Light mode"
        : "☾ Dark mode";
}

themeButton.addEventListener("click", () => {
    const isDark =
        document.documentElement.dataset.theme === "dark";

    const nextTheme = isDark ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("archive-theme", nextTheme);

    updateThemeButton();
});

updateThemeButton();
loadArchive();
