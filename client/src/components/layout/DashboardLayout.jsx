import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  LayoutDashboard,
  Receipt,
  WalletCards,
  PiggyBank,
  Lightbulb,
  Repeat,
  Bell,
  Trophy,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function DashboardLayout() {
  const canvasRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  // MOBILE SIDEBAR
  // =====================================================

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  // =====================================================
  // THEME
  // =====================================================

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("apnaKhataTheme") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("apnaKhataTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await api.get("/notifications");

      const notifications = response.data.notifications || [];

      const unread = notifications.filter(
        (notification) => notification.isRead === false
      ).length;

      setUnreadNotifications(unread);
    } catch (error) {
      console.error(
        "Failed to fetch notification count:",
        error
      );
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  // =====================================================
  // BACKGROUND NETWORK
  // =====================================================

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame;

    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      active: false,
    };

    const particles = [];

    const createParticles = () => {
      particles.length = 0;

      const count =
        window.innerWidth < 700 ? 35 : 65;

      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,

          vx:
            (Math.random() - 0.5) *
            0.12,

          vy:
            (Math.random() - 0.5) *
            0.12,

          size:
            Math.random() * 1.15 +
            0.4,

          opacity:
            Math.random() * 0.12 +
            0.04,

          phase:
            Math.random() *
            Math.PI *
            2,

          phaseSpeed:
            0.0005 +
            Math.random() *
            0.0008,
        });
      }
    };

    const resizeCanvas = () => {
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
      );

      createParticles();
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const updateParticles = (time) => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.x +=
          Math.sin(
            time *
              particle.phaseSpeed +
              particle.phase
          ) * 0.02;

        particle.y +=
          Math.cos(
            time *
              particle.phaseSpeed *
              0.8 +
              particle.phase
          ) * 0.02;

        if (particle.x < -20) {
          particle.x = width + 20;
        }

        if (particle.x > width + 20) {
          particle.x = -20;
        }

        if (particle.y < -20) {
          particle.y = height + 20;
        }

        if (particle.y > height + 20) {
          particle.y = -20;
        }
      });
    };

    const drawConnections = () => {
      for (
        let i = 0;
        i < particles.length;
        i += 1
      ) {
        for (
          let j = i + 1;
          j < particles.length;
          j += 1
        ) {
          const first = particles[i];
          const second = particles[j];

          const dx =
            first.x - second.x;

          const dy =
            first.y - second.y;

          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          if (distance > 125) {
            continue;
          }

          const opacity =
            (1 - distance / 125) *
            0.035;

          ctx.beginPath();

          ctx.moveTo(
            first.x,
            first.y
          );

          ctx.lineTo(
            second.x,
            second.y
          );

          ctx.strokeStyle =
            `rgba(141, 123, 216, ${opacity})`;

          ctx.lineWidth = 0.5;

          ctx.stroke();
        }
      }
    };

    const drawParticles = () => {
      particles.forEach((particle) => {
        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(141, 123, 216, ${particle.opacity})`;

        ctx.fill();
      });
    };

    const drawCursorGlow = () => {
      if (!pointer.active) {
        return;
      }

      const gradient =
        ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          280
        );

      if (theme === "dark") {
        gradient.addColorStop(
          0,
          "rgba(141, 123, 216, 0.07)"
        );

        gradient.addColorStop(
          0.45,
          "rgba(141, 123, 216, 0.02)"
        );
      } else {
        gradient.addColorStop(
          0,
          "rgba(141, 123, 216, 0.045)"
        );

        gradient.addColorStop(
          0.45,
          "rgba(141, 123, 216, 0.012)"
        );
      }

      gradient.addColorStop(
        1,
        "rgba(141, 123, 216, 0)"
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        pointer.x - 280,
        pointer.y - 280,
        560,
        560
      );
    };

    const animate = (time) => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      updateParticles(time);
      drawConnections();
      drawParticles();
      drawCursorGlow();

      animationFrame =
        window.requestAnimationFrame(
          animate
        );
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    animationFrame =
      window.requestAnimationFrame(
        animate
      );

    return () => {
      window.cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, [theme]);

  // =====================================================
  // USER
  // =====================================================

  const firstLetter =
    user?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "U";

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // NAVIGATION ITEM
  // =====================================================

  const navItemClass = ({ isActive }) =>
    [
      "group",
      "relative",
      "flex",
      "items-center",
      "gap-3",
      "rounded-2xl",
      "border",
      "px-3.5",
      "py-3",
      "text-sm",
      "font-semibold",
      "transition-all",
      "duration-200",

      isActive
        ? [
            "border-purple-200",
            "bg-gradient-to-r",
            "from-purple-100",
            "to-purple-50",
            "text-purple-700",
            "shadow-[0_8px_25px_rgba(141,123,216,0.12)]",

            "dark:border-purple-400/20",
            "dark:from-purple-500/15",
            "dark:to-purple-500/5",
            "dark:text-purple-300",
          ].join(" ")
        : [
            "border-transparent",
            "text-slate-600",
            "hover:border-slate-200",
            "hover:bg-slate-50",
            "hover:text-slate-950",

            "dark:text-slate-400",
            "dark:hover:border-white/10",
            "dark:hover:bg-white/[0.04]",
            "dark:hover:text-white",
          ].join(" "),
    ].join(" ");

  return (
    <div
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#fafafa]
        text-slate-700
        transition-colors
        duration-300

        dark:bg-[#0b0b10]
        dark:text-slate-300
      "
    >
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <canvas
        ref={canvasRef}
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          h-full
          w-full
          opacity-40
          dark:opacity-60
        "
        aria-hidden="true"
      />

      {/* =================================================
          TOPBAR
          FULL WIDTH
          ABOVE SIDEBAR
      ================================================= */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-[100]

          flex
          h-[82px]
          items-center
          justify-center

          border-b
          border-slate-200/80
          bg-white/95
          px-4
          shadow-[0_4px_18px_rgba(25,20,45,0.045)]

          backdrop-blur-2xl

          transition-all
          duration-300

          dark:border-white/[0.08]
          dark:bg-[#0b0b10]/95
          dark:shadow-[0_4px_20px_rgba(0,0,0,0.20)]

          sm:px-8
        "
      >
        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          onClick={() =>
            setMobileSidebarOpen(
              (current) => !current
            )
          }
          aria-label={
            mobileSidebarOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={mobileSidebarOpen}
          className="
            absolute
            left-4
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            border-2
            border-slate-200
            bg-white
            text-slate-600
            shadow-sm
            transition-all
            duration-200

            hover:border-purple-200
            hover:bg-purple-50
            hover:text-purple-600

            dark:border-white/10
            dark:bg-white/[0.04]
            dark:text-slate-300

            dark:hover:border-purple-400/30
            dark:hover:bg-purple-500/10
            dark:hover:text-purple-300

            sm:hidden
          "
        >
          {mobileSidebarOpen ? (
            <X
              size={21}
              strokeWidth={2.2}
            />
          ) : (
            <Menu
              size={21}
              strokeWidth={2.2}
            />
          )}
        </button>

        {/* CENTER BRAND */}

        <button
          type="button"
          onClick={() => {
            closeMobileSidebar();
            navigate("/dashboard");
          }}
          aria-label="Go to dashboard"
          className="
            apna-khata-brand

            cursor-pointer
            text-[30px]
            font-black
            leading-none
            tracking-[-0.055em]
            text-slate-950

            transition-all
            duration-200

            hover:scale-[1.025]

            dark:text-white

            sm:text-[42px]
          "
        >
          Apna Khata
        </button>

        {/* RIGHT SIDE */}

        <div
          className="
            absolute
            right-4

            flex
            items-center
            gap-2

            sm:right-8
            sm:gap-3.5
          "
        >
          {/* THEME TOGGLE */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-2xl
              border-2
              border-slate-200

              bg-white
              text-slate-600

              shadow-sm

              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:border-purple-200
              hover:bg-purple-50
              hover:text-purple-600

              dark:border-white/10
              dark:bg-white/[0.04]
              dark:text-slate-300

              dark:hover:border-purple-400/30
              dark:hover:bg-purple-500/10
              dark:hover:text-purple-300

              sm:h-11
              sm:w-11
            "
          >
            {theme === "light" ? (
              <Moon
                size={18}
                strokeWidth={2}
              />
            ) : (
              <Sun
                size={18}
                strokeWidth={2}
              />
            )}
          </button>

          {/* PROFILE */}

          <button
            type="button"
            onClick={() => {
              closeMobileSidebar();
              navigate("/settings");
            }}
            aria-label="Open settings"
            className="
              flex
              items-center
              gap-3.5

              rounded-2xl
              border
              border-transparent

              px-1.5
              py-1.5

              text-left

              transition-all
              duration-200

              hover:border-slate-200
              hover:bg-slate-50

              dark:hover:border-white/10
              dark:hover:bg-white/[0.04]

              sm:px-2.5
            "
          >
            {/* AVATAR */}

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-full
                border
                border-purple-200/80

                bg-gradient-to-br
                from-purple-100
                to-purple-50

                text-sm
                font-extrabold
                text-purple-700

                shadow-[0_5px_20px_rgba(141,123,216,0.15)]

                dark:border-purple-400/20
                dark:from-purple-500/20
                dark:to-purple-500/5
                dark:text-purple-300
              "
            >
              {firstLetter}
            </div>

            {/* USERNAME ONLY */}

            <div className="hidden min-w-0 sm:block">
              <div
                className="
                  max-w-[180px]
                  truncate

                  text-sm
                  font-bold

                  text-slate-950
                  dark:text-white
                "
              >
                {user?.name || "User"}
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* =================================================
          MOBILE SIDEBAR BACKDROP
      ================================================= */}

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileSidebar}
          className="
            fixed
            inset-0
            z-40
            bg-slate-950/20
            backdrop-blur-[2px]

            dark:bg-black/45

            sm:hidden
          "
        />
      )}

      {/* =================================================
          SIDEBAR
          DESKTOP = PERMANENT
          MOBILE = DRAWER
      ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-[82px]
          z-50

          flex
          h-[calc(100vh-82px)]
          w-[280px]
          flex-col

          border-r
          border-slate-200/80
          bg-white/95

          px-4
          py-5

          shadow-[8px_0_30px_rgba(25,20,45,0.08)]

          backdrop-blur-2xl

          transition-transform
          duration-300
          ease-out

          dark:border-white/[0.08]
          dark:bg-[#111117]/95
          dark:shadow-[8px_0_30px_rgba(0,0,0,0.35)]

          sm:w-[235px]
          sm:translate-x-0
          sm:shadow-[8px_0_30px_rgba(25,20,45,0.035)]

          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* MOBILE SIDEBAR HEADER */}

        <div
          className="
            mb-3
            flex
            items-center
            justify-between

            sm:hidden
          "
        >
          <span
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.18em]
              text-slate-400

              dark:text-slate-500
            "
          >
            Navigation
          </span>

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close navigation"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-colors

              hover:bg-slate-100
              hover:text-slate-900

              dark:hover:bg-white/[0.05]
              dark:hover:text-white
            "
          >
            <X
              size={19}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          <NavLink
            to="/dashboard"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <LayoutDashboard
              size={19}
              strokeWidth={2}
            />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/transactions"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <Receipt
              size={19}
              strokeWidth={2}
            />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/budgets"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <WalletCards
              size={19}
              strokeWidth={2}
            />
            <span>Budgets</span>
          </NavLink>

          <NavLink
            to="/savings-goals"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <PiggyBank
              size={19}
              strokeWidth={2}
            />
            <span>Savings Goals</span>
          </NavLink>

          <NavLink
            to="/insights"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <Lightbulb
              size={19}
              strokeWidth={2}
            />
            <span>Insights</span>
          </NavLink>

          <NavLink
            to="/recurring-transactions"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <Repeat
              size={19}
              strokeWidth={2}
            />
            <span>Recurring</span>
          </NavLink>

          <NavLink
            to="/notifications"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <Bell
              size={19}
              strokeWidth={2}
            />

            <span className="flex-1">
              Notifications
            </span>

            {unreadNotifications > 0 && (
              <span
                className="
                  flex
                  min-w-5
                  items-center
                  justify-center

                  rounded-full
                  border
                  border-red-200

                  bg-red-50

                  px-1.5
                  py-0.5

                  text-[10px]
                  font-bold
                  leading-none
                  text-red-600

                  dark:border-red-400/20
                  dark:bg-red-500/10
                  dark:text-red-400
                "
              >
                {unreadNotifications}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/gamification"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <Trophy
              size={19}
              strokeWidth={2}
            />
            <span>Streaks</span>
          </NavLink>

          <NavLink
            to="/money-owed"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <WalletCards
              size={19}
              strokeWidth={2}
            />
            <span>Money Owed</span>
          </NavLink>
        </nav>

        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div
          className="
            mt-5
            space-y-1.5

            border-t
            border-slate-200

            pt-4

            dark:border-white/[0.08]
          "
        >
          <NavLink
            to="/settings"
            onClick={closeMobileSidebar}
            className={navItemClass}
          >
            <Settings
              size={19}
              strokeWidth={2}
            />
            <span>Settings</span>
          </NavLink>

          <button
            type="button"
            onClick={() => {
              closeMobileSidebar();
              handleLogout();
            }}
            className="
              flex
              w-full
              items-center
              gap-3

              rounded-2xl
              border
              border-transparent

              px-3.5
              py-3

              text-sm
              font-semibold

              text-slate-600

              transition-all
              duration-200

              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600

              dark:text-slate-400
              dark:hover:border-red-400/15
              dark:hover:bg-red-500/10
              dark:hover:text-red-400
            "
          >
            <LogOut
              size={19}
              strokeWidth={2}
            />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main
        className="
          relative
          z-10

          min-h-screen

          pl-0
          pt-[82px]

          sm:pl-[235px]
        "
      >
        <section
          className="
            relative
            min-h-[calc(100vh-82px)]

            px-4
            py-6

            transition-colors
            duration-300

            sm:px-8
            sm:py-8

            md:px-10
            md:py-9
          "
        >
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;