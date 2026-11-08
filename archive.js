
const characterGrid = document.getElementById("character-grid");
const storyList = document.getElementById("story-list");
const searchInput = document.getElementById("search");
const unitFilter = document.getElementById("unit-filter");
const typeFilter = document.getElementById("type-filter");
const resultCount = document.getElementById("result-count");
const agencyTabs = document.getElementById("agency-tabs");
const agencyHeading = document.getElementById("agency-heading");
const undeadQuickGrid = document.getElementById("undead-quick-grid");
const latestUpdateContent = document.getElementById("latest-update-content");

let characters = [];
let stories = [];
let selectedCharacters = [];
let currentAgency = "starmaker";

const agencies = [
    { id: "starmaker", name: "STARMAKER PRODUCTION" },
    { id: "cosmic-production", name: "COSMIC PRODUCTION" },
    { id: "rhythm-link", name: "Rhythm Link" },
    { id: "new-dimension", name: "NEW DIMENSION" }
];

const unitNames = {
    undead: "UNDEAD",
    eden: "Eden",
    alkaloid: "ALKALOID"
};

function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
}

function renderUndeadQuickFilters() {
    undeadQuickGrid.replaceChildren();

    const undeadCharacters = characters.filter(
        character => character.unit === "undead"
    );

    undeadCharacters.forEach(character => {
        const button = makeElement(
            "button",
            "quick-character-button"
        );

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

        const name = makeElement(
            "span",
            "quick-character-name",
            character.name
        );

        button.appendChild(name);

        button.addEventListener("click", () => {
            if (selectedCharacters.includes(character.id)) {
                selectedCharacters = selectedCharacters.filter(
                    id => id !== character.id
                );
            } else {
                selectedCharacters.push(character.id);
            }

            renderUndeadQuickFilters();
            renderCharacters();
            renderStoriesWithTransition();
        });

        undeadQuickGrid.appendChild(button);
    });
}
function renderLatestUpdate() {
    latestUpdateContent.replaceChildren();

    const latestStory = stories
        .filter(story => story.latestChapter && story.latestChapter.dateAdded)
       .sort((a, b) =>
    new Date(b.latestChapter.dateAdded) -
    new Date(a.latestChapter.dateAdded) ||
    new Date(b.dateAdded) -
    new Date(a.dateAdded)
)[0];

    if (!latestStory) {
        latestUpdateContent.textContent = "No updates available yet ♡";
        return;
    }

    const layout = makeElement("div", "latest-update-layout");
    const textContent = makeElement("div", "latest-update-text");

    const storyTitle = makeElement(
        "h4",
        "latest-story-title",
        latestStory.title
    );

    const chapterTitle = makeElement(
        "p",
        "latest-chapter-title",
        latestStory.latestChapter.title
    );

    const characterNames = (latestStory.characters || [])
        .map(id => characters.find(character => character.id === id))
        .filter(Boolean)
        .map(character => character.name);

    const featuredCharacters = makeElement(
        "p",
        "latest-characters",
        "Featuring: " + characterNames.join(", ")
    );

    const link = document.createElement("a");
    link.className = "latest-link";
    link.href = latestStory.latestChapter.url;
    link.textContent = "View latest chapter →";

    const cover = document.createElement("img");
    cover.className = "latest-update-image";
    cover.src = latestStory.image;
    cover.alt = latestStory.title + " cover";
    cover.loading = "lazy";

    cover.addEventListener("error", () => {
        cover.remove();
    });

    textContent.appendChild(storyTitle);
    textContent.appendChild(chapterTitle);
    textContent.appendChild(featuredCharacters);
    textContent.appendChild(link);

    layout.appendChild(textContent);
    layout.appendChild(cover);

    latestUpdateContent.appendChild(layout);
}
function renderCharacters() {
    characterGrid.replaceChildren();
    agencyTabs.replaceChildren();

    const agency = agencies.find(item => item.id === currentAgency);

    agencyHeading.textContent = agency ? agency.name : "";

    // Create the agency navigation buttons
    agencies.forEach(item => {
        const button = makeElement(
            "button",
            "agency-tab",
            item.name
        );

        button.type = "button";
        button.classList.toggle("active", item.id === currentAgency);
        button.setAttribute("aria-pressed", item.id === currentAgency);

       button.addEventListener("click", () => {
    if (currentAgency === item.id) return;

    characterGrid.classList.add("changing");

    setTimeout(() => {
        currentAgency = item.id;
        renderCharacters();
        characterGrid.classList.remove("changing");
    }, 300);
});

        agencyTabs.appendChild(button);
    });

    // Get characters belonging to the selected agency
    const agencyCharacters = characters.filter(
        character => character.agency === currentAgency
    );

    // Group characters by unit
   const units = [...new Set(
    agencyCharacters.map(character => character.unit)
)];

const unitOrder = [
    "undead",
    "eden",
    "fine",
    "alkaloid",
    "akatsuki",
    "mellow-dear-us"
];

units.sort((a, b) => unitOrder.indexOf(a) - unitOrder.indexOf(b));

    const unitNames = {
        undead: "UNDEAD",
        eden: "Eden",
        alkaloid: "ALKALOID",
        akatsuki: "AKATSUKI",
        fine: "fine",
        "mellow-dear-us": "MELLOW DEAR US"
    };

    units.forEach(unit => {
        const unitCharacters = agencyCharacters.filter(
            character => character.unit === unit
        );
const unitSection = makeElement("div", "unit-section");
        // Clickable unit heading
        const allSelected = unitCharacters.every(character =>
            selectedCharacters.includes(character.id)
        );

        const unitButton = makeElement(
            "button",
            "unit-heading",
            unitNames[unit] || unit
        );

        unitButton.type = "button";
        unitButton.classList.toggle("selected", allSelected);
        unitButton.setAttribute("aria-pressed", allSelected);

        unitButton.addEventListener("click", () => {
            if (unitCharacters.every(character =>
                selectedCharacters.includes(character.id)
            )) {
                selectedCharacters = selectedCharacters.filter(
                    id => !unitCharacters.some(character =>
                        character.id === id
                    )
                );
            } else {
                unitCharacters.forEach(character => {
                    if (!selectedCharacters.includes(character.id)) {
                        selectedCharacters.push(character.id);
                    }
                });
            }

           renderCharacters();
renderUndeadQuickFilters();
renderStoriesWithTransition();
        });

      unitSection.appendChild(unitButton);

        // Character portraits
        const characterRow = makeElement("div", "unit-characters");

        unitCharacters.forEach(character => {
            const button = makeElement("button", "character-button");
            button.type = "button";

            button.classList.toggle(
                "selected",
                selectedCharacters.includes(character.id)
            );

            button.classList.toggle(
                "unit-selected",
                unitFilter.value === character.unit
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
renderUndeadQuickFilters();
renderStoriesWithTransition();
            });

            characterRow.appendChild(button);
        });

      unitSection.appendChild(characterRow);
characterGrid.appendChild(unitSection);
    });

    if (agencyCharacters.length === 0) {
        characterGrid.appendChild(
            makeElement("p", "empty-state", "No characters added yet ♡")
        );
    }
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

        const unitCharacters = unitFilter.value
    ? characters
        .filter(character => character.unit === unitFilter.value)
        .map(character => character.id)
    : [];

