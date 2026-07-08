const API_BASE = "/api";

/**
 * Đăng ký tài khoản mới
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ id, name, email, token }>}
 */
export async function register(data) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Đăng ký thất bại.");
  }
  return json;
}

/**
 * Đăng nhập
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ id, name, email, token }>}
 */
export async function login(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: data.email, password: data.password }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Đăng nhập thất bại.");
  }
  return json;
}

/** Lưu thông tin user vào localStorage */
export function saveSession(authData) {
  localStorage.setItem("auth_token", authData.token);
  localStorage.setItem("auth_user", JSON.stringify({
    id: authData.id,
    name: authData.name,
    email: authData.email,
  }));
}

/** Lấy user đang đăng nhập */
export function getSession() {
  try {
    const user = localStorage.getItem("auth_user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/** Đăng xuất */
export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}
