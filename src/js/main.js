// Meals state imports
import {
  fetchMeals,
  fetchCategories,
  fetchAreas,
  fetchMealById,
  fetchMealsByCategory,
  fetchMealsByArea,
  fetchMealsSearch,
  fetchNutritionAnalysis,
} from "./state/mealsState.js";

// Products state imports
import {
  fetchProductCategories,
  fetchProductsByCategory,
  fetchSearchProducts,
  fetchProductByBarcode,
} from "./state/productsState.js";

// Storage state imports
import {
  logMealToStorage,
  logProductToStorage,
  removeFoodLogItem,
  clearTodayFoodLog,
} from "./state/storage.js";

// Meals UI imports
import {
  displayMeals,
  displayCategories,
  displayAreaButtons,
  displayMealDetails,
  updateNutritionDetails,
  showRecipesLoading,
  renderLogMealModal,
  updateViewButtonsUI,
} from "./ui/mealsUI.js";

// Products UI imports
import {
  displayProductCategories,
  displayProducts,
  showProductsLoading,
  updateProductModal,
  openProductModal,
  closeProductModal,
} from "./ui/productsUI.js";

// Food Log UI imports
import {
  updateTodayNutritionUI,
  renderLoggedItemsList,
} from "./ui/foodLogUI.js";

// Alert helper import
import { showSuccessAlert } from "./ui/commonUI.js";

// View navigation imports
import {
  toggleActiveAreaButton,
  toggleLoadingOverlay,
  handleSidebarNavigation,
  updateActiveNavLink,
  switchActiveSection,
  openMealDetailsView,
  closeMealDetailsView,
  openLogMealModalView,
  closeLogMealModalView,
  toggleSidebar,
} from "./actions/actions.js";

// Navigation DOM selectors
const sidebarNav = document.querySelector("#sidebar nav");
const headerMenuBtn = document.querySelector("#header-menu-btn");
const sidebarCloseBtn = document.querySelector("#sidebar-close-btn");
const sidebarOverlay = document.querySelector("#sidebar-overlay");
const gridViewBtn = document.querySelector("#grid-view-btn");
const listViewBtn = document.querySelector("#list-view-btn");

// Meals DOM selectors
const searchInput = document.querySelector("#search-input");
const categoriesGrid = document.querySelector("#categories-grid");
const areasGrid = document.querySelector("#areas-grid");
const recipesGrid = document.querySelector("#recipes-grid");
const mealDetails = document.querySelector("#meal-details");

// Log meal modal selectors
const mealServingsInput = document.querySelector("#meal-servings");
const decreaseServingsBtn = document.querySelector("#decrease-servings");
const increaseServingsBtn = document.querySelector("#increase-servings");
const cancelLogMealBtn = document.querySelector("#cancel-log-meal");
const confirmLogMealBtn = document.querySelector("#confirm-log-meal");

// Products DOM selectors
const productCategories = document.querySelector("#product-categories");
const productSearchInput = document.querySelector("#product-search-input");
const productSearchBtn = document.querySelector("#search-product-btn");
const barcodeInput = document.querySelector("#barcode-input");
const lookupBarcodeBtn = document.querySelector("#lookup-barcode-btn");
const productsGridEl = document.querySelector("#products-grid");

// Food log DOM selectors
const loggedItemsList = document.querySelector("#logged-items-list");
const clearFoodLogBtn = document.querySelector("#clear-foodlog");

// Application state variables
let currentMeal = null;
let currentNutrition = null;
let currentMealsList = [];
let currentProduct = null;
let currentProductsList = [];
let currentViewMode = "grid";

// Initialize application on load
async function init() {
  toggleLoadingOverlay(true);
  try {
    const meals = await fetchMeals();
    currentMealsList = meals || [];
    displayMeals(currentMealsList, currentViewMode);

    const categories = await fetchCategories();
    if (categories) displayCategories(categories.slice(0, 12));

    const areas = await fetchAreas();
    if (areas) displayAreaButtons(areas.slice(0, 10));

    const prodCategories = await fetchProductCategories();
    if (prodCategories) displayProductCategories(prodCategories);

    displayProducts(currentProductsList);
  } catch (error) {
    console.error("Init Error:", error);
  } finally {
    toggleLoadingOverlay(false);
  }
}

init();

// Sidebar navigation click listener
sidebarNav?.addEventListener("click", handleSidebarNavigation);
document.addEventListener("click", (e) => {
  if (e.target.closest("#foodlog-section [data-target]")) {
    handleSidebarNavigation(e);
  }
});

// Handle hash change (browser navigation)
window.addEventListener("hashchange", () => {
  const hash = location.hash.replace("#", "").split("/")[0] || "meals";
  if (hash === "meals" || hash === "products" || hash === "foodlog") {
    updateActiveNavLink(hash);
    switchActiveSection(hash);
  }
});

// Mobile menu toggle listeners
headerMenuBtn?.addEventListener("click", () => toggleSidebar(true));
sidebarCloseBtn?.addEventListener("click", () => toggleSidebar(false));
sidebarOverlay?.addEventListener("click", () => toggleSidebar(false));

