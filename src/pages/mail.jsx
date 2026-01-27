import React, { useState, useEffect } from "react";
import { Mail, Copy, Check, ExternalLink, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/HeaderBackground";

const MailPage = () => {
  const { theme } = useTheme();
  const [isClicked, setIsClicked] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = "priyanshu123sah@gmail.com";

  const handleEmailClick = () => {
    setIsClicked(true);
    window.location.href = `mailto:${email}`;
  };

  const copyToClipboard = () => {
    // Standard clipboard fallback as per environment instructions
    const el = document.createElement("textarea");
    el.value = email;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-section mt-32">
      <div className="flex items-center justify-center">
        {/* Theme-aware Overlay */}

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`relative z-20 w-full max-w-lg mx-4 p-8 md:p-12 rounded-3xl border shadow-2xl transition-all duration-500 backdrop-blur-sm
          ${theme === "dark" ? "bg-black/60 border-white/10 " : "bg-white/70 border-black/5"}`}
        >
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Animated Icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-5 rounded-2xl ${theme === "dark" ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}
            >
              <Mail size={48} strokeWidth={1.5} />
            </motion.div>

            <div className="space-y-3">
              <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${theme === "dark" ? "text-white" : ""}`}>
                Get in Touch
              </h1>
              <p
                className={`text-lg opacity-70 ${theme === "dark" ? "text-white/70" : ""}`}
              >
                Have a project in mind or just want to say hi?
              </p>
            </div>

            {/* Primary Action Button */}
            <motion.button
              onClick={handleEmailClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative flex items-center justify-center space-x-3 px-10 py-4 rounded-full font-medium text-lg transition-all duration-300
              ${theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}`}
            >
              <span>Email Me</span>
              <motion.div
                animate={isClicked ? { x: [0, 5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </motion.button>

            {/* Fallback Message & Email ID */}
            <AnimatePresence>
              {isClicked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full pt-4"
                >
                  <div
                    className={`p-6 rounded-2xl space-y-4 border transition-colors
                  ${theme === "dark" ? "bg-white/5 border-white/10 text-white/80" : "bg-black/5 border-black/5"}`}
                  >
                    <p className="text-sm opacity-60">
                      If your email app didn't open, feel free to copy my
                      address manually:
                    </p>

                    <div
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all
                    ${theme === "dark" ? "bg-black/40 border-white/20" : "bg-white border-black/10"}`}
                    >
                      <code className="text-sm font-mono truncate mr-2">
                        {email}
                      </code>

                      <button
                        onClick={copyToClipboard}
                        className={`p-2 rounded-lg transition-all active:scale-90
                        ${theme === "dark" ? "hover:bg-white/10 text-white" : "hover:bg-black/5"}`}
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <Check size={18} className="text-green-500" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>

                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <span className={`${theme === "dark" ? "text-white/70" : ""}`} >Open in Gmail</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer Branding */}
        <div className="absolute bottom-8 z-20 text-[10px] uppercase tracking-[0.3em] opacity-30 select-none">
          Secure Communication • Encrypted • 2024
        </div>
      </div>
    </div>
  );
};

export default MailPage;
