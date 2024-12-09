import React, { useEffect, useState } from "react";

interface ErrorAlertBannerProps {
  error: string | null;
  duration?: number; // Optional duration in milliseconds
}

const ErrorAlertBanner: React.FC<ErrorAlertBannerProps> = ({ error, duration = 2000 }) => {
  const [visible, setVisible] = useState(!!error);

  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      // Cleanup the timer
      return () => clearTimeout(timer);
    }
  }, [error, duration]);

  if (!visible) return null; // Don't render the banner if not visible

  return (
    <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
      <strong>Error:</strong> {error}
    </div>
  );
};

export default ErrorAlertBanner;
