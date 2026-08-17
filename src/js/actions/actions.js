import {
  updateTodayNutritionUI,
  updateFoodLogDate,
  renderLoggedItemsList,
} from "../ui/foodLogUI.js";

// DOM Elements
const areasGrid = document.querySelector("#areas-grid");
const sidebarNav = document.querySelector("#sidebar nav");
const searchFiltersSection = document.querySelector("#search-filters-section");
const mealCategoriesSection = document.querySelector(
  "#meal-categories-section",
);
const allRecipesSection = document.querySelector("#all-recipes-section");
const mealDetailsSection = document.querySelector("#meal-details");
const productsSection = document.querySelector("#products-section");
const foodlogSection = document.querySelector("#foodlog-section");
const loadingOverlay = document.querySelector("#app-loading-overlay");
const logMealModal = document.querySelector("#log-meal-modal");
const headerTitle = document.querySelector("#header h1");
const headerSubtitle = document.querySelector("#header p");
const sidebar = document.querySelector("#sidebar");
const sidebarOverlay = document.querySelector("#sidebar-overlay");

// Toggle loading overlay visibility
// isLoading: boolean loading state
export function toggleLoadingOverlay(isLoading) {
  if (!loadingOverlay) return;
  if (isLoading) {
    loadingOverlay.classList.remove("hidden");
  } else {
    loadingOverlay.classList.add("hidden");
  }
}

// Active area button 

export function toggleActiveAreaButton(e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const activeClasses = [
    "bg-emerald-600",
    "text-white",
    "hover:bg-emerald-700",
    "hover:text-white",
  ];
  const inactiveClasses = ["bg-gray-100", "text-gray-700", "hover:bg-gray-200"];

  const allButtons = areasGrid?.querySelectorAll("button") || [];
  allButtons.forEach((button) => {
    button.classList.remove(...activeClasses);
    button.classList.add(...inactiveClasses);
  });

  btn.classList.remove(...inactiveClasses);
  btn.classList.add(...activeClasses);
}

// Highlight active sidebar link by target name or element
export function updateActiveNavLink(activeLinkOrTarget) {
  const activeClasses = ["bg-emerald-50", "text-emerald-700"];
  const inactiveClasses = ["text-gray-600", "hover:bg-gray-50"];

  let activeLink = null;
  if (typeof activeLinkOrTarget === "string") {
    activeLink = document.querySelector(`#sidebar .nav-link[data-target="${activeLinkOrTarget}"]`);
  } else {
    activeLink = activeLinkOrTarget;
  }

  document.querySelectorAll("#sidebar .nav-link").forEach((navLink) => {
    navLink.classList.remove(...activeClasses);
    navLink.classList.add(...inactiveClasses);
    const span = navLink.querySelector("span");
    if (span) {
      span.classList.remove("font-semibold");
      span.classList.add("font-medium");
    }
  });

  if (activeLink) {
    activeLink.classList.remove(...inactiveClasses);
    activeLink.classList.add(...activeClasses);
    const activeSpan = activeLink.querySelector("span");
    if (activeSpan) {
      activeSpan.classList.remove("font-medium");
      activeSpan.classList.add("font-semibold");
    }
  }
}

// Switch visible section
// target: section name string
export function switchActiveSection(target) {
  const allSections = [
    searchFiltersSection,
    mealCategoriesSection,
    allRecipesSection,
    mealDetailsSection,
    productsSection,
    foodlogSection,
  ];

  allSections.forEach((sec) => sec?.classList.add("hidden"));

  if (target === "meals") {
    searchFiltersSection?.classList.remove("hidden");
    mealCategoriesSection?.classList.remove("hidden");
    allRecipesSection?.classList.remove("hidden");

    if (headerTitle) headerTitle.textContent = "Meals & Recipes";
    if (headerSubtitle)
      headerSubtitle.textContent =
        "Discover delicious and nutritious recipes tailored for you";
  } else if (target === "products") {
    productsSection?.classList.remove("hidden");

    if (headerTitle) headerTitle.textContent = "Product Scanner";
    if (headerSubtitle)
      headerSubtitle.textContent = "Search packaged foods by name or barcode";
  } else if (target === "foodlog") {
    foodlogSection?.classList.remove("hidden");
    updateFoodLogDate();
    updateTodayNutritionUI();
    renderLoggedItemsList();

    if (headerTitle) headerTitle.textContent = "Food Log";
    if (headerSubtitle)
      headerSubtitle.textContent = "Track your daily nutrition and food intake";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Toggle sidebar drawer on mobile
export function toggleSidebar(isOpen = false) {
  sidebar?.classList.toggle("open", isOpen);
  sidebarOverlay?.classList.toggle("active", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
}

// Handle sidebar click navigation
export function handleSidebarNavigation(e) {
  const link = e.target.closest(".nav-link");
  if (!link) return;

  e.preventDefault();

  const target = link.dataset.target;
  if (!target) return;

  location.hash = target;
  updateActiveNavLink(target);
  switchActiveSection(target);
  toggleSidebar(false);
}

// Open meal details view
export function openMealDetailsView() {
  searchFiltersSection?.classList.add("hidden");
  mealCategoriesSection?.classList.add("hidden");
  allRecipesSection?.classList.add("hidden");
  mealDetailsSection?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Close meal details view
export function closeMealDetailsView() {
  // stop the iframe video
  const iframe = mealDetailsSection?.querySelector("iframe");
  if (iframe) iframe.src = "";

  mealDetailsSection?.classList.add("hidden");
  searchFiltersSection?.classList.remove("hidden");
  mealCategoriesSection?.classList.remove("hidden");
  allRecipesSection?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Open log meal modal
export function openLogMealModalView() {
  logMealModal?.classList.remove("hidden");
}

// Close log meal modal
export function closeLogMealModalView() {
  logMealModal?.classList.add("hidden");
}
    