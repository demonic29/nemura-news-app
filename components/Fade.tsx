"use client";

import { ReactNode, useEffect, useState } from "react";

export default function Fade({
  children,
  duration = 500,
}: {
  children: ReactNode;
  duration?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="transition-opacity"
      style={{
        opacity: show ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}