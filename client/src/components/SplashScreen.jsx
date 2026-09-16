import { useEffect } from "react";
import { WalletCards } from "lucide-react";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white dark:bg-[#0f1015]">

      {/* Background glow */}
      <div className="absolute left-[12%] top-[18%] h-80 w-80 rounded-full bg-purple-400/15 blur-3xl" />

      <div className="absolute bottom-[12%] right-[12%] h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Logo */}
        <div className="animate-[splashLogo_1.5s_ease-out_forwards] opacity-0">

          <div className="relative">
            <div className="absolute inset-0 rounded-[30px] bg-purple-500/25 blur-2xl" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 shadow-2xl shadow-purple-500/30">
              <WalletCards
                size={48}
                strokeWidth={1.8}
                className="text-white"
              />
            </div>
          </div>

        </div>

        {/* Brand */}
        <h1 className="mt-7 animate-[splashBrand_1.5s_ease-out_0.4s_forwards] text-5xl font-extrabold tracking-[-0.04em] text-[#171a21] opacity-0 dark:text-white sm:text-6xl">
          Apna Khata
        </h1>

        {/* Tagline */}
        <p className="mt-4 animate-[splashTagline_1.4s_ease-out_1.1s_forwards] text-base font-medium tracking-wide text-slate-500 opacity-0 dark:text-slate-400 sm:text-lg">
          Your money. Your control.
        </p>

        {/* Loading bar */}
        <div className="mt-10 h-1.5 w-52 overflow-hidden rounded-full bg-slate-200 opacity-0 animate-[splashBar_1s_ease-out_1.6s_forwards] dark:bg-slate-800">

          <div className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-500 animate-[splashProgress_3s_ease-in-out_1.7s_forwards]" />

        </div>

      </div>

      {/* Bottom text */}
      <p className="absolute bottom-8 animate-[splashBottom_1s_ease-out_1.8s_forwards] text-xs font-medium uppercase tracking-[0.22em] text-slate-400 opacity-0 dark:text-slate-600">
        Manage • Track • Grow
      </p>

      {/* Animations */}
      <style>{`
        @keyframes splashLogo {
          0% {
            opacity: 0;
            transform: translateY(35px) scale(0.75);
          }

          60% {
            opacity: 1;
            transform: translateY(-4px) scale(1.03);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes splashBrand {
          0% {
            opacity: 0;
            transform: translateY(25px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes splashTagline {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes splashBar {
          0% {
            opacity: 0;
            transform: scaleX(0.5);
          }

          100% {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes splashProgress {
          0% {
            transform: scaleX(0);
          }

          100% {
            transform: scaleX(1);
          }
        }

        @keyframes splashBottom {
          0% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }
      `}</style>

    </div>
  );
}

export default SplashScreen;