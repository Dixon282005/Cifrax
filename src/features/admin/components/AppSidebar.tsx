"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Database, 
  LogOut,
  ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "Resumen", url: "/admin", icon: LayoutDashboard },
  { title: "Usuarios", url: "/admin/users", icon: Users },
  { title: "Combinaciones", url: "/admin/combinations", icon: Database },
  { title: "Configuración", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-800">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-slate-800/50">
        <div className="flex items-center gap-2 px-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-white">
              <ShieldCheck className="size-5" />
            </div>
            <span className="group-data-[collapsible=icon]:hidden text-foreground">
              Cifrax<span className="text-cyan-500">Admin</span>
            </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isActive}
                      className={`hover:bg-slate-800/50 hover:text-cyan-400 transition-colors ${
                        isActive ? "bg-slate-800 text-cyan-500 font-medium" : "text-slate-400"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-800/50">
        <SidebarMenuButton className="text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors group-data-[collapsible=icon]:justify-center">
          <LogOut className="size-4" />
          <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}