// Set recipe view mode
// mode: "grid" or "list"
function setViewMode(mode) {
  if (currentViewMode === mode) return;
  currentViewMode = mode;
  updateViewButtonsUI(mode);
  displayMeals(currentMealsList, mode);
}

// Grid view button click
gridViewBtn?.addEventListener("click", () => setViewMode("grid"));

// List view button click
listViewBtn?.addEventListener("click", () => setViewMode("list"));

//  recipe search input
let searchDebounce;
searchInput?.addEventListener("input", (e) => {
  clearTimeout(searchDebounce);
  const query = e.target.value.trim();
  searchDebounce = setTimeout(async () => {
    showRecipesLoading();
    if (!query) {
      const meals = await fetchMeals();
      currentMealsList = meals || [];
      displayMeals(currentMealsList, currentViewMode);
    } else {
      const meals = await fetchMealsSearch(query);
      currentMealsList = meals || [];
      displayMeals(currentMealsList, currentViewMode);
    }
  }, 500);
});

// Filter meals by Area
areasGrid?.addEventListener("click", async (e) => {
  const btn = e.target.closest(".area-filter-btn");
  if (!btn) return;

  toggleActiveAreaButton(e);
  showRecipesLoading();

  const areaName = btn.dataset.area;
  if (!areaName) {
    const meals = await fetchMeals();
    currentMealsList = meals || [];
    displayMeals(currentMealsList, currentViewMode);
  } else {
    const meals = await fetchMealsByArea(areaName);
    currentMealsList = meals || [];
    displayMeals(currentMealsList, currentViewMode);
  }
});

// Filter meals by category
categoriesGrid?.addEventListener("click", async (e) => {
  const card = e.target.closest(".category-card");
  if (!card) return;

  const categoryName = card.dataset.category;
  if (!categoryName) return;

  showRecipesLoading();
  const meals = await fetchMealsByCategory(categoryName);
  currentMealsList = meals || [];
  displayMeals(currentMealsList, currentViewMode);
});

// Open Meal Details
recipesGrid?.addEventListener("click", async (e) => {
  const card = e.target.closest(".recipe-card");
  if (!card) return;

  const mealId = card.dataset.mealId;
  if (!mealId) return;

  try {
    const meal = await fetchMealById(mealId);
    if (!meal) return;

    currentMeal = meal;
    currentNutrition = null;

    location.hash = `meals/${meal.name}`;

    displayMealDetails(meal);
    openMealDetailsView();

    const ingredients = (meal.ingredients || []).map((item) =>
      `${item.measure || ""} ${item.ingredient || ""}`.trim(),
    );

    // get nutrition analysis
    (async () => {
      try {
        const nutrition = await fetchNutritionAnalysis(meal.name, ingredients);
        currentNutrition = nutrition?.perServing || {};
        updateNutritionDetails(nutrition, meal.id);
      } catch (err) {
        console.error("Nutrition Analysis Error:", err);
      }
    })();
  } catch (error) {
    console.error("Meal Details Error:", error);
  }
});

// Meal Details Actions
mealDetails?.addEventListener("click", (e) => {
  if (e.target.closest("#back-to-meals-btn")) {
    location.hash = "meals";
    closeMealDetailsView();
    currentMeal = null;
    currentNutrition = null;
  } else if (e.target.closest("#log-meal-btn")) {
    if (!currentMeal) return;
    renderLogMealModal(currentMeal, currentNutrition, 1);
    openLogMealModalView();
  }
});

// Adjust modal servings count
// step: numeric increment or decrement
function adjustServingsControls(step) {
  const current = parseFloat(mealServingsInput.value) || 1;
  const val = Math.min(10, Math.max(0.5, current + step));
  mealServingsInput.value = val;
}

// Decrease servings button click
decreaseServingsBtn?.addEventListener("click", () =>
  adjustServingsControls(-0.5),
);

// Increase servings button click
increaseServingsBtn?.addEventListener("click", () =>
  adjustServingsControls(0.5),
);

// Cancel log meal modal
cancelLogMealBtn?.addEventListener("click", closeLogMealModalView);

// Confirm meal log submit
confirmLogMealBtn?.addEventListener("click", () => {
  if (!currentMeal) return;

  const servings = parseFloat(mealServingsInput.value) || 1;
  const totalCalories = Math.round(
    (currentNutrition?.calories || 0) * servings,
  );

  logMealToStorage(currentMeal, servings, currentNutrition);
  updateTodayNutritionUI();
  renderLoggedItemsList();
  showSuccessAlert(
    "Meal Logged!",
    `${currentMeal.name} (${servings} servings) has been added to your daily log.`,
    totalCalories,
  );
  closeLogMealModalView();
});

// Reset Nutri-Score filter buttons to 'All'
function resetNutriScoreFilter() {
  document.querySelectorAll(".nutri-score-filter").forEach((b) => {
    b.classList.remove("ring-2", "ring-gray-900");
    if (!b.dataset.grade) {
      b.classList.add("ring-2", "ring-gray-900");
    }
  });
}

