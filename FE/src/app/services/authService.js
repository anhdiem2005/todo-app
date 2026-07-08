const API_BASE = "/api";

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");
  const user = getSession();
  const userId = user?.id;

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId ? { "X-User-Id": String(userId) } : {}),
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

  // Nếu backend trả về 401, xóa session cũ và reload để đưa người dùng về màn hình login
  if (res.status === 401) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.reload(); 
    throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
  }

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    throw new Error(typeof payload === "string" ? payload : payload?.message || "Yêu cầu thất bại.");
  }

  return payload;
}

/**
 * Đăng ký tài khoản mới
 */
export async function register(data) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Sử dụng camelCase đồng bộ, mặc định .NET 8 System.Text.Json sẽ tự map sang PascalCase
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
 */
export async function login(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Đồng bộ sử dụng chữ cái đầu viết thường (camelCase) để khớp cấu hình JSON mặc định của .NET
    body: JSON.stringify({ 
      email: data.email, 
      password: data.password 
    }), 
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

export function getSession() {
  try {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("auth_user");
    
    if (!token || !user) {
      return null;
    }
    
    return JSON.parse(user);
  } catch {
    return null;
  }
}

/** Đăng xuất */
export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

// --- CÁC CHỨC NĂNG TASKS (Sử dụng hàm request chung để tự động đính kèm Token) ---

export async function getTasks() {
  return request("/tasks");
}

export async function createTask(taskData) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate,
      subtasks: taskData.subtasks // Mảng chứa các { label, done } khớp hoàn toàn DTO Backend
    }),
  });
}

export async function updateTask(id, taskData) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate,
      subtasks: taskData.subtasks
    }),
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
    body: JSON.stringify({
      name: data.name
    }),
  });
}

export async function changePassword(data) {
  return request("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    }),
  });
}