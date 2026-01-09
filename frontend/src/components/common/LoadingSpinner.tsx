"use client";

import { Spinner } from "react-bootstrap";

interface LoadingSpinnerProps {
  size?: "sm";
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  size = "sm",
  text,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const content = (
    <div
      className={`d-flex flex-column align-items-center justify-content-center ${
        fullScreen ? "min-vh-100" : "py-5"
      }`}
    >
      <Spinner animation="border" variant="primary" size={size} />
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  );

  return content;
};
