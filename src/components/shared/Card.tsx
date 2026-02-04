import React from "react";
import { clsx } from "clsx";

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={clsx("glass-card rounded-3xl p-6", className)}>{children}</div>
);
