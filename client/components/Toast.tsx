"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

// Toast component to display temporary messages to the user
export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-1/2 left-1/2 -translate-y-1/2 bg-slate-800 
      text-white px-4 py-2 rounded shadow-lg opacity-0 animate-toast">
    {message}
    </div>
  );
}
