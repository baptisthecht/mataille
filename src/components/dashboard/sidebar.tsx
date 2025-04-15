// src/components/dashboard/sidebar.tsx
"use client";

import {
    PantsIcon,
    SettingsIcon,
    ShareIcon,
    ShirtIcon,
    ShoesIcon,
    UserIcon,
} from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
          )}
        >
          <span className="mr-2">{item.icon}</span>
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const sidebarItems = [
    {
      title: "Mon profil",
      href: "/profile",
      icon: <UserIcon className="h-4 w-4" />,
    },
    {
      title: "Mes vêtements",
      href: "/profile/clothes",
      icon: <ShirtIcon className="h-4 w-4" />,
    },
    {
      title: "Mes chaussures",
      href: "/profile/shoes",
      icon: <ShoesIcon className="h-4 w-4" />,
    },
    {
      title: "Mes pantalons",
      href: "/profile/pants",
      icon: <PantsIcon className="h-4 w-4" />,
    },
    {
      title: "Partager",
      href: "/profile/share",
      icon: <ShareIcon className="h-4 w-4" />,
    },
    {
      title: "Paramètres",
      href: "/settings",
      icon: <SettingsIcon className="h-4 w-4" />,
    },
  ];

  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <div className="relative overflow-hidden py-6 pr-6">
        <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">
          Mon espace
        </h2>
        <SidebarNav items={sidebarItems} />
      </div>
    </aside>
  );
}