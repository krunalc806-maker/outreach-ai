import { ReactNode } from "react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface DashboardRootLayoutProps {
  children: ReactNode;
}

export default function DashboardRootLayout({
  children,
}: DashboardRootLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}