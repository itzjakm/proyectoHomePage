const p = process?.env ? process.env : import.meta.env;
export const FRONTEND_GITHUB = p.VITE_FRONTEND_GITHUB;
export const BACKEND_GITHUB = p.VITE_BACKEND_GITHUB;
