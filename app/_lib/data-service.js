import { eachDayOfInterval } from "date-fns";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Helper function for API calls
async function apiRequest(endpoint, options = {}) {
  // Dynamically import auth to avoid circular dependency issues if any
  const { auth } = await import("./auth");
  const session = await auth();

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache || "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

/////////////
// GET - Cabins

export async function getCabin(id) {
  return apiRequest(`/cabins/${id}`);
}

export async function getCabinPrice(id) {
  return apiRequest(`/cabins/${id}/price`);
}

export const getCabins = async function () {
  return apiRequest("/cabins");
};

/////////////
// GET - Guests

export async function getGuest(email) {
  // Used for internal checks or if we need to fetch guest data specifically
  const data = await apiRequest(`/guests?email=${encodeURIComponent(email)}`);
  return data;
}

/////////////
// GET - Bookings

export async function getBooking(id) {
  return apiRequest(`/bookings/${id}`);
}

export async function getBookings(guestId) {
  const allBookings = await apiRequest(`/bookings?guestId=${guestId}`);
  return allBookings.data || allBookings;
}

export async function getBookedDatesByCabinId(cabinId) {
  const bookedDates = await apiRequest(`/cabins/${cabinId}/booked-dates`);
  return bookedDates.map((date) => new Date(date));
}

/////////////
// GET - Settings

export async function getSettings() {
  return apiRequest("/settings");
}

/////////////
// GET - Countries (external API)

export async function getCountries() {
  try {
    const res = await fetch("https://restcountries.com/v2/all?fields=name,flag");
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  // Note: Registration is primarily handled via Google Login now. 
  // This might be used for manual creation if we ever add it.
  return apiRequest("/guests", {
    method: "POST",
    body: JSON.stringify(newGuest),
  });
}

export async function createBooking(newBooking) {
  return apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(newBooking),
  });
}

/////////////
// UPDATE

export async function updateGuest(id, updatedFields) {
  return apiRequest(`/guests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updatedFields),
  });
}

export async function updateBooking(id, updatedFields) {
  return apiRequest(`/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updatedFields),
  });
}

/////////////
// DELETE

export async function deleteBooking(id) {
  return apiRequest(`/bookings/${id}`, {
    method: "DELETE",
  });
}
