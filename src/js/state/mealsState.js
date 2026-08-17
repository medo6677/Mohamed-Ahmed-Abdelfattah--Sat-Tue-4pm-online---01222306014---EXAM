import { getApiMealResults, mealEndPoints, analyzeRecipe } from "../api/mealsApi.js";

// Get all meals
export async function fetchMeals() {
  return await getApiMealResults(mealEndPoints.getMeals());
}

// Get all meal categories
export async function fetchCategories() {
  return await getApiMealResults(mealEndPoints.categories());
}

// Get all cuisine areas
export async function fetchAreas() {
  return await getApiMealResults(mealEndPoints.areas());
}

// Get one meal by ID
// id: meal ID string
export async function fetchMealById(id) {
  return await getApiMealResults(mealEndPoints.mealById(id));
}

// Filter meals by category
// category: category name string
export async function fetchMealsByCategory(category) {
  return await getApiMealResults(mealEndPoints.filter("category", category));
}

// Filter meals by area
// area:  area name string
export async function fetchMealsByArea(area) {
  return await getApiMealResults(mealEndPoints.filter("area", area));
}

// Search meals by keyword or ingredient or area
// query: search keyword string 
export async function fetchMealsSearch(query) {
  const [byName, byIngredient, byArea] = await Promise.all([
    getApiMealResults(mealEndPoints.search("q", query)),
    getApiMealResults(mealEndPoints.filter("ingredient", query)),
    getApiMealResults(mealEndPoints.filter("area", query)),
  ]);

  const combined = [...(byName || []), ...(byIngredient || []), ...(byArea || [])];
  const seen = new Set();
  return combined.filter((meal) => {
    if (seen.has(meal.id)) return false;
    seen.add(meal.id);
    return true;
  });
}

// Get nutrition data for recipe
// recipeName: meal name string
// ingredients: array of ingredient strings
export async function fetchNutritionAnalysis(recipeName, ingredients) {
  return await analyzeRecipe(recipeName, ingredients);
}
