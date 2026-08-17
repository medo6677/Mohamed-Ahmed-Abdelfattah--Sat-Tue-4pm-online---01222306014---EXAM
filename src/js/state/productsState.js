import { productsApiResults, productsEndpoints } from "../api/productsApi.js";

// Get all product categories
export async function fetchProductCategories() {
  return await productsApiResults(productsEndpoints.getProductCategories());
}

// Filter products by category
// category: product category string
export async function fetchProductsByCategory(category) {
  return await productsApiResults(productsEndpoints.getProductsByCategory(category));
}

// Search products by name
// query: search keyword string
export async function fetchSearchProducts(query) {
  return await productsApiResults(productsEndpoints.searchProducts("q", query));
}

// Get product by barcode
// barcode: product barcode string
export async function fetchProductByBarcode(barcode) {
  return await productsApiResults(productsEndpoints.searchByBarcode(barcode));
}
