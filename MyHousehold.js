// localStorage.clear();
// Sample data, used the first time the page is opened. After that, profiles and
// chores are saved in localStorage so they stick around between visits.
const defaultProfiles = [
    { name: "Carlo", skill: "Intermediate", allergies: ["Shellfish"] },
    { name: "Arthur", skill: "Beginner", allergies: [] },
    { name: "Nick", skill: "Advanced", allergies: ["Peanuts", "Dairy"] }
];

const defaultChores = [
    { name: "Wipe counters", category: "Cleaning", person: "Carlo", day: "Mon", done: false },
    { name: "Unload dishwasher", category: "Cleaning", person: "Arthur", day: "Mon", done: false },
    { name: "Take out trash", category: "Trash Duty", person: "Nick", day: "Tue", done: false },
    { name: "Take out recycling", category: "Trash Duty", person: "Arthur", day: "Thu", done: false },
    { name: "Costco run", category: "Shopping", person: "Carlo", day: "Sat", done: false }
];

const CHORE_CATEGORIES = ["Cleaning", "Trash Duty", "Shopping"];

const profiles = JSON.parse(localStorage.getItem("profiles")) ?? defaultProfiles;
const chores = JSON.parse(localStorage.getItem("chores")) ?? defaultChores;

let selectedCategory = "All";
let editingProfile = null; // null when adding a new profile

const profileList = document.getElementById("profileList");
const choreList = document.getElementById("choreList");
const profileDialog = document.getElementById("profileDialog");
const profileForm = document.getElementById("profileForm");
const choreDialog = document.getElementById("choreDialog");
const choreForm = document.getElementById("choreForm");

function saveData() {
    localStorage.setItem("profiles", JSON.stringify(profiles));
    localStorage.setItem("chores", JSON.stringify(chores));
}

function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

// Profiles
function makeProfileCard(profile) {
    const card = makeElement("div", "profile_card");
    card.appendChild(makeElement("div", profile.name.charAt(0).toUpperCase()));

    const info = makeElement("div", "profile_info");
    const nameRow = makeElement("div", "profile_name_row");
    nameRow.appendChild(makeElement("span", "task_title", profile.name));
    nameRow.appendChild(makeElement("span", "skill_badge " + profile.skill, profile.skill));
    info.appendChild(nameRow);

    const allergyRow = makeElement("div", "chips");
    allergyRow.appendChild(makeElement("span", "chips_label", "Allergies:"));
    if (profile.allergies.length === 0) {
        allergyRow.appendChild(makeElement("span", "chip none", "None"));
    }
    for (const allergy of profile.allergies) {
        allergyRow.appendChild(makeElement("span", "chip", allergy));
    }
    info.appendChild(allergyRow);
    card.appendChild(info);

    const actions = makeElement("div", "card_actions");
    const editButton = makeElement("button", "small_button", "Edit");
    editButton.addEventListener("click", () => openProfileDialog(profile));
    const removeButton = makeElement("button", "small_button", "Remove");
    removeButton.addEventListener("click", () => removeProfile(profile));
    actions.appendChild(editButton);
    actions.appendChild(removeButton);
    card.appendChild(actions);

    return card;
}

function renderProfiles() {
    profileList.innerHTML = "";
    if (profiles.length === 0) {
        profileList.appendChild(makeElement("p", "empty_note", "No profiles yet. Tap \"+ Add\" to create yours."));
        return;
    }
    for (const profile of profiles) {
        profileList.appendChild(makeProfileCard(profile));
    }
}

function removeProfile(profile) {
    if (!confirm("Remove " + profile.name + "'s profile?")) return;
    profiles.splice(profiles.indexOf(profile), 1);
    // Their chores stay on the list but no longer belong to anyone
    for (const chore of chores) {
        if (chore.person === profile.name) chore.person = "Unassigned";
    }
    saveData();
    renderProfiles();
    renderChores();
}

