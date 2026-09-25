const portalDestinations = {
  admin: [
    { route: "/admin/products", keywords: ["product", "item", "inventory", "stock", "sku", "brand"] },
    { route: "/admin/orders", keywords: ["order", "purchase", "bill", "invoice", "pending", "completed"] },
    { route: "/admin/staff", keywords: ["staff", "employee", "team", "member", "admin", "manager", "worker"] },
    { route: "/admin/warehouse", keywords: ["warehouse", "zone", "location", "storage", "pallet", "bay"] },
    { route: "/admin/suppliers", keywords: ["supplier", "dealer", "distributor", "vendor", "partner"] },
    { route: "/admin/categories", keywords: ["category", "categories", "department", "tax", "slug"] },
    { route: "/admin/reports", keywords: ["report", "analytics", "chart", "forecast", "revenue", "data"] },
    { route: "/admin/settings", keywords: ["settings", "config", "profile", "password", "business"] },
    { route: "/admin/dashboard", keywords: ["dashboard", "home", "overview"] },
  ],
  staff: [
    { route: "/staff-portal/dashboard", keywords: ["dashboard", "home", "overview"] },
    { route: "/staff-portal/inventory", keywords: ["inventory", "product", "item", "stock", "sku"] },
  ],
  manager: [
    { route: "/manager-portal/dashboard", keywords: ["dashboard", "home", "overview"] },
    { route: "/manager-portal/inventory", keywords: ["inventory", "product", "item", "stock", "sku"] },
    { route: "/manager-portal/orders", keywords: ["order", "purchase", "shipment", "pending"] },
  ],
  warehouse: [
    { route: "/warehouse-portal/dashboard", keywords: ["dashboard", "home", "overview"] },
    { route: "/warehouse-portal/inventory", keywords: ["inventory", "product", "item", "stock", "sku", "warehouse"] },
  ],
};

export function findPortalSearchRoute(query, portal) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const destinations = portalDestinations[portal] || [];

  return destinations.find(({ keywords }) =>
    words.some((word) => keywords.some((keyword) => keyword.includes(word) || word.includes(keyword)))
  )?.route || null;
}