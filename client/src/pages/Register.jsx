import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  WalletCards,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      newErrors.name = "Name is required.";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one number.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match.";
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
      await register(
        name.trim(),
        email.trim(),
        password
      );

      navigate("/login");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
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

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_500px]">
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
            Start building better
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              money habits.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-base font-semibold leading-7 text-slate-500 dark:text-slate-400">
            Create your Apna Khata account and keep your
            financial activity organized in one place.
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
            <ShieldCheck
              size={20}
              className="text-emerald-500"
            />
            Simple and secure account access
          </div>
        </div>

        {/* Register card */}
        <div className="w-full">
          <div className="rounded-[32px] border-2 border-slate-200/80 bg-white/85 p-7 shadow-[0_30px_80px_-35px_rgba(80,60,150,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-9">
            {/* Mobile brand */}
            <div className="mb-7 text-center lg:hidden">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 shadow-sm dark:border-purple-400/20 dark:from-purple-500/20 dark:to-purple-500/5 dark:text-purple-300">
                <WalletCards size={27} />
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Apna Khata
              </h1>
            </div>

            <div className="mb-7">
              <div className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.15em] text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
                Get started
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Create Account
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Set up your account to start managing your money.
              </p>
            </div>

            {serverError && (
              <div className="mb-5 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                >
                  Name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className={`${inputClass(
                      Boolean(errors.name)
                    )} pl-11`}
                    onChange={(e) => {
                      setName(e.target.value);

                      if (errors.name) {
                        setErrors((prev) => ({
                          ...prev,
                          name: "",
                        }));
                      }

                      if (serverError) {
                        setServerError("");
                      }
                    }}
                  />
                </div>

                {errors.name && (
                  <p className="mt-2 text-xs font-bold text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

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
                    placeholder="Create a strong password"
                    autoComplete="new-password"
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

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className={`${inputClass(
                      Boolean(errors.confirmPassword)
                    )} pl-11 pr-12`}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);

                      if (errors.confirmPassword) {
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword: "",
                        }));
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-2 text-xs font-bold text-red-600 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-purple-500 bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-extrabold text-purple-600 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;