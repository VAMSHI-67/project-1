import React from "react";
import { clsx } from "clsx";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx("animate-pulse rounded-full bg-forest-100", className)} />
);
