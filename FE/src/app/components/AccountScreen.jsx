import React, { useState } from "react";
import Header from "./Header";
import { updateProfile, getSession, saveSession } from "../services/authService";

export default function AccountScreen() {
  const sessionUser = getSession() || { name: "Người dùng", email: "unknown@mail.com" };
  const [name, setName] = useState(sessionUser.name);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setMessage("");
    setError("");
    try {
      const res = await updateProfile({ name });
      
      // Đọc thông tin user hiện tại ra
      const currentUserStr = localStorage.getItem("auth_user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        // Chỉ cập nhật lại trường tên (Name) mới từ API trả về
        currentUser.name = res.name; 
        localStorage.setItem("auth_user", JSON.stringify(currentUser));
      }
      
      setMessage(res.message);
      setEditing(false);

      // Kích hoạt reload để cập nhật hiển thị Avatar/Tên ở Sidebar ngay lập tức
      window.location.reload(); 
    } catch (err) {
      setError(err.message || "Cập nhật thất bại.");
    }
  };

  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full text-left">
      <Header title="Thông tin cá nhân" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-4">
            
            {message && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">{error}</div>}

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-extrabold">
                {initials}
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">{name}</p>
                <p className="text-sm text-muted-foreground">{sessionUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Họ và Tên</label>
                <input
                  disabled={!editing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm text-foreground focus:outline-none transition-all ${editing ? "bg-input-background border border-primary/50 focus:ring-2 focus:ring-primary/40" : "bg-muted border border-transparent"}`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Địa chỉ Email (Không được sửa)</label>
                <input
                  disabled
                  value={sessionUser.email}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-muted-foreground bg-muted border border-transparent cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {editing ? (
                <>
                  <button onClick={() => { setName(sessionUser.name); setEditing(false); }} className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted text-center">Hủy</button>
                  <button onClick={handleUpdate} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 shadow-md shadow-primary/20 text-center">Cập nhật</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 shadow-md shadow-primary/20 text-center">Chỉnh sửa thông tin</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}