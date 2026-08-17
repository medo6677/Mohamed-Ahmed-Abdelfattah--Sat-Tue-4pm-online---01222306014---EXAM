import { getTodayFoodLog } from "../state/storage.js";

// Food log DOM selectors
const foodLogDateEl = document.querySelector("#foodlog-date");
const loggedItemsEmpty = document.querySelector("#logged-items-empty");
const loggedItemsList = document.querySelector("#logged-items-list");
const loggedItemsCount = document.querySelector("#logged-items-count");
const clearFoodLogBtn = document.querySelector("#clear-foodlog");

// Update header date text
export function updateFoodLogDate() {
  if (!foodLogDateEl) return;
  const options = {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "Africa/Cairo",
  };
  foodLogDateEl.textContent = new Date().toLocaleDateString("en-US", options);
}

// Render weekly overview (6 days before + today on the right)
export function renderWeeklyOverviewUI() {
  const weeklyGrid = document.querySelector("#weekly-overview-grid");
  if (!weeklyGrid) return;

  const data = JSON.parse(localStorage.getItem("nutriplan_daily_log")) || {};

  let html = "";
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const dateKey = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);

    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = d.getDate();
    const dayData = data[dateKey] || { totalCalories: 0, meals: [] };

    const isToday = i === 0;
    const calories = Math.round(dayData.totalCalories || 0);
    const count = dayData.meals ? dayData.meals.length : 0;
    const hasCalories = calories > 0;

    const bgClass = isToday ? "bg-indigo-100 rounded-xl" : "";
    const calColorClass = (isToday || hasCalories) ? "text-emerald-600" : "text-gray-300";

    html += `
      <div class="text-center py-2 ${bgClass}">
        <p class="text-xs text-gray-500 mb-1">${dayName}</p>
        <p class="text-sm font-medium text-gray-900">${dayNumber}</p>
        <div class="mt-2 ${calColorClass}">
          <p class="text-lg font-bold">${calories}</p>
          <p class="text-xs">kcal</p>
        </div>
        <p class="text-xs text-gray-400 mt-1">${count} items</p>
      </div>
    `;
  }

  weeklyGrid.innerHTML = html;
}

// Update today nutrition cards
export function updateTodayNutritionUI() {
  let data = getTodayFoodLog();

  let calories = Math.round(data.totalCalories || 0);
  let protein  = Math.round(data.totalProtein  || 0);
  let carbs    = Math.round(data.totalCarbs    || 0);
  let fat      = Math.round(data.totalFat      || 0);

  // Calories card update
  let calPercent = Math.round((calories / 2000) * 100);
  document.querySelector("#cal-percent").textContent  = calPercent + "%";
  document.querySelector("#cal-bar").style.width      = Math.min(calPercent, 100) + "%";
  document.querySelector("#cal-value").textContent    = calories + " kcal";

  // Protein card update
  let proteinPercent = Math.round((protein / 50) * 100);
  document.querySelector("#protein-percent").textContent  = proteinPercent + "%";
  document.querySelector("#protein-bar").style.width      = Math.min(proteinPercent, 100) + "%";
  document.querySelector("#protein-value").textContent    = protein + " g";

  // Carbs card update
  let carbsPercent = Math.round((carbs / 250) * 100);
  document.querySelector("#carbs-percent").textContent  = carbsPercent + "%";
  document.querySelector("#carbs-bar").style.width      = Math.min(carbsPercent, 100) + "%";
  document.querySelector("#carbs-value").textContent    = carbs + " g";

  // Fat card update
  let fatPercent = Math.round((fat / 65) * 100);
  document.querySelector("#fat-percent").textContent  = fatPercent + "%";
  document.querySelector("#fat-bar").style.width      = Math.min(fatPercent, 100) + "%";
  document.querySelector("#fat-value").textContent    = fat + " g";

  // Update weekly overview
  renderWeeklyOverviewUI();
}

// Render logged items list
export function renderLoggedItemsList() {
  const data = getTodayFoodLog();
  const meals = data.meals || [];

  if (meals.length > 0) {
    loggedItemsEmpty?.classList.add("hidden");
    loggedItemsList?.classList.remove("hidden");
    clearFoodLogBtn?.classList.remove("hidden");
    if (loggedItemsCount)
      loggedItemsCount.textContent = `Logged Items (${meals.length})`;

    const itemsHtml = meals
      .map((item, index) => {
        const timeFormatted = item.loggedAt
          ? new Date(item.loggedAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZone: "Africa/Cairo",
            })
          : "";

        const imageContent = item.thumbnail
          ? `<img src="${item.thumbnail}" alt="${item.name || "Food Item"}" class="w-14 h-14 rounded-xl object-cover">`
          : `<div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
               <i class="fa-solid fa-box text-blue-600 text-xl"></i>
             </div>`;

        const isMeal = item.type === "meal";
        const subInfo = isMeal
          ? `${item.servings || 1} servings <span class="mx-1">•</span> <span class="text-emerald-600">Recipe</span>`
          : `${item.brand || "Product"} <span class="mx-1">•</span> <span class="text-blue-600">Product</span>`;

        return `
          <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
            <div class="flex items-center gap-4">
              ${imageContent}
              <div>
                <p class="font-semibold text-gray-900">${item.name || "Unknown Food"}</p>
                <p class="text-sm text-gray-500">${subInfo}</p>
                <p class="text-xs text-gray-400 mt-1">${timeFormatted}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-lg font-bold text-emerald-600">${item.nutrition?.calories || 0}</p>
                <p class="text-xs text-gray-500">kcal</p>
              </div>
              <div class="hidden md:flex gap-2 text-xs text-gray-500">
                <span class="px-2 py-1 bg-blue-50 rounded">${item.nutrition?.protein || 0}g P</span>
                <span class="px-2 py-1 bg-amber-50 rounded">${item.nutrition?.carbs || 0}g C</span>
                <span class="px-2 py-1 bg-purple-50 rounded">${item.nutrition?.fat || 0}g F</span>
              </div>
              <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2 cursor-pointer" data-index="${index}">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    if (loggedItemsList) loggedItemsList.innerHTML = itemsHtml;
  } else {
    loggedItemsEmpty?.classList.remove("hidden");
    loggedItemsList?.classList.add("hidden");
    clearFoodLogBtn?.classList.add("hidden");
    if (loggedItemsCount) loggedItemsCount.textContent = "Logged Items (0)";
  }
}
