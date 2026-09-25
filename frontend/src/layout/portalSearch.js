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
    { route: "/staff-portal/my-account", keywords: ["staff", "employee", "account", "profile"] },
    { route: "/staff-portal/reports", keywords: ["report", "analytics", "chart", "data"] },
    { route: "/staff-portal/settings", keywords: ["settings", "config", "password"] },
  ],
  warehouse: [
    { route: "/warehouse-portal/dashboard", keywords: ["dashboard", "home", "overview"] },
    { route: "/warehouse-portal/products", keywords: ["product", "item", "inventory", "stock", "sku"] },
    { route: "/warehouse-portal/suppliers", keywords: ["supplier", "vendor", "delivery"] },
    { route: "/warehouse-portal/staff", keywords: ["staff", "employee", "team", "worker"] },
    { route: "/warehouse-portal/reports", keywords: ["report", "analytics", "chart", "data"] },
    { route: "/warehouse-portal/settings", keywords: ["settings", "config", "password"] },
  ],
};

export function findPortalSearchRoute(query, portal) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const destinations = portalDestinations[portal] || [];

  return destinations.find(({ keywords }) =>
    words.some((word) => keywords.some((keyword) => keyword.includes(word) || word.includes(keyword)))
  )?.route || null;
}