export const CATEGORIES = ["All books", "Fiction", "Romance", "Mystery", "Fantasy", "Self-help"];

export const EMPTY_CHECKOUT = {
  customerName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  paymentMethod: "CARD",
  rewardPointsToUse: 0,
};

export function readSaved(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
