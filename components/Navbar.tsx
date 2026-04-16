"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  ChefHat,
  ClipboardList,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-xl border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white transition-transform group-hover:scale-105">
              <ChefHat size={20} />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-text">
              QuickBite
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/restaurants" icon={<UtensilsCrossed size={16} />}>
              Restaurants
            </NavLink>
            {user && (
              <NavLink href="/orders" icon={<ClipboardList size={16} />}>
                Orders
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-text hover:bg-surface transition-colors"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-text hover:bg-surface transition-colors"
                >
                  <User size={18} />
                  <span className="max-w-24 truncate">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-text-muted hover:bg-surface hover:text-danger transition-colors"
                  title="Log out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-text hover:bg-surface transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1 pt-2 border-t border-border-light">
              <MobileLink href="/restaurants" onClick={() => setMobileOpen(false)}>
                Restaurants
              </MobileLink>
              {user && (
                <>
                  <MobileLink href="/orders" onClick={() => setMobileOpen(false)}>
                    My Orders
                  </MobileLink>
                  <MobileLink href="/profile" onClick={() => setMobileOpen(false)}>
                    Profile
                  </MobileLink>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger-light transition-colors"
                  >
                    Log Out
                  </button>
                </>
              )}
              {!user && (
                <MobileLink href="/login" onClick={() => setMobileOpen(false)}>
                  Sign In
                </MobileLink>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-text-muted hover:text-text hover:bg-surface transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-2.5 rounded-lg text-sm font-medium text-text hover:bg-surface transition-colors"
    >
      {children}
    </Link>
  );
}