const matchesUnit = unitCharacters.every(id =>
    (story.characters || []).includes(id)
);

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

   filteredStories
    .sort((a, b) => new Date(b.eventDate || "1900-01-01") - new Date(a.eventDate || "1900-01-01"))
    .forEach(story => {
        // Create the expandable card
        const card = makeElement("details", "story-card");
        if (story.type === "idol") {
    card.classList.add("idol-story-card");
}

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

link.addEventListener("click", event => {
    event.preventDefault();

    const destination = link.href;

    document.body.classList.add("page-leaving");
    console.log("Read translation fade triggered!");

    setTimeout(() => {
        window.location.href = destination;
    }, 220);
});

expanded.appendChild(link);
        card.appendChild(expanded);

        storyList.appendChild(card);
    });
}

// Gently transition when story results update
let storyTransitionTimer;

function renderStoriesWithTransition() {
    clearTimeout(storyTransitionTimer);

    storyList.classList.add("is-updating");

    storyTransitionTimer = setTimeout(() => {
        renderStories();

        requestAnimationFrame(() => {
            storyList.classList.remove("is-updating");
        });
    }, 90);
}
function clearFilters() {
    searchInput.value = "";
    unitFilter.value = "";
    typeFilter.value = "";
    selectedCharacters = [];

  renderCharacters();
renderUndeadQuickFilters();
renderStoriesWithTransition();
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
renderUndeadQuickFilters();
renderLatestUpdate();
renderStories();

    } catch (error) {
        console.error(error);

        characterGrid.textContent = "Could not load character information.";

        storyList.textContent =
            "Could not load the archive. Please check data/stories.json.";
    }
}

searchInput.addEventListener("input", renderStoriesWithTransition);

unitFilter.addEventListener("change", () => {
    renderCharacters();
    renderStoriesWithTransition();
});

typeFilter.addEventListener("change", renderStoriesWithTransition);

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
