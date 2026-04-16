import { ChefHat } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-white">
                <ChefHat size={18} />
              </div>
              <span className="font-heading text-lg font-bold text-text">
                QuickBite
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-sm">
              Your favorite restaurants, delivered fast. Fresh meals from the
              best local kitchens straight to your doorstep.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-text mb-3">Explore</h4>
            <ul className="space-y-2">
              <FooterLink href="/restaurants">Restaurants</FooterLink>
              <FooterLink href="/orders">My Orders</FooterLink>
              <FooterLink href="/profile">Profile</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-text mb-3">Account</h4>
            <ul className="space-y-2">
              <FooterLink href="/login">Sign In</FooterLink>
              <FooterLink href="/register">Create Account</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-light">
          <p className="text-xs text-text-light text-center">
            &copy; {new Date().getFullYear()} QuickBite. A demo application.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-text-muted hover:text-primary transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
