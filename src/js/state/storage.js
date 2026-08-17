// Local storage key name
const STORAGE_KEY = "nutriplan_daily_log";

// Get today Cairo date string
function getTodayDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// Read data from storage
function getStorageData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

// Save data to storage
// data: complete daily logs object
function saveStorageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Save log entry to storage
// item: food item 
// nutrients: calories and macro values
function saveEntry(item, nutrients) {
  const data = getStorageData();
  const today = getTodayDate();

  const todayLog = (data[today] ??= {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    meals: [],
  });

  const nutrition = {
    calories: Math.round(nutrients.calories || 0),
    protein: Math.round(nutrients.protein || 0),
    carbs: Math.round(nutrients.carbs || 0),
    fat: Math.round(nutrients.fat || 0),
  };

  todayLog.meals.push({
    ...item,
    nutrition,
    loggedAt: new Date().toISOString(),
  });

  todayLog.totalCalories += nutrition.calories;
  todayLog.totalProtein += nutrition.protein;
  todayLog.totalCarbs += nutrition.carbs;
  todayLog.totalFat += nutrition.fat;

  saveStorageData(data);
}

// Save meal to storage
// meal: meal details object
// servings: number of servings
// nutrition: calculated nutrition per serving
export function logMealToStorage(meal, servings, nutrition) {
  saveEntry(
    {
      type: "meal",
      name: meal.name,
      mealId: meal.id,
      category: meal.category,
      thumbnail: meal.thumbnail,
      servings,
    },
    {
      calories: (nutrition?.calories || 0) * servings,
      protein: (nutrition?.protein || 0) * servings,
      carbs: (nutrition?.carbs || 0) * servings,
      fat: (nutrition?.fat || 0) * servings,
    },
  );
}

// Save product to storage
// product: scanned product object
export function logProductToStorage(product) {
  saveEntry(
    {
      type: "product",
      name: product.name || "Unknown Product",
      barcode: product.barcode || "",
      brand: product.brand || "",
      thumbnail: product.image || "",
    },
    product.nutrients || {},
  );
}

// Get today food log
export function getTodayFoodLog() {
  const data = getStorageData();
  const today = getTodayDate();
  return (
    data[today] || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      meals: [],
    }
  );
}

// Remove item from storage
// index: meal item array index
export function removeFoodLogItem(index) {
  const data = getStorageData();
  const today = getTodayDate();
  const todayLog = data[today];
  if (!todayLog || !todayLog.meals) return;

  const item = todayLog.meals[index];
  if (!item) return;

  todayLog.totalCalories -= item.nutrition?.calories || 0;
  todayLog.totalProtein  -= item.nutrition?.protein  || 0;
  todayLog.totalCarbs    -= item.nutrition?.carbs    || 0;
  todayLog.totalFat      -= item.nutrition?.fat      || 0;

  todayLog.meals.splice(index, 1);

  saveStorageData(data);
}

// Clear today food log
export function clearTodayFoodLog() {
  const data = getStorageData();
  const today = getTodayDate();
  if (data[today]) {
    data[today] = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      meals: [],
    };
    saveStorageData(data);
  }
}