// Profile dialog
function openProfileDialog(profile) {
    editingProfile = profile;
    profileForm.reset();
    document.getElementById("profileTitle").textContent = profile ? "Edit Profile" : "Add Profile";

    if (profile) {
        document.getElementById("profileName").value = profile.name;
        profileForm.querySelector("input[name='skill'][value='" + profile.skill + "']").checked = true;

        const allergyBoxes = [...profileForm.querySelectorAll("input[name='allergy']")];
        const otherAllergies = [];
        for (const allergy of profile.allergies) {
            const checkbox = allergyBoxes.find(b => b.value === allergy);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                otherAllergies.push(allergy);
            }
        }
        document.getElementById("profileOtherAllergies").value = otherAllergies.join(", ");
    }
    profileDialog.showModal();
}

document.getElementById("addProfileButton").addEventListener("click", () => openProfileDialog(null));
document.getElementById("profileCancel").addEventListener("click", () => profileDialog.close());

profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("profileName").value.trim();
    if (!name) return;

    const allergies = [];
    profileForm.querySelectorAll("input[name='allergy']:checked").forEach(b => allergies.push(b.value));
    for (const other of document.getElementById("profileOtherAllergies").value.split(",")) {
        if (other.trim() && !allergies.includes(other.trim())) allergies.push(other.trim());
    }

    const profile = {
        name: name,
        skill: profileForm.querySelector("input[name='skill']:checked").value,
        allergies: allergies
    };

    if (editingProfile) {
        // Keep chore assignments in sync if the name changed
        for (const chore of chores) {
            if (chore.person === editingProfile.name) chore.person = name;
        }
        Object.assign(editingProfile, profile);
    } else {
        profiles.push(profile);
    }

    saveData();
    profileDialog.close();
    renderProfiles();
    renderChores();
});

// Chores
function makeChoreRow(chore) {
    const row = makeElement("label", "chore");

    const checkbox = makeElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = chore.done;
    checkbox.addEventListener("change", function () {
        chore.done = checkbox.checked;
        saveData();
    });
    row.appendChild(checkbox);

    const text = makeElement("span", "chore_text", chore.name);
    text.appendChild(makeElement("span", "chore_meta", chore.person + "  ·  Due " + chore.day));
    row.appendChild(text);

    const removeButton = makeElement("button", "remove_chore", "✕");
    removeButton.setAttribute("aria-label", "Remove " + chore.name);
    removeButton.addEventListener("click", function (event) {
        event.preventDefault(); // don't also tick the checkbox
        chores.splice(chores.indexOf(chore), 1);
        saveData();
        renderChores();
    });
    row.appendChild(removeButton);

    return row;
}

function renderChores() {
    choreList.innerHTML = "";
    const categories = selectedCategory === "All" ? CHORE_CATEGORIES : [selectedCategory];
    for (const category of categories) {
        choreList.appendChild(makeElement("div", "chore_group_title", category));
        const categoryChores = chores.filter(chore => chore.category === category);
        if (categoryChores.length === 0) {
            choreList.appendChild(makeElement("p", "empty_note", "No " + category.toLowerCase() + " chores."));
        }
        for (const chore of categoryChores) {
            choreList.appendChild(makeChoreRow(chore));
        }
    }
}

// Category pills: show every category, or just one
document.querySelectorAll(".chore_filter").forEach(function (pill) {
    pill.addEventListener("click", function () {
        selectedCategory = pill.dataset.category;
        document.querySelectorAll(".chore_filter").forEach(p =>
            p.classList.toggle("active", p === pill));
        renderChores();
    });
});

// Chore dialog
function openChoreDialog() {
    choreForm.reset();
    if (selectedCategory !== "All") {
        document.getElementById("choreCategory").value = selectedCategory;
    }
    const personSelect = document.getElementById("chorePerson");
    personSelect.innerHTML = "";
    for (const profile of profiles) {
        personSelect.appendChild(makeElement("option", null, profile.name));
    }
    personSelect.appendChild(makeElement("option", null, "Unassigned"));
    choreDialog.showModal();
}

document.getElementById("addChoreButton").addEventListener("click", openChoreDialog);
document.getElementById("choreCancel").addEventListener("click", () => choreDialog.close());

choreForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("choreName").value.trim();
    if (!name) return;
    chores.push({
        name: name,
        category: document.getElementById("choreCategory").value,
        person: document.getElementById("chorePerson").value,
        day: document.getElementById("choreDay").value,
        done: false
    });
    saveData();
    choreDialog.close();
    renderChores();
});

renderProfiles();
renderChores();