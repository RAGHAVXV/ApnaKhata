import { useEffect } from "react";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white dark:bg-[#0f1015]">

      {/* Background atmosphere */}
      <div className="absolute left-[8%] top-[12%] h-96 w-96 animate-[floatGlow_5s_ease-in-out_infinite] rounded-full bg-purple-400/20 blur-[110px]" />

      <div className="absolute bottom-[8%] right-[8%] h-96 w-96 animate-[floatGlowReverse_6s_ease-in-out_infinite] rounded-full bg-green-400/15 blur-[110px]" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-300/10 blur-[100px]" />

      {/* Decorative particles */}
      <div className="absolute left-[27%] top-[30%] h-2 w-2 animate-[particleOne_3s_ease-in-out_infinite] rounded-full bg-purple-400/70" />

      <div className="absolute right-[29%] top-[26%] h-1.5 w-1.5 animate-[particleTwo_3.5s_ease-in-out_infinite] rounded-full bg-green-400/70" />

      <div className="absolute bottom-[29%] left-[32%] h-1.5 w-1.5 animate-[particleThree_4s_ease-in-out_infinite] rounded-full bg-violet-400/60" />

      <div className="absolute bottom-[25%] right-[32%] h-2 w-2 animate-[particleFour_3.2s_ease-in-out_infinite] rounded-full bg-purple-300/60" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Wallet Logo */}
        <div className="animate-[splashLogo_1.4s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0">
          <div className="relative">

            {/* Logo glow */}
            <div className="absolute -inset-5 animate-[logoGlow_2.5s_ease-in-out_infinite] rounded-[34px] bg-purple-500/20 blur-2xl" />

            {/* Logo ring */}
            <div className="absolute -inset-2 rounded-[34px] border border-purple-300/30 dark:border-purple-400/20" />

            {/* Wallet */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 shadow-2xl shadow-purple-500/35">

              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Wallet body */}
                <path
                  d="M12 23C12 18.5817 15.5817 15 20 15H45C48.866 15 52 18.134 52 22V44C52 47.866 48.866 51 45 51H20C15.5817 51 12 47.4183 12 43V23Z"
                  fill="white"
                />

                {/* Wallet flap */}
                <path
                  d="M12 24C12 19.5817 15.5817 16 20 16H44C48.4183 16 52 19.5817 52 24V28H20C15.5817 28 12 26.2091 12 24Z"
                  fill="#EDE9FE"
                />

                {/* Wallet flap outline */}
                <path
                  d="M12 24C12 27.3137 15.134 30 19 30H52"
                  stroke="#8D7BD8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Wallet opening */}
                <path
                  d="M37 30H50C52.7614 30 55 32.2386 55 35V40C55 42.7614 52.7614 45 50 45H37C33.6863 45 31 42.3137 31 39V36C31 32.6863 33.6863 30 37 30Z"
                  fill="#8D7BD8"
                />

                {/* Wallet clasp */}
                <circle
                  cx="39"
                  cy="37.5"
                  r="2.5"
                  fill="white"
                />

                {/* Wallet seam */}
                <path
                  d="M18 44H27"
                  stroke="#68B99A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Wallet highlight */}
                <path
                  d="M16 20C16 18.3431 17.3431 17 19 17H43"
                  stroke="white"
                  strokeOpacity="0.65"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

            </div>
          </div>
        </div>

        {/* Brand */}
        <h1 className="mt-8 animate-[splashBrand_1.2s_cubic-bezier(0.22,1,0.36,1)_0.35s_forwards] bg-gradient-to-r from-[#171a21] via-[#6d5bd0] to-[#171a21] bg-clip-text text-6xl font-black tracking-[-0.055em] text-transparent opacity-0 dark:from-white dark:via-[#a99cf2] dark:to-white sm:text-7xl">
          Apna Khata
        </h1>

        {/* Tagline */}
        <p className="mt-5 animate-[splashTagline_1s_ease-out_0.85s_forwards] text-lg font-extrabold tracking-wide text-slate-700 opacity-0 dark:text-slate-200 sm:text-xl">
          Your money. Your control.
        </p>

        {/* ONE REAL LOADING BAR */}
        <div className="mt-9 h-2 w-64 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-slate-800">

          <div className="h-full w-0 rounded-full bg-gradient-to-r from-purple-600 via-violet-500 to-green-400 shadow-[0_0_16px_rgba(141,123,216,0.55)] animate-[splashProgress_3s_linear_forwards]" />

        </div>

      </div>

      {/* Bottom text */}
      <p className="absolute bottom-8 animate-[splashBottom_1s_ease-out_1.3s_forwards] text-sm font-black uppercase tracking-[0.3em] text-slate-500 opacity-0 dark:text-slate-400 sm:text-base">
        Manage&nbsp;&nbsp;•&nbsp;&nbsp;Track&nbsp;&nbsp;•&nbsp;&nbsp;Grow
      </p>

      {/* Animations */}
      <style>{`

        @keyframes splashLogo {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.7) rotate(-4deg);
          }

          65% {
            opacity: 1;
            transform: translateY(-5px) scale(1.04) rotate(1deg);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0);
          }
        }

        @keyframes logoGlow {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.95);
          }

          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes splashBrand {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.96);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes splashTagline {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* THE ACTUAL LOADING ANIMATION */
        @keyframes splashProgress {
          0% {
            width: 0%;
          }

          100% {
            width: 100%;
          }
        }

        @keyframes splashBottom {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatGlow {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(35px, -25px);
          }
        }

        @keyframes floatGlowReverse {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-30px, 25px);
          }
        }

        @keyframes particleOne {
          0%,
          100% {
            opacity: 0.2;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(15px, -20px);
          }
        }

        @keyframes particleTwo {
          0%,
          100% {
            opacity: 0.2;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(-12px, 18px);
          }
        }

        @keyframes particleThree {
          0%,
          100% {
            opacity: 0.2;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(20px, -12px);
          }
        }

        @keyframes particleFour {
          0%,
          100% {
            opacity: 0.2;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(-15px, -18px);
          }
        }

      `}</style>

    </div>
  );
}

export default SplashScreen;