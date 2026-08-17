// Products page DOM selectors
const productCategoriesContainer = document.querySelector(
  "#product-categories",
);
const productsGrid = document.querySelector("#products-grid");
const productsCount = document.querySelector("#products-count");
const productsLoading = document.querySelector("#products-loading");
const productsEmpty = document.querySelector("#products-empty");
const productDetailModal = document.querySelector("#product-detail-modal");

// Product detail modal selectors
const pmImg = document.querySelector("#product-modal-img");
const pmImgFallback = document.querySelector("#product-modal-img-fallback");
const pmBrand = document.querySelector("#product-modal-brand");
const pmName = document.querySelector("#product-modal-name");
const pmCalories = document.querySelector("#product-modal-calories");
const pmProtein = document.querySelector("#product-modal-protein");
const pmProteinBar = document.querySelector("#product-modal-protein-bar");
const pmCarbs = document.querySelector("#product-modal-carbs");
const pmCarbsBar = document.querySelector("#product-modal-carbs-bar");
const pmFat = document.querySelector("#product-modal-fat");
const pmFatBar = document.querySelector("#product-modal-fat-bar");
const pmSugar = document.querySelector("#product-modal-sugar");
const pmSugarBar = document.querySelector("#product-modal-sugar-bar");
const pmSodium = document.querySelector("#product-modal-sodium");
const pmFiber = document.querySelector("#product-modal-fiber");
const pmNutriscore = document.querySelector("#product-modal-nutriscore");
const pmNutriscoreLetter = document.querySelector(
  "#product-modal-nutriscore-letter",
);
const pmNutriscoreLabel = document.querySelector(
  "#product-modal-nutriscore-label",
);
const pmNutriscoreDesc = document.querySelector(
  "#product-modal-nutriscore-desc",
);
const pmNova = document.querySelector("#product-modal-nova");
const pmNovaNumber = document.querySelector("#product-modal-nova-number");
const pmNovaLabel = document.querySelector("#product-modal-nova-label");
const pmNovaDesc = document.querySelector("#product-modal-nova-desc");
const pmIngredientsSection = document.querySelector(
  "#product-modal-ingredients-section",
);
const pmIngredientsText = document.querySelector(
  "#product-modal-ingredients-text",
);
const pmLogBtn = document.querySelector("#product-modal-log-btn");

// Product category styles
const productCategoryStyles = [
  {
    id: "breakfast-cereals",
    name: "Breakfast Cereals",
    gradient: "from-amber-500 to-orange-500",
    icon: "fa-solid fa-wheat-awn",
  },
  {
    id: "beverages",
    name: "Beverages",
    gradient: "from-blue-500 to-cyan-500",
    icon: "fa-solid fa-bottle-water",
  },
  {
    id: "snacks",
    name: "Snacks",
    gradient: "from-purple-500 to-pink-500",
    icon: "fa-solid fa-cookie",
  },
  {
    id: "dairies",
    name: "Dairy",
    gradient: "from-sky-400 to-blue-500",
    icon: "fa-solid fa-cheese",
  },
  {
    id: "fruits",
    name: "Fruits",
    gradient: "from-red-500 to-rose-500",
    icon: "fa-solid fa-apple-whole",
  },
  {
    id: "vegetables",
    name: "Vegetables",
    gradient: "from-green-500 to-emerald-500",
    icon: "fa-solid fa-carrot",
  },
  {
    id: "breads",
    name: "Breads",
    gradient: "from-amber-600 to-yellow-500",
    icon: "fa-solid fa-bread-slice",
  },
  {
    id: "meats",
    name: "Meats",
    gradient: "from-red-600 to-rose-600",
    icon: "fa-solid fa-drumstick-bite",
  },
  {
    id: "ice-creams",
    name: "Frozen Foods",
    gradient: "from-cyan-500 to-blue-600",
    icon: "fa-solid fa-snowflake",
  },
  {
    id: "sauces",
    name: "Sauces & Condiments",
    gradient: "from-orange-500 to-red-500",
    icon: "fa-solid fa-jar",
  },
];

// Render product category buttons
// categories: array of category objects
export function displayProductCategories(categories) {
  if (!productCategoriesContainer || !categories) return;
  const apiCategoryIds = categories.map((cat) => cat.id);
  const html = productCategoryStyles
    .filter((item) => apiCategoryIds.includes(item.id))
    .map(
      (item) => `
      <button class="product-category-btn flex-shrink-0 px-5 py-3 bg-gradient-to-r ${item.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all" data-category="${item.id}">
        <i class="${item.icon} mr-2"></i>${item.name}
      </button>
    `,
    )
    .join("");
  productCategoriesContainer.innerHTML = html;
}

