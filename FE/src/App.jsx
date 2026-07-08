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
import { createTask, deleteTask as deleteTaskApi, getTasks, updateTask as updateTaskApi, getSession, logout } from "./app/services/authService";

export default function App() {
  const [user, setUser] = useState(getSession);
  const [screen, setScreen] = useState(user ? "dashboard" : "login");
  const [tasks, setTasks] = useState([]);
  const [categories] = useState(initialCategories);
  const [viewedTask, setViewedTask] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        setLoadingTasks(true);
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTasks(false);
      }
    };
    load();
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
  };

  const addTask = async (t) => {
    try {
      const created = await createTask(t);
      setTasks(prev => [created, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const editTask = async (id, t) => {
    try {
      const updated = await updateTaskApi(id, t);
      setTasks(prev => prev.map(task => task.id === id ? updated : task));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskApi(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      if (viewedTask?.id === id) {
        setViewedTask(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    const current = tasks.find(task => task.id === id);
    if (!current) return;
    const nextStatus = current.status === "Done" ? "To Do" : "Done";
    try {
      const updated = await updateTaskApi(id, { ...current, status: nextStatus });
      setTasks(prev => prev.map(task => task.id === id ? updated : task));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async (t) => {
    try {
      const updated = await updateTaskApi(t.id, t);
      setTasks(prev => prev.map(task => task.id === t.id ? updated : task));
      setViewedTask(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNav = (s) => {
    setViewedTask(null);
    setScreen(s);
  };

  if (screen === "login")
    return <LoginScreen onLogin={handleLogin} onSwitch={() => setScreen("register")} />;
  if (screen === "register")
    return <RegisterScreen onRegister={handleRegister} onSwitch={() => setScreen("login")} />;

  const mainContent = () => {
    if (screen === "dashboard") return <DashboardScreen tasks={tasks} user={user} />;
    if (screen === "my-task") {
      if (viewedTask) {
        return <ViewTaskScreen task={viewedTask} onBack={() => setViewedTask(null)} onUpdate={updateTask} />;
      }
      return <MyTaskScreen tasks={tasks} loading={loadingTasks} onAdd={addTask} onView={t => setViewedTask(t)} onEdit={editTask} onDelete={deleteTask} onToggle={toggleTask} categories={categories} />;
    }
    if (screen === "categories") return <CategoriesScreen categories={categories} tasks={tasks} />;
    if (screen === "account") return <AccountScreen />;
    if (screen === "change-password") return <ChangePasswordScreen />;
    return null;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden w-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar screen={screen} onNav={handleNav} user={user} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {mainContent()}
      </main>
    </div>
  );
}
