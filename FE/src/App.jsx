import React, { useState } from "react";
import Sidebar from "./app/components/Sidebar";
import LoginScreen from "./app/components/LoginScreen";
import RegisterScreen from "./app/components/RegisterScreen";
import DashboardScreen from "./app/components/DashboardScreen";
import MyTaskScreen from "./app/components/MyTaskScreen";
import ViewTaskScreen from "./app/components/ViewTaskScreen";
import CategoriesScreen from "./app/components/CategoriesScreen";
import AccountScreen from "./app/components/AccountScreen";
import ChangePasswordScreen from "./app/components/ChangePasswordScreen";
import { USER, initialTasks, initialCategories } from "./app/constants/seedData";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [tasks, setTasks] = useState(initialTasks);
  const [categories] = useState(initialCategories);
  const [viewedTask, setViewedTask] = useState(null);

  const addTask = (t) => {
    setTasks(prev => [...prev, { ...t, id: Date.now(), subtasks: [] }]);
  };
  
  const editTask = (id, t) => {
    setTasks(prev => prev.map(p => p.id === id ? { ...p, ...t } : p));
  };
  
  const updateTask = (t) => {
    setTasks(prev => prev.map(p => p.id === t.id ? t : p));
    setViewedTask(t);
  };

  const handleNav = (s) => {
    setViewedTask(null);
    setScreen(s);
  };

  if (screen === "login") return <LoginScreen onLogin={() => setScreen("dashboard")} onSwitch={() => setScreen("register")} />;
  if (screen === "register") return <RegisterScreen onRegister={() => setScreen("dashboard")} onSwitch={() => setScreen("login")} />;

  const mainContent = () => {
    if (screen === "dashboard") return <DashboardScreen tasks={tasks} user={USER} />;
    if (screen === "my-task") {
      if (viewedTask) {
        return <ViewTaskScreen task={viewedTask} onBack={() => setViewedTask(null)} onUpdate={updateTask} />;
      }
      return <MyTaskScreen tasks={tasks} onAdd={addTask} onView={t => setViewedTask(t)} onEdit={editTask} categories={categories} />;
    }
    if (screen === "categories") return <CategoriesScreen categories={categories} tasks={tasks} />;
    if (screen === "account") return <AccountScreen />;
    if (screen === "change-password") return <ChangePasswordScreen />;
    return null;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden w-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar screen={screen} onNav={handleNav} user={USER} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {mainContent()}
      </main>
    </div>
  );
}
