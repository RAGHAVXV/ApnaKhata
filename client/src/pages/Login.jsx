import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  WalletCards,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    [
      "w-full",
      "rounded-2xl",
      "border-2",
      "bg-white",
      "px-4",
      "py-3.5",
      "text-sm",
      "font-semibold",
      "text-slate-950",
      "outline-none",
      "transition-all",
      "duration-200",
      "placeholder:text-slate-400",
      "dark:bg-white/[0.04]",
      "dark:text-white",
      "dark:placeholder:text-slate-500",
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:border-red-400/30"
        : "border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 dark:border-white/10 dark:focus:border-purple-400/50",
    ].join(" ");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-10 text-slate-900 transition-colors duration-300 dark:bg-[#0b0b10] dark:text-white sm:px-8">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-600/10" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_480px]">
        {/* Brand side */}
        <div className="hidden lg:block">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 shadow-lg shadow-purple-200/30 dark:border-purple-400/20 dark:from-purple-500/20 dark:to-purple-500/5 dark:text-purple-300">
              <WalletCards size={27} />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Apna Khata
              </h1>

              <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                Your money. Your control.
              </p>
            </div>
          </div>

          <h2 className="max-w-xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 dark:text-white">
            Take control of your
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              financial life.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-base font-semibold leading-7 text-slate-500 dark:text-slate-400">
            Track transactions, manage budgets, build savings goals,
            and understand where your money is going.
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
            <ShieldCheck
              size={20}
              className="text-emerald-500"
            />
            Secure account access
          </div>
        </div>

        {/* Login card */}
        <div className="w-full">
          <div className="rounded-[32px] border-2 border-slate-200/80 bg-white/85 p-7 shadow-[0_30px_80px_-35px_rgba(80,60,150,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-9">
            {/* Mobile brand */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 shadow-sm dark:border-purple-400/20 dark:from-purple-500/20 dark:to-purple-500/5 dark:text-purple-300">
                <WalletCards size={27} />
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Apna Khata
              </h1>
            </div>

            <div className="mb-7">
              <div className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.15em] text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
                Welcome back
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Login
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Sign in to continue managing your finances.
              </p>
            </div>

            {serverError && (
              <div className="mb-5 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`${inputClass(
                      Boolean(errors.email)
                    )} pl-11`}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      if (errors.email) {
                        setErrors((prev) => ({
                          ...prev,
                          email: "",
                        }));
                      }

                      if (serverError) {
                        setServerError("");
                      }
                    }}
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-xs font-bold text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`${inputClass(
                      Boolean(errors.password)
                    )} pl-11 pr-12`}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (errors.password) {
                        setErrors((prev) => ({
                          ...prev,
                          password: "",
                        }));
                      }

                      if (serverError) {
                        setServerError("");
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-xs font-bold text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-purple-500 bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              <span className="text-xs font-bold text-slate-400">
                OR
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-extrabold text-purple-600 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;