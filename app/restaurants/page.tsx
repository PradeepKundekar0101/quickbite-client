"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { api } from "@/lib/api";
import type { Restaurant } from "@/lib/types";
import { RestaurantCard } from "@/components/RestaurantCard";

function RestaurantsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialQuery);
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  useEffect(() => {
    api.restaurants
      .list()
      .then(setRestaurants)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cuisines = [...new Set(restaurants.map((r) => r.cuisine))];

  const filtered = restaurants.filter((r) => {
    if (showOpenOnly && !r.isOpen) return false;
    if (cuisineFilter && r.cuisine !== cuisineFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text">
          Restaurants
        </h1>
        <p className="text-text-muted mt-1.5">
          {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowOpenOnly(!showOpenOnly)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              showOpenOnly
                ? "bg-success-light text-success border-success/20"
                : "bg-card text-text-muted border-border hover:border-success/30"
            }`}
          >
            <SlidersHorizontal size={14} className="inline mr-1.5" />
            Open Now
          </button>

          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() =>
                setCuisineFilter(cuisineFilter === c ? null : c)
              }
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                cuisineFilter === c
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card text-text-muted border-border hover:border-primary/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="skeleton h-48" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="font-heading text-xl font-bold text-text">
            No restaurants found
          </h3>
          <p className="text-sm text-text-muted mt-1.5">
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => (
            <div
              key={r._id}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <RestaurantCard restaurant={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="skeleton h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <RestaurantsContent />
    </Suspense>
  );
}
