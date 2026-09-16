import { useState } from "react";

import {
  UserRound,
  Mail,
  Shield,
  LockKeyhole,
  Eye,
  EyeOff,
  LogOut,
  Save,
  CheckCircle,
  AlertCircle,
  KeyRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (!email.trim()) {
      setError("Email cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const response = await updateProfile({
        name: name.trim(),
        email: email.trim(),
      });

      setMessage(
        response.message ||
          "Profile updated successfully"
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword) {
      setError("Enter your current password");
      return;
    }

    if (!newPassword) {
      setError("Enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await updateProfile({
        currentPassword,
        password: newPassword,
      });

      setMessage(
        response.message ||
          "Password updated successfully"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const inputClass =
    "w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-400/50";

  const passwordInputClass = `${inputClass} pr-12`;

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <section className="mb-7">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 shadow-sm dark:border-purple-400/20 dark:from-purple-500/20 dark:to-purple-500/5 dark:text-purple-300">
            <UserRound size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Settings
            </h1>

            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Manage your Apna Khata account.
            </p>
          </div>
        </div>
      </section>

      {/* Messages */}
      {(message || error) && (
        <div
          className={`mb-7 flex items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-sm font-bold ${
            message
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300"
          }`}
        >
          {message ? (
            <CheckCircle
              size={19}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />
          )}

          <span>{message || error}</span>
        </div>
      )}

      <div className="grid gap-7 lg:grid-cols-2">
        {/* Profile */}
        <section className="rounded-[30px] border-2 border-slate-200/80 bg-gradient-to-br from-white via-purple-50/35 to-white p-6 shadow-[0_22px_55px_-35px_rgba(100,70,180,0.35)] backdrop-blur-xl dark:border-white/10 dark:from-white/[0.06] dark:via-purple-500/[0.06] dark:to-white/[0.03] sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">
                Profile
              </h2>

              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Update your personal details.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleProfileUpdate}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Role
              </label>

              <div className="relative">
                <Shield
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={user?.role || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 pl-11 text-sm font-bold capitalize text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-purple-500 bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />

              {loading
                ? "Saving..."
                : "Save Profile"}
            </button>
          </form>
        </section>

        {/* Password */}
        <section className="rounded-[30px] border-2 border-slate-200/80 bg-gradient-to-br from-white via-indigo-50/30 to-white p-6 shadow-[0_22px_55px_-35px_rgba(80,80,180,0.35)] backdrop-blur-xl dark:border-white/10 dark:from-white/[0.06] dark:via-indigo-500/[0.06] dark:to-white/[0.03] sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              <KeyRound size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">
                Change Password
              </h2>

              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Keep your account protected.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordUpdate}
            className="space-y-5"
          >
            {/* Current */}
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Current Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  placeholder="Enter current password"
                  className={`${passwordInputClass} pl-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New */}
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  className={`${passwordInputClass} pl-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Confirm New Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  className={`${passwordInputClass} pl-11`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-indigo-500 bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LockKeyhole size={18} />

              {passwordLoading
                ? "Updating..."
                : "Change Password"}
            </button>
          </form>
        </section>
      </div>

      {/* Account */}
      <section className="mt-7 rounded-[30px] border-2 border-red-100 bg-gradient-to-br from-white via-red-50/30 to-white p-6 shadow-[0_20px_50px_-35px_rgba(220,70,70,0.3)] dark:border-red-400/10 dark:from-white/[0.05] dark:via-red-500/[0.04] dark:to-white/[0.03] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                <LogOut size={20} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950 dark:text-white">
                  Account
                </h2>

                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Logged in as {user?.email}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-3 text-sm font-extrabold text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;