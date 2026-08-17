// Products API base URL
const baseUrl = "https://nutriplan-api.vercel.app/api";

// Product endpoints
export const productsEndpoints = {
  searchProducts: (type = "q", value, page = 1, limit = 24) =>
    `/products/search?${type}=${value}&page=${page}&limit=${limit}`,
  searchByBarcode: (barcode) => `/products/barcode/${barcode}`,
  getProductCategories: () => `/products/categories`,
  getProductsByCategory: (category) => `/products/category/${category}`,
};

// Fetch data from product API
// endpoint: URL path string
export async function productsApiResults(endpoint) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return data?.results ?? data?.result;
  } catch (error) {
    console.error("Products API Error:", error);
  }
}