// Get nutriscore badge color
// grade: grade letter string
function getNutriScoreBadgeColor(grade) {
  if (grade === "a") return "bg-green-500";
  if (grade === "b") return "bg-lime-500";
  if (grade === "c") return "bg-yellow-500";
  if (grade === "d") return "bg-orange-500";
  if (grade === "e") return "bg-red-500";
  return "bg-gray-400";
}

// Get NOVA badge color
// novaGroup: nova group number
function getNovaBadgeColor(novaGroup) {
  if (novaGroup === 1) return "bg-green-500";
  if (novaGroup === 2) return "bg-lime-500";
  if (novaGroup === 3) return "bg-yellow-500";
  if (novaGroup === 4) return "bg-red-500";
  return "hidden";
}

// Render product image tag
// image: image url string
// name: product name string
function renderProductImage(image, name) {
  if (!image)
    return `<div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center"><i class="fa-solid fa-box text-gray-400 text-2xl"></i></div>`;
  return `<img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${image}" alt="${name}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center\\'><i class=\\'fa-solid fa-box text-gray-400 text-2xl\\'></i></div>';" />`;
}

// Render single product card
// product: product object
function renderProductCard(product) {
  const {
    barcode = "",
    name = "Unknown Product",
    brand = "Unknown Brand",
    image = "",
    nutritionGrade = "unknown",
    novaGroup = "",
    nutrients = {},
  } = product;

  const grade = (nutritionGrade || "unknown").toLowerCase();
  const badgeBg = getNutriScoreBadgeColor(grade);
  const novaBadgeBg = getNovaBadgeColor(novaGroup);

  const calories = nutrients.calories?.toFixed(1) || 0;
  const protein = nutrients.protein?.toFixed(1) || 0;
  const carbs = nutrients.carbs?.toFixed(1) || 0;
  const fat = nutrients.fat?.toFixed(1) || 0;
  const sugar = nutrients.sugar?.toFixed(1) || 0;

  return `
    <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${barcode}">
      <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        <div class="product-img-wrapper w-full h-full flex items-center justify-center overflow-hidden">
          ${renderProductImage(image, name)}
        </div>
        <div class="absolute top-2 left-2 ${badgeBg} text-white text-xs font-bold px-2 py-1 rounded uppercase">
          Nutri-Score ${grade}
        </div>
        <div class="${novaBadgeBg} absolute top-2 right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${novaGroup}">
          ${novaGroup}
        </div>
      </div>
      <div class="p-4">
        <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${brand}</p>
        <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">${name}</h3>
        <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span><i class="fa-solid fa-fire mr-1"></i>${calories} kcal/100g</span>
        </div>
        <div class="grid grid-cols-4 gap-1 text-center">
          <div class="bg-emerald-50 rounded p-1.5"><p class="text-xs font-bold text-emerald-700">${protein}g</p><p class="text-[10px] text-gray-500">Protein</p></div>
          <div class="bg-blue-50 rounded p-1.5"><p class="text-xs font-bold text-blue-700">${carbs}g</p><p class="text-[10px] text-gray-500">Carbs</p></div>
          <div class="bg-purple-50 rounded p-1.5"><p class="text-xs font-bold text-purple-700">${fat}g</p><p class="text-[10px] text-gray-500">Fat</p></div>
          <div class="bg-orange-50 rounded p-1.5"><p class="text-xs font-bold text-orange-700">${sugar}g</p><p class="text-[10px] text-gray-500">Sugar</p></div>
        </div>
      </div>
    </div>
  `;
}

// Display product card grid
// products: array of product objects
// categoryName: optional active category string
export function displayProducts(products, categoryName = "") {
  productsLoading?.classList.add("hidden");

  if (!products || products.length === 0) {
    if (productsCount) {
      productsCount.textContent = categoryName
        ? `No products found in ${categoryName}`
        : "Search for products to see results";
    }
    if (productsGrid) {
      productsGrid.innerHTML = "";
      productsGrid.classList.add("hidden");
    }
    productsEmpty?.classList.remove("hidden");
    return;
  }

  productsEmpty?.classList.add("hidden");
  if (productsGrid) {
    productsGrid.classList.remove("hidden");
    productsGrid.innerHTML = products.map(renderProductCard).join("");
  }

  if (productsCount) {
    productsCount.textContent = categoryName
      ? `Showing ${products.length} products in ${categoryName}`
      : `Showing ${products.length} products`;
  }
}

// Show products loading spinner
export function showProductsLoading() {
  if (productsCount)
    productsCount.textContent = "Search for products to see results";
  productsEmpty?.classList.add("hidden");
  if (productsGrid) {
    productsGrid.innerHTML = "";
    productsGrid.classList.add("hidden");
  }
  productsLoading?.classList.remove("hidden");
}

