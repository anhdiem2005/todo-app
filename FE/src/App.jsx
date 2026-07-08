import React, { useEffect, useState } from "react";
import Sidebar from "./app/components/Sidebar";
import LoginScreen from "./app/components/LoginScreen";
import RegisterScreen from "./app/components/RegisterScreen";
import DashboardScreen from "./app/components/DashboardScreen";
import MyTaskScreen from "./app/components/MyTaskScreen";
import ViewTaskScreen from "./app/components/ViewTaskScreen";
import CategoriesScreen from "./app/components/CategoriesScreen";
import AccountScreen from "./app/components/AccountScreen";
import ChangePasswordScreen from "./app/components/ChangePasswordScreen";
import { initialCategories } from "./app/constants/seedData";
import { 
  createTask, 
  deleteTask as deleteTaskApi, 
  getTasks, 
  updateTask as updateTaskApi, 
  getSession, 
  logout 
} from "./app/services/authService";

export default function App() {
  const [user, setUser] = useState(getSession());
  const [screen, setScreen] = useState(getSession() ? "dashboard" : "login");
  const [tasks, setTasks] = useState([]);
  const [categories] = useState(initialCategories);
  const [viewedTask, setViewedTask] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // 1. Tự động tải danh sách Tasks bất cứ khi nào User trạng thái Đăng nhập thay đổi
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const loadData = async () => {
      try {
        setLoadingTasks(true);
        const data = await getTasks();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Không thể tải danh sách công việc:", err);
      } finally {
        setLoadingTasks(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogin = (authData) => {
    const nextUser = { id: authData.id, name: authData.name, email: authData.email };
    setUser(nextUser);
    setScreen("dashboard");
  };

  const handleRegister = (authData) => {
    const nextUser = { id: authData.id, name: authData.name, email: authData.email };
    setUser(nextUser);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setScreen("login");
    setViewedTask(null);
  };

  // 2. Thêm công việc mới qua API và cập nhật giao diện lập tức
  const addTask = async (taskData) => {
    try {
      const created = await createTask(taskData);
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      console.error("Lỗi thêm công việc:", err);
    }
  };

  // 3. Sửa thông tin công việc qua API
  const editTask = async (id, taskData) => {
    try {
      const updated = await updateTaskApi(id, taskData);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      
      // Nếu đang xem chi tiết chính task này, cập nhật giao diện xem chi tiết luôn
      if (viewedTask?.id === id) {
        setViewedTask(updated);
      }
    } catch (err) {
      console.error("Lỗi cập nhật công việc:", err);
    }
  };

  // 4. Xóa công việc qua API
  const deleteTask = async (id) => {
    try {
      await deleteTaskApi(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      if (viewedTask?.id === id) {
        setViewedTask(null);
      }
    } catch (err) {
      console.error("Lỗi xóa công việc:", err);
    }
  };

  // 5. Đánh dấu Hoàn thành / Chưa hoàn thành nhanh bằng nút tích chọn
  const toggleTask = async (id) => {
    const current = tasks.find((task) => task.id === id);
    if (!current) return;
    
    // Đảo ngược trạng thái Done <-> To Do
    const nextStatus = current.status === "Done" ? "To Do" : "Done";
    try {
      const updated = await updateTaskApi(id, { ...current, status: nextStatus });
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      
      if (viewedTask?.id === id) {
        setViewedTask(updated);
      }
    } catch (err) {
      console.error("Lỗi thay đổi trạng thái:", err);
    }
  };

  // 6. Cập nhật task từ màn hình xem chi tiết (ViewTaskScreen)
  const updateTaskFromView = async (t) => {
    try {
      const updated = await updateTaskApi(t.id, t);
      setTasks((prev) => prev.map((task) => (task.id === t.id ? updated : task)));
      setViewedTask(updated);
    } catch (err) {
      console.error("Lỗi cập nhật từ màn hình chi tiết:", err);
    }
  };

  const handleNav = (targetScreen) => {
    setViewedTask(null);
    setScreen(targetScreen);
  };

  // Phân luồng hiển thị màn hình Đăng nhập / Đăng ký
  if (screen === "login")
    return <LoginScreen onLogin={handleLogin} onSwitch={() => setScreen("register")} />;
  if (screen === "register")
    return <RegisterScreen onRegister={handleRegister} onSwitch={() => setScreen("login")} />;

  // Hàm render nội dung chính của ứng dụng theo Tab Menu điều hướng
  const renderMainContent = () => {
    switch (screen) {
      case "dashboard":
        return <DashboardScreen tasks={tasks} user={user} />;
      case "my-task":
        if (viewedTask) {
          return (
            <ViewTaskScreen 
              task={viewedTask} 
              onBack={() => setViewedTask(null)} 
              onUpdate={updateTaskFromView} 
            />
          );
        }
        return (
          <MyTaskScreen 
            tasks={tasks} 
            loading={loadingTasks} 
            onAdd={addTask} 
            onView={(t) => setViewedTask(t)} 
            onEdit={editTask} 
            onDelete={deleteTask} 
            onToggle={toggleTask} 
            categories={categories} 
          />
        );
      case "categories":
        return <CategoriesScreen categories={categories} tasks={tasks} />;
      case "account":
        return <AccountScreen user={user} />;
      case "change-password":
        return <ChangePasswordScreen />;
      default:
        return <DashboardScreen tasks={tasks} user={user} />;
    }
  };

  return (
    <div 
      className="flex h-screen bg-background overflow-hidden w-full" 
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Cột Menu điều hướng bên trái */}
      <Sidebar screen={screen} onNav={handleNav} user={user} onLogout={handleLogout} />
      
      {/* Vùng hiển thị nội dung chính bên phải */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {renderMainContent()}
      </main>
    </div>
  );
}