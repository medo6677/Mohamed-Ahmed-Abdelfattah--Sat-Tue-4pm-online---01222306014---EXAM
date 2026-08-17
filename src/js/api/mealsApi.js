// API base URL
const baseUrl = "https://nutriplan-api.vercel.app/api";

// All meal API endpoints
export const mealEndPoints = {
  getMeals: (page = 1, limit = 25) =>
    `/meals/search?page=${page}&limit=${limit}`,
  categories: () => `/meals/categories`,
  search: (type, searchValue, page = 1, limit = 25) =>
    `/meals/search?${type}=${searchValue}&page=${page}&limit=${limit}`,
  filter: (type, value, page = 1, limit = 25) =>
    `/meals/filter?${type}=${value}&page=${page}&limit=${limit}`,
  mealById: (id) => `/meals/${id}`,
  random: (count = 3) => `/meals/random?count=${count}`,
  areas: () => `/meals/areas`,
};

// Fetch data from meals API
// endpoint: URL path string
export async function getApiMealResults(endpoint) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return data?.results ?? data?.result;
  } catch (error) {
    console.error("Meals API Error:", error.message);
  }
}

// Nutrition analysis base URL
const nutriplanUrl = {
  baseUrl: "https://nutriplan-api.vercel.app/api",
  endpoint: `/nutrition/analyze`,
};

// Send recipe for nutrition analysis
// recipeName: meal name string
// ingredients: array of ingredient strings
export async function analyzeRecipe(recipeName, ingredients) {
  try {
    const response = await fetch(
      `${nutriplanUrl.baseUrl}${nutriplanUrl.endpoint}`,
      {
        method: "POST",
        headers: {
          "x-api-key": "klEc9IAngEIanBZyFnZe7gH9qaatbkVVAvdpnp76",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeName, ingredients }),
      },
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Nutrition API Error:", error);
    throw error;
  }
}
