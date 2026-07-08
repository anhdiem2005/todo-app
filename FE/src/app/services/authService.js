const API_BASE = "/api";

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  if (options.body && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    throw new Error(typeof payload === "string" ? payload : payload?.message || "Yêu cầu thất bại.");
  }

  return typeof payload === "string" ? payload : payload;
}

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

export async function getTasks() {
  return request("/tasks");
}

export async function createTask(taskData) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}

export async function updateTask(id, taskData) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
}

export async function updateProfile(data) {
  return request("/auth/update-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data) {
  return request("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}