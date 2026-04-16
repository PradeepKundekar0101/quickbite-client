"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ChefHat,
  Clock,
  Bike,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Restaurant } from "@/lib/types";
import { RestaurantCard } from "@/components/RestaurantCard";

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    api.restaurants
      .list()
      .then(setRestaurants)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/restaurants?q=${encodeURIComponent(search.trim())}`);
    }
  }

  const openRestaurants = restaurants.filter((r) => r.isOpen);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--background)] via-surface-warm to-surface">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in-up opacity-0">
              <Sparkles size={14} />
              Fresh from Bangalore&apos;s best kitchens
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-[1.1] tracking-tight animate-fade-in-up opacity-0 stagger-1">
              Delicious food,
              <br />
              <span className="text-primary">delivered fast</span>
            </h1>

            <p className="mt-5 text-lg text-text-muted leading-relaxed max-w-lg animate-fade-in-up opacity-0 stagger-2">
              Discover amazing restaurants near you and get your favorite meals
              delivered right to your door in minutes.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex gap-2 animate-fade-in-up opacity-0 stagger-3"
            >
              <div className="relative flex-1 max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for food or restaurants..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20"
              >
                Search
              </button>
            </form>
          </div>

          <div className="flex gap-8 mt-12 animate-fade-in-up opacity-0 stagger-4">
            {[
              { icon: ChefHat, label: "50+ Restaurants", sub: "Curated selection" },
              { icon: Clock, label: "30 min avg", sub: "Delivery time" },
              { icon: Bike, label: "Free delivery", sub: "On first order" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card border border-border-light flex items-center justify-center shadow-sm">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{label}</p>
                  <p className="text-xs text-text-muted">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text">
              Popular Right Now
            </h2>
            <p className="text-sm text-text-muted mt-1.5">
              Top-rated restaurants open for delivery
            </p>
          </div>
          <button
            onClick={() => router.push("/restaurants")}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {openRestaurants.slice(0, 6).map((r, i) => (
              <div
                key={r._id}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <RestaurantCard restaurant={r} />
              </div>
            ))}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <button
            onClick={() => router.push("/restaurants")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View all restaurants
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface/60 border-y border-border-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text">
              How it works
            </h2>
            <p className="text-sm text-text-muted mt-1.5">
              Three simple steps to deliciousness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose a Restaurant",
                desc: "Browse our curated selection of restaurants and pick your favorite.",
                accent: "from-primary/20 to-primary/5",
              },
              {
                step: "02",
                title: "Customize Your Order",
                desc: "Add dishes to your cart and customize to your taste preferences.",
                accent: "from-success/20 to-success/5",
              },
              {
                step: "03",
                title: "Enjoy Your Meal",
                desc: "Sit back, relax, and track your order until it arrives at your door.",
                accent: "from-warning/20 to-warning/5",
              },
            ].map(({ step, title, desc, accent }) => (
              <div
                key={step}
                className="relative p-6 rounded-2xl bg-card border border-border-light group hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${accent}`}
                />
                <span className="font-heading text-3xl font-bold text-border">
                  {step}
                </span>
                <h3 className="font-heading text-lg font-bold text-text mt-3">
                  {title}
                </h3>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