// Get nutriscore modal details
// grade: grade letter string
function getNutriScoreDetails(grade) {
  if (grade === "a") return { color: "#038141", label: "Excellent", badgeBg: "#dfefe7" };
  if (grade === "b") return { color: "#85BB2F", label: "Good", badgeBg: "#f0f6e5" };
  if (grade === "c") return { color: "#fecb02", label: "Average", badgeBg: "#fff8df" };
  if (grade === "d") return { color: "#ee8100", label: "Poor", badgeBg: "#fdefdf" };
  if (grade === "e") return { color: "#e63e11", label: "Bad", badgeBg: "#fce7e1" };
  return null;
}

// Get NOVA modal details
// novaGroup: nova group number
function getNovaDetails(novaGroup) {
  if (novaGroup === 1) return { color: "#038141", label: "Unprocessed", badgeBg: "#dfefe7" };
  if (novaGroup === 2) return { color: "#85BB2F", label: "Culinary ingredients", badgeBg: "#f0f7df" };
  if (novaGroup === 3) return { color: "#ee8100", label: "Processed", badgeBg: "#fdefdf" };
  if (novaGroup === 4) return { color: "#e63e11", label: "Ultra-processed", badgeBg: "#fce7e1" };
  return null;
}

// Open product details modal
export function openProductModal() {
  productDetailModal?.classList.remove("hidden");
}

// Close product details modal
export function closeProductModal() {
  productDetailModal?.classList.add("hidden");
}

// Update product modal content
// product: selected product object
export function updateProductModal(product) {
  const {
    barcode = "",
    name = "Unknown Product",
    brand = "Unknown Brand",
    image = "",
    nutritionGrade = "unknown",
    novaGroup = "",
    nutrients = {},
  } = product;

  const grade = (nutritionGrade || "unknown").toLowerCase();
  const nutriScore = getNutriScoreDetails(grade);
  const nova = getNovaDetails(novaGroup);

  const calories = nutrients.calories?.toFixed(0) || 0;
  const protein = nutrients.protein?.toFixed(1) || 0;
  const carbs = nutrients.carbs?.toFixed(1) || 0;
  const fat = nutrients.fat?.toFixed(1) || 0;
  const sugar = nutrients.sugar?.toFixed(1) || 0;
  const fiber = nutrients.fiber?.toFixed(1) || 0;
  const sodium = nutrients.sodium?.toFixed(2) || 0;

  if (image) {
    pmImg.src = image;
    pmImg.alt = name;
    pmImg.classList.remove("hidden");
    pmImgFallback.classList.add("hidden");
  } else {
    pmImg.classList.add("hidden");
    pmImgFallback.classList.remove("hidden");
  }

  pmBrand.textContent = brand;
  pmName.textContent = name;
  pmCalories.textContent = calories;
  pmProtein.textContent = `${protein}g`;
  pmCarbs.textContent = `${carbs}g`;
  pmFat.textContent = `${fat}g`;
  pmSugar.textContent = `${sugar}g`;
  pmFiber.textContent = `${fiber}g`;
  pmSodium.textContent = `${sodium}mg`;

  pmProteinBar.style.width = `${Math.min((protein / 100) * 100, 100)}%`;
  pmCarbsBar.style.width = `${Math.min((carbs / 100) * 100, 100)}%`;
  pmFatBar.style.width = `${Math.min((fat / 100) * 100, 100)}%`;
  pmSugarBar.style.width = `${Math.min((sugar / 100) * 100, 100)}%`;

  if (nutriScore) {
    pmNutriscore.classList.remove("hidden");
    pmNutriscore.style.backgroundColor = nutriScore.badgeBg;
    pmNutriscoreLetter.textContent = grade.toUpperCase();
    pmNutriscoreLetter.style.backgroundColor = nutriScore.color;
    pmNutriscoreLetter.style.color = "white";
    pmNutriscoreDesc.textContent = nutriScore.label;
    if (pmNutriscoreLabel) pmNutriscoreLabel.style.color = nutriScore.color;
  } else {
    pmNutriscore.classList.add("hidden");
  }

  if (nova) {
    pmNova.classList.remove("hidden");
    pmNova.style.backgroundColor = nova.badgeBg;
    pmNovaNumber.textContent = novaGroup;
    pmNovaNumber.style.backgroundColor = nova.color;
    pmNovaDesc.textContent = nova.label;
    if (pmNovaLabel) pmNovaLabel.style.color = nova.color;
  } else {
    pmNova.classList.add("hidden");
  }

  pmLogBtn.dataset.barcode = barcode;
}
