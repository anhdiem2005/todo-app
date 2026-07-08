import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "./Header";
import { changePassword } from "../services/authService";

export default function ChangePasswordScreen() {
  const [show, setShow] = useState({ cur: false, new_: false, confirm: false });
  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError("");

    if (!curPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ tất cả các ô.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải dài từ 6 ký tự trở lên.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp với mật khẩu mới.");
      return;
    }

    try {
      await changePassword({ currentPassword: curPassword, newPassword: newPassword });
      setSaved(true);
      setCurPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Đổi mật khẩu thất bại.");
    }
  };

  return (
    <div className="flex flex-col h-full text-left">
      <Header title="Đổi mật khẩu" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md">
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border shadow-sm p-6">
            
            {saved && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
                <CheckCircle2 size={16} /> Cập nhật mật khẩu thành công!
              </div>
            )}

            {error && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={show.cur ? "text" : "password"}
                    value={curPassword}
                    onChange={e => setCurPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShow(s => ({ ...s, cur: !s.cur }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show.cur ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={show.new_ ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  <button type="button" onClick={() => setShow(s => ({ ...s, new_: !s.new_ }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show.new_ ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={show.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button type="button" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button type="submit" className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 shadow-md shadow-primary/20 text-center">
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}