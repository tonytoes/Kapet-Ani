export const LINK_PATH =
  window.location.origin.includes("localhost")
    ? "http://localhost/backend/controllers/"
    : `${window.location.origin}/backend/controllers/`;