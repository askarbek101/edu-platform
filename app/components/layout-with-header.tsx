"use client";

import { Header } from "./header";
import { ReactNode } from "react";

interface LayoutWithHeaderProps {
  children: ReactNode;
}

export function LayoutWithHeader({ children }: LayoutWithHeaderProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
} 