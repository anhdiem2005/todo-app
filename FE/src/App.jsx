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
import { initialTasks, initialCategories } from "./app/constants/seedData";
import { getSession, logout } from "./app/services/authService";
import { addTaskToList, deleteTaskFromList, loadTasksFromStorage, saveTasksToStorage, toggleTaskStatus, updateTaskInList } from "./app/utils/taskStorage";

export default function App() {
  const [user, setUser] = useState(getSession);
  const [screen, setScreen] = useState(user ? "dashboard" : "login");
  const [tasks, setTasks] = useState(() => loadTasksFromStorage(initialTasks));
  const [categories] = useState(initialCategories);
  const [viewedTask, setViewedTask] = useState(null);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const handleLogin = (authData) => {
    setUser({ id: authData.id, name: authData.name, email: authData.email });
    setScreen("dashboard");
  };

  const handleRegister = (authData) => {
    setUser({ id: authData.id, name: authData.name, email: authData.email });
    setScreen("dashboard");
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setScreen("login");
  };

  const addTask = (t) => {
    setTasks(prev => addTaskToList(prev, t));
  };

  const editTask = (id, t) => {
    setTasks(prev => updateTaskInList(prev, id, t));
  };

  const deleteTask = (id) => {
    setTasks(prev => deleteTaskFromList(prev, id));
    if (viewedTask?.id === id) {
      setViewedTask(null);
    }
  };

  const toggleTask = (id) => {
    setTasks(prev => toggleTaskStatus(prev, id));
  };

  const updateTask = (t) => {
    setTasks(prev => updateTaskInList(prev, t.id, t));
    setViewedTask(t);
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
      return <MyTaskScreen tasks={tasks} onAdd={addTask} onView={t => setViewedTask(t)} onEdit={editTask} onDelete={deleteTask} onToggle={toggleTask} categories={categories} />;
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
