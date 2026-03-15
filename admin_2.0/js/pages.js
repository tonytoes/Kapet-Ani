/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — PAGES EDITOR
   ═══════════════════════════════════════════════════════ */

/* ── DATA VARIABLES ──────────────────────────────────── */
const pagesData = {
  homepage: {
    title:      "Home Page",
    heading:    "Kapi't Ani",
    subheading: "It is best to start your day with a cup of coffee. Discover the best flavours coffee you will ever have.",
  },
  aboutus: {
    title:   "About Us",
    heading: "",
    body:    "",
  },
  contacts: {
    title:   "Contacts",
    email:   "",
    phone:   "",
    address: "",
  },
};

let activePage = "homepage";

/* ── NAV ITEMS ────────────────────────────────────────── */
document.querySelectorAll(".pages-list-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".pages-list-item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    switchPage(item.dataset.target);
  });
});

function switchPage(key) {
  activePage = key;
  const data = pagesData[key] || {};

  // Update editor title
  document.getElementById("editorTitle").textContent = data.title || key;

  // Show/hide field groups
  document.getElementById("homepageFields").style.display = key === "homepage" ? "" : "none";
  document.getElementById("aboutusFields").style.display  = key === "aboutus"  ? "" : "none";
  document.getElementById("contactsFields").style.display = key === "contacts" ? "" : "none";

  // Populate fields
  if (key === "homepage") {
    document.getElementById("homepageHeading").value    = data.heading    || "";
    document.getElementById("homepageSubheading").value = data.subheading || "";
  } else if (key === "aboutus") {
    document.getElementById("aboutHeading").value = data.heading || "";
    document.getElementById("aboutBody").value    = data.body    || "";
  } else if (key === "contacts") {
    document.getElementById("contactEmail").value   = data.email   || "";
    document.getElementById("contactPhone").value   = data.phone   || "";
    document.getElementById("contactAddress").value = data.address || "";
  }
}

/* ── UPDATE ───────────────────────────────────────────── */
document.getElementById("pagesUpdateBtn")?.addEventListener("click", () => {
  let updated = {};

  if (activePage === "homepage") {
    updated = {
      heading:    document.getElementById("homepageHeading").value,
      subheading: document.getElementById("homepageSubheading").value,
    };
  } else if (activePage === "aboutus") {
    updated = {
      heading: document.getElementById("aboutHeading").value,
      body:    document.getElementById("aboutBody").value,
    };
  } else if (activePage === "contacts") {
    updated = {
      email:   document.getElementById("contactEmail").value,
      phone:   document.getElementById("contactPhone").value,
      address: document.getElementById("contactAddress").value,
    };
  }

  // TODO: send PATCH to backend for page `activePage` with `updated`
  console.log("Update page:", activePage, updated);
});

/* ── CANCEL ───────────────────────────────────────────── */
document.getElementById("pagesCancelBtn")?.addEventListener("click", () => {
  switchPage(activePage); // re-fills from data = discards edits
});

/* ── INIT ─────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  switchPage("homepage");
});
