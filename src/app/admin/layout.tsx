"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/admin/components/AppSidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('cifrax_role');
    const user = localStorage.getItem('cifrax_user');

    if (!user) {
      router.push('/login');
    } else if (role !== 'admin') {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="bg-background overflow-hidden flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800/50 bg-background/50 px-4 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="-ml-1 text-slate-400 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-700" />
            <h1 className="text-sm font-medium text-slate-200">
              Panel de Administración
            </h1>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}