// Filter products by Nutri-Score
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".nutri-score-filter");
  if (!btn) return;

  document.querySelectorAll(".nutri-score-filter").forEach((b) => {
    b.classList.remove("ring-2", "ring-gray-900");
  });
  btn.classList.add("ring-2", "ring-gray-900");

  const grade = btn.dataset.grade?.trim().toLowerCase() || "";
  if (!grade) {
    displayProducts(currentProductsList);
  } else {
    const filtered = currentProductsList.filter(
      (p) => (p.nutritionGrade || "").toLowerCase() === grade,
    );
    displayProducts(filtered);
  }
});

// Filter products by category
productCategories?.addEventListener("click", async (e) => {
  const btn = e.target.closest(".product-category-btn");
  if (!btn) return;

  const category = btn.dataset.category;
  if (!category) return;

  resetNutriScoreFilter();
  showProductsLoading();
  const products = await fetchProductsByCategory(category);
  currentProductsList = products || [];
  displayProducts(currentProductsList, category);
});

// Search products by name
// query: search keyword string
async function searchProducts(query) {
  if (!query) {
    displayProducts([], "");
    return;
  }
  resetNutriScoreFilter();
  showProductsLoading();
  const products = await fetchSearchProducts(query);
  currentProductsList = products || [];
  displayProducts(currentProductsList);
}

// Product search button click
productSearchBtn?.addEventListener("click", () => {
  const query = productSearchInput?.value.trim();
  searchProducts(query);
});

// Product search by enter key
productSearchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = productSearchInput?.value.trim();
    searchProducts(query);
  }
});

// Lookup product by barcode
async function handleBarcodeLookup() {
  const barcode = barcodeInput?.value.trim();
  if (!barcode) return;

  showProductsLoading();
  const product = await fetchProductByBarcode(barcode);

  if (product) {
    currentProductsList = [product];
    displayProducts(currentProductsList);

    currentProduct = product;
    updateProductModal(currentProduct);
    openProductModal();
  } else {
    currentProductsList = [];
    displayProducts(currentProductsList);

    Toastify({
      text: "Product not found in database",
      duration: 2500,
      gravity: "bottom",
      position: "right",
      stopOnFocus: false,
      style: {
        background: "#fb2c36",
        borderRadius: "12px",
        padding: "12px 20px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();
  }
}

// Barcode lookup button click
lookupBarcodeBtn?.addEventListener("click", handleBarcodeLookup);

// Barcode search by enter key
barcodeInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleBarcodeLookup();
  }
});

// Open product details modal
productsGridEl?.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const barcode = card.dataset.barcode;
  const selectedProduct = currentProductsList.find(
    (product) => product.barcode == barcode,
  );
  if (!selectedProduct) return;

  currentProduct = selectedProduct;
  updateProductModal(currentProduct);
  openProductModal();
});

// Close product modal click
document.addEventListener("click", (e) => {
  if (e.target.closest(".close-product-modal")) {
    closeProductModal();
    currentProduct = null;
  }
});

// Log product to storage
document.addEventListener("click", (e) => {
  if (e.target.closest(".add-product-to-log")) {
    if (!currentProduct) return;

    logProductToStorage(currentProduct);
    updateTodayNutritionUI();
    renderLoggedItemsList();

    Toastify({
      text: `${currentProduct.name} logged to your daily intake! 📝`,
      duration: 2500,
      gravity: "bottom",
      position: "right",
      stopOnFocus: false,
      style: {
        background: "#00bc7d",
        borderRadius: "12px",
        padding: "12px 20px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
    }).showToast();

    closeProductModal();
    currentProduct = null;
  }
});

// Remove single log item
loggedItemsList?.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-foodlog-item");
  if (!removeBtn) return;

  const index = parseInt(removeBtn.dataset.index, 10);
  if (isNaN(index)) return;

  removeFoodLogItem(index);
  renderLoggedItemsList();
  updateTodayNutritionUI();

  Toastify({
    text: "Item removed from log",
    duration: 2500,
    gravity: "bottom",
    position: "right",
    stopOnFocus: false,
    style: {
      background: "#2563eb",
      borderRadius: "12px",
      padding: "12px 20px",
      fontSize: "14px",
      fontWeight: "600",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    },
  }).showToast();
});

// Clear all today logs
clearFoodLogBtn?.addEventListener("click", () => {
  Swal.fire({
    title: "Clear Today's Log?",
    text: "This will remove all logged food items for today.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, clear it!",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-2xl",
      confirmButton: "rounded-xl font-semibold px-5 py-2.5",
      cancelButton: "rounded-xl font-semibold px-5 py-2.5",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      clearTodayFoodLog();
      renderLoggedItemsList();
      updateTodayNutritionUI();

      Toastify({
        text: "Today's log cleared",
        duration: 2500,
        gravity: "bottom",
        position: "right",
        stopOnFocus: false,
        style: {
          background: "#2563eb",
          borderRadius: "12px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        },
      }).showToast();
    }
  });
});
