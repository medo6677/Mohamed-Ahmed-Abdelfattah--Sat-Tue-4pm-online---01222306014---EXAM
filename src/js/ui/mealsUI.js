// Meals UI DOM selectors
const recipesGrid = document.querySelector("#recipes-grid");
const recipesCount = document.querySelector("#recipes-count");
const categoriesGrid = document.querySelector("#categories-grid");
const areasGrid = document.querySelector("#areas-grid");
const mealDetails = document.querySelector("#meal-details");
const logMealModal = document.querySelector("#log-meal-modal");
const mealServingsInput = document.querySelector("#meal-servings");
const modalCalories = document.querySelector("#modal-calories");
const modalProtein = document.querySelector("#modal-protein");
const modalCarbs = document.querySelector("#modal-carbs");
const modalFat = document.querySelector("#modal-fat");
const gridViewBtn = document.querySelector("#grid-view-btn");
const listViewBtn = document.querySelector("#list-view-btn");

// Render list of meals
// list: array of meal objects
// viewMode: "grid" or "list"
export function displayMeals(list, viewMode = "grid") {
  if (!list || list.length === 0) {
    if (recipesCount) recipesCount.textContent = "Showing 0 recipes";
    if (recipesGrid) {
      recipesGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
          </div>
          <p class="text-gray-500 text-lg">No recipes found</p>
          <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
        </div>
      `;
    }
    return;
  }

  const isList = viewMode === "list";
  if (recipesGrid) {
    recipesGrid.className = isList
      ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5";
  }

  const html = list
    .map(
      ({ id, thumbnail, category, area, name }) => `
      <div
        class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group ${isList ? "flex flex-row h-40" : ""}"
        data-meal-id="${id}"
        data-meal-name="${name}">
        <div class="relative overflow-hidden ${isList ? "w-48 h-full shrink-0" : "h-48"}">
          <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src="${thumbnail}" alt="${name}" loading="lazy" />
          <div class="absolute bottom-3 left-3 flex gap-2 ${isList ? "hidden" : ""}">
            <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg text-gray-700">
              <i class="fa-solid fa-tag text-emerald-600 mr-1"></i>${category}
            </span>
            <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg text-gray-700">
              <i class="fa-solid fa-globe text-blue-600 mr-1"></i>${area}
            </span>
          </div>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
              ${name}
            </h3>
            <p class="text-xs text-gray-600 mb-3 line-clamp-2">Delicious recipe to try!</p>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-gray-900">
              <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${category}
            </span>
            <span class="font-semibold text-gray-500">
              <i class="fa-solid fa-globe text-blue-500 mr-1"></i>${area}
            </span>
          </div>
        </div>
      </div>
    `,
    )
    .join("");

  if (recipesCount)
    recipesCount.textContent = `Showing ${list.length} recipes `;
  if (recipesGrid) recipesGrid.innerHTML = html;
}

// Show recipes loading spinner
export function showRecipesLoading() {
  if (recipesCount) recipesCount.textContent = "Loading...";
  if (recipesGrid) {
    recipesGrid.innerHTML = `
      <div class="col-span-full flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    `;
  }
}

// Category Styles
const categoryStyles = {
  Beef: {
    gradientBg: "from-red-50 to-rose-50",
    border: "border-red-200 hover:border-red-400",
    iconBg: "from-red-400 to-rose-500",
    icon: "fa-solid fa-drumstick-bite",
  },
  Chicken: {
    gradientBg: "from-amber-50 to-orange-50",
    border: "border-amber-200 hover:border-amber-400",
    iconBg: "from-amber-400 to-orange-500",
    icon: "fa-solid fa-drumstick-bite",
  },
  Dessert: {
    gradientBg: "from-pink-50 to-rose-50",
    border: "border-pink-200 hover:border-pink-400",
    iconBg: "from-pink-400 to-rose-500",
    icon: "fa-solid fa-cake-candles",
  },
  Lamb: {
    gradientBg: "from-orange-50 to-amber-50",
    border: "border-orange-200 hover:border-orange-400",
    iconBg: "from-orange-400 to-amber-500",
    icon: "fa-solid fa-drumstick-bite",
  },
  Miscellaneous: {
    gradientBg: "from-slate-50 to-gray-50",
    border: "border-slate-200 hover:border-slate-400",
    iconBg: "from-slate-400 to-gray-500",
    icon: "fa-solid fa-bowl-rice",
  },
  Pasta: {
    gradientBg: "from-yellow-50 to-amber-50",
    border: "border-yellow-200 hover:border-yellow-400",
    iconBg: "from-yellow-400 to-amber-500",
    icon: "fa-solid fa-bowl-food",
  },
  Pork: {
    gradientBg: "from-rose-50 to-red-50",
    border: "border-rose-200 hover:border-rose-400",
    iconBg: "from-rose-400 to-red-500",
    icon: "fa-solid fa-bacon",
  },
  Seafood: {
    gradientBg: "from-cyan-50 to-blue-50",
    border: "border-cyan-200 hover:border-cyan-400",
    iconBg: "from-cyan-400 to-blue-500",
    icon: "fa-solid fa-fish",
  },
  Side: {
    gradientBg: "from-green-50 to-emerald-50",
    border: "border-green-200 hover:border-green-400",
    iconBg: "from-green-400 to-emerald-500",
    icon: "fa-solid fa-plate-wheat",
  },
  Starter: {
    gradientBg: "from-teal-50 to-cyan-50",
    border: "border-teal-200 hover:border-teal-400",
    iconBg: "from-teal-400 to-cyan-500",
    icon: "fa-solid fa-utensils",
  },
  Vegan: {
    gradientBg: "from-emerald-50 to-green-50",
    border: "border-emerald-200 hover:border-emerald-400",
    iconBg: "from-emerald-400 to-green-500",
    icon: "fa-solid fa-leaf",
  },
  Vegetarian: {
    gradientBg: "from-lime-50 to-green-50",
    border: "border-lime-200 hover:border-lime-400",
    iconBg: "from-lime-400 to-green-500",
    icon: "fa-solid fa-seedling",
  },
};

// Fallback style for categories
const defaultCategoryStyle = {
  gradientBg: "from-gray-50 to-slate-50",
  border: "border-gray-200 hover:border-gray-400",
  iconBg: "from-gray-400 to-slate-500",
  icon: "fa-solid fa-utensils",
};

// Render category cards
// categories: array of category objects
export function displayCategories(categories) {
  const html = categories
    .map(({ name }) => {
      const style = categoryStyles[name] || defaultCategoryStyle;
      return `
        <div
          class="category-card bg-gradient-to-br ${style.gradientBg} rounded-xl p-3 border ${style.border} hover:shadow-md cursor-pointer transition-all group"
          data-category="${name}">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 bg-gradient-to-br ${style.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <i class="text-sm text-white ${style.icon}"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900">${name}</h3>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
  if (categoriesGrid) categoriesGrid.innerHTML = html;
}

// Render cuisine filter buttons
// list: array of area objects
export function displayAreaButtons(list) {
  const allBtn = `
    <button class="area-filter-btn px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 hover:text-white transition-all bg-emerald-600 text-white" data-area="all">
      All Cuisines
    </button>
  `;
  const areasHtml = list
    .map(
      ({ name }) => `
      <button class="area-filter-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all" data-area="${name}">
        ${name}
      </button>
    `,
    )
    .join("");
  if (areasGrid) areasGrid.innerHTML = allBtn + areasHtml;
}

// Render single meal details
// meal: full meal object
export function displayMealDetails(meal) {
  if (!meal) return;

  const {
    id,
    name,
    category,
    area,
    thumbnail,
    instructions = [],
    ingredients = [],
    tags = [],
    youtube,
  } = meal;

  const html = `
    <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
      <i class="fa-solid fa-arrow-left"></i>
      <span>Back to Recipes</span>
    </button>

    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <div class="relative h-80 md:h-96">
        <img src="${thumbnail}" alt="${name}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="flex items-center gap-3 mb-3 flex-wrap">
            ${category ? `<span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${category}</span>` : ""}
            ${area ? `<span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${area}</span>` : ""}
            ${tags.map((tag) => `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${tag}</span>`).join("")}
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${name}</h1>
          <div class="flex items-center gap-6 text-white/90">
            <span class="flex items-center gap-2"><i class="fa-solid fa-clock"></i><span>30 min</span></span>
            <span class="flex items-center gap-2"><i class="fa-solid fa-utensils"></i><span id="hero-servings">4 servings</span></span>
            <span class="flex items-center gap-2"><i class="fa-solid fa-fire"></i><span id="hero-calories">Calculating...</span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 mb-8">
      <button id="log-meal-btn"
        class="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed transition-all"
        data-meal-id="${id}" disabled title="Waiting for nutrition data...">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Calculating...</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-list-check text-emerald-600"></i>
            Ingredients
            <span class="text-sm font-normal text-gray-500 ml-auto">${ingredients.length} items</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${ingredients
              .map(
                (ingredient) => `
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                <span class="text-gray-700">
                  <span class="font-medium text-gray-900">${ingredient.measure || ""}</span> ${ingredient.ingredient || ""}
                </span>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
            Instructions
          </h2>
          <div class="space-y-4">
            ${instructions
              .map(
                (step, index) => `
              <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">${index + 1}</div>
                <p class="text-gray-700 leading-relaxed pt-2">${step}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        ${
          youtube
            ? `
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-video text-red-500"></i>
              Video Tutorial
            </h2>
            <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              <iframe src="${youtube.replace("watch?v=", "embed/")}" class="absolute inset-0 w-full h-full"
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
              </iframe>
            </div>
          </div>
        `
            : ""
        }
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-chart-pie text-emerald-600"></i>
            Nutrition Facts
          </h2>
          <div id="nutrition-facts-container">
            <div class="text-center py-8">
              <div class="relative w-16 h-16 mx-auto mb-4">
                <div class="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-400 to-teal-600 animate-pulse"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <i class="fa-solid fa-calculator text-white text-2xl"></i>
                </div>
              </div>
              <h2 class="text-xl font-bold text-gray-900 mb-2">Calculating Nutrition</h2>
              <p class="text-gray-500 mb-4 text-sm">Analyzing ingredients...</p>
              <div class="flex items-center justify-center gap-1">
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const container = document.querySelector("#meal-details .meal-info");
  if (container) container.innerHTML = html;
}

// Update meal nutrition facts
// nutrition: calculated nutrition values
// mealId: meal ID string
export function updateNutritionDetails(nutrition, mealId) {
  if (!nutrition) return;

  const { servings = 4, totals = {}, perServing = {} } = nutrition;
  const perServCalories = perServing.calories ?? 0;
  const totalCalories = totals.calories ?? 0;
  const protein = perServing.protein ?? 0;
  const carbs = perServing.carbs ?? 0;
  const fat = perServing.fat ?? 0;
  const saturatedFat = perServing.saturatedFat ?? 0;
  const fiber = perServing.fiber ?? 0;
  const sugar = perServing.sugar ?? 0;
  const cholesterol = perServing.cholesterol ?? 0;
  const sodium = perServing.sodium ?? 0;

  const proteinPercent = Math.min((protein / 50) * 100, 100);
  const carbsPercent = Math.min((carbs / 300) * 100, 100);
  const fatPercent = Math.min((fat / 100) * 100, 100);
  const saturatedFatPercent = Math.min((saturatedFat / 30) * 100);
  const fiberPercent = Math.min((fiber / 25) * 100, 100);
  const sugarPercent = Math.min((sugar / 50) * 100, 100);

  const heroServings = document.querySelector("#hero-servings");
  if (heroServings) heroServings.textContent = `${servings} servings`;

  const heroCalories = document.querySelector("#hero-calories");
  if (heroCalories) heroCalories.textContent = `${perServCalories} cal/serving`;

  const logBtn = document.querySelector("#log-meal-btn");
  if (logBtn) {
    logBtn.className =
      "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all cursor-pointer";
    logBtn.disabled = false;
    logBtn.removeAttribute("title");
    logBtn.setAttribute("data-meal-id", mealId);
    logBtn.innerHTML = `<i class="fa-solid fa-clipboard-list"></i><span>Log This Meal</span>`;
  }

  const nutrientsList = [
    {
      label: "Protein",
      value: `${protein}g`,
      color: "emerald",
      percent: proteinPercent,
    },
    {
      label: "Carbs",
      value: `${carbs}g`,
      color: "blue",
      percent: carbsPercent,
    },
    {
      label: "Fat",
      value: `${fat}g`,
      color: "purple",
      percent: fatPercent,
    },
    {
      label: "Fiber",
      value: `${fiber}g`,
      color: "orange",
      percent: fiberPercent,
    },
    {
      label: "Sugar",
      value: `${sugar}g`,
      color: "pink",
      percent: sugarPercent,
    },
    {
      label: "Saturated Fat",
      value: `${saturatedFat}g`,
      color: "red",
      percent: saturatedFatPercent,
    },
  ];

  const container = document.querySelector("#nutrition-facts-container");
  if (container) {
    container.innerHTML = `
      <p class="text-sm text-gray-500 mb-4">Per serving</p>
      <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
        <p class="text-sm text-gray-600">Calories per serving</p>
        <p class="text-4xl font-bold text-emerald-600">${perServCalories}</p>
        <p class="text-xs text-gray-500 mt-1">Total: ${totalCalories} cal</p>
      </div>
      <div class="space-y-4">
        ${nutrientsList
          .map(
            ({ label, value, color, percent }) => `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-${color}-500"></div>
              <span class="text-gray-700">${label}</span>
            </div>
            <span class="font-bold text-gray-900">${value}</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-${color}-500 h-2 rounded-full" style="width: ${percent}%"></div>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="mt-6 pt-6 border-t border-gray-100">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Nutritional Details (Per Serving)</h3>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Cholesterol</span>
            <span class="font-medium">${cholesterol}mg</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Sodium</span>
            <span class="font-medium">${sodium}mg</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Fill log meal modal
// meal: meal details object
// nutrition: nutrition per serving
// servings: number of servings
export function renderLogMealModal(meal, nutrition, servings = 1) {
  if (!logMealModal || !meal) return;
  const img = logMealModal.querySelector("img");
  const mealName = logMealModal.querySelector("p.text-gray-500");
  if (img) {
    img.src = meal.thumbnail || "";
    img.alt = meal.name || "Meal Image";
  }
  if (mealName) mealName.textContent = meal.name || "";
  if (mealServingsInput) mealServingsInput.value = servings;
  updateModalNutritionUI(nutrition);
}

// Update modal nutrient values
// nutrition: nutrition object
export function updateModalNutritionUI(nutrition) {
  const n = nutrition || {};
  if (modalCalories) modalCalories.textContent = Math.round(n.calories || 0);
  if (modalProtein) modalProtein.textContent = `${Math.round(n.protein || 0)}g`;
  if (modalCarbs) modalCarbs.textContent = `${Math.round(n.carbs || 0)}g`;
  if (modalFat) modalFat.textContent = `${Math.round(n.fat || 0)}g`;
}

// Update view mode buttons
// mode: "grid" or "list"
export function updateViewButtonsUI(mode) {
  if (mode === "grid") {
    gridViewBtn?.classList.add("bg-white", "shadow-sm");
    gridViewBtn
      ?.querySelector("i")
      ?.classList.replace("text-gray-500", "text-gray-700");
    listViewBtn?.classList.remove("bg-white", "shadow-sm");
    listViewBtn
      ?.querySelector("i")
      ?.classList.replace("text-gray-700", "text-gray-500");
  } else {
    listViewBtn?.classList.add("bg-white", "shadow-sm");
    listViewBtn
      ?.querySelector("i")
      ?.classList.replace("text-gray-500", "text-gray-700");
    gridViewBtn?.classList.remove("bg-white", "shadow-sm");
    gridViewBtn
      ?.querySelector("i")
      ?.classList.replace("text-gray-700", "text-gray-500");
  }
}
