import jwt from "jwt-simple";

const SECRET_KEY = "demo_secret_key"; 
const isBrowser = typeof window !== "undefined";

// REGISTER
export const registerUser = (email, password) => {
  if (!isBrowser) return false;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find((u) => u.email === email)) {
    return false; // already registered
  }

  users.push({ email, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
};

// ----------------------
// LOGIN → CREATE JWT
// ----------------------
export const loginUser = (email, password) => {
  if (!isBrowser) return null;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return null;

  // Payload for JWT
  const payload = {
    email,
    exp: Date.now() + 10 * 60 * 1000, // token expires in 10 minutes
  };

  const token = jwt.encode(payload, SECRET_KEY);
  saveToken(token);
  return token;
};

// ----------------------
// TOKEN MANAGEMENT
// ----------------------
export const saveToken = (token) => {
  if (isBrowser) {
    localStorage.setItem("authToken", token);
  }
};

export const getToken = () => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
};

export const removeToken = () => {
  if (isBrowser) {
    localStorage.removeItem("authToken");
  }
};

// ----------------------
// VALIDATION + USER INFO
// ----------------------
export const isTokenValid = () => {
  if (!isBrowser) return false;

  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwt.decode(token, SECRET_KEY);
    if (decoded.exp < Date.now()) {
      removeToken();
      return false; // expired
    }
    return true;
  } catch {
    return false; // invalid or tampered token
  }
};

export const getCurrentUser = () => {
  if (!isBrowser) return null;

  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwt.decode(token, SECRET_KEY);
    if (decoded.exp < Date.now()) {
      removeToken();
      return null;
    }
    return decoded.email;
  } catch {
    return null;
  }
};
