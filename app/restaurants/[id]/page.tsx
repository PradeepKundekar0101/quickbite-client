"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, MapPin, ArrowLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import type { Restaurant } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export default function RestaurantDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    api.restaurants
      .get(id)
      .then(setRestaurant)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="skeleton h-64 rounded-2xl mb-6" />
        <div className="skeleton h-8 w-64 mb-3" />
        <div className="skeleton h-5 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-5xl mb-4">🍽️</p>
        <h2 className="font-heading text-2xl font-bold text-text">
          Restaurant not found
        </h2>
        <p className="text-text-muted mt-2">
          This restaurant may have been removed or the link is incorrect.
        </p>
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const products = restaurant.menuProducts || [];
  const categories = [...new Set(products.map((p) => p.category))];
  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-56 sm:h-72 lg:h-80 bg-surface overflow-hidden">
        {restaurant.imageUrl ? (
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <nav className="flex items-center gap-1.5 text-white/70 text-sm mb-3">
              <Link href="/restaurants" className="hover:text-white transition-colors">
                Restaurants
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{restaurant.name}</span>
            </nav>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              {restaurant.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 text-white/90 text-sm">
                <Star size={14} className="text-warning fill-warning" />
                <span className="font-semibold">{restaurant.rating}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/70 text-sm">
                <Clock size={14} />
                {restaurant.deliveryTime}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/70 text-sm">
                <MapPin size={14} />
                {restaurant.address}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                {restaurant.cuisine}
              </span>
              {!restaurant.isOpen && (
                <span className="px-2.5 py-0.5 rounded-full bg-danger/80 text-white text-xs font-semibold">
                  Closed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {categories.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-colors ${
                !activeCategory
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card text-text-muted border-border hover:border-primary/20"
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-card text-text-muted border-border hover:border-primary/20"
                }`}
              >
                {cat} ({products.filter((p) => p.category === cat).length})
              </button>
            ))}
          </div>
        )}

        <h2 className="font-heading text-xl font-bold text-text mb-6">
          {activeCategory || "Full Menu"}
          <span className="text-text-muted font-normal text-base ml-2">
            ({filteredProducts.length} items)
          </span>
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🍽️</p>
            <p className="text-text-muted">No items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredProducts.map((product, i) => (
              <div
                key={product._id}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <ProductCard
                  product={product}
                  restaurantId={restaurant._id}
                  restaurantName={restaurant.name}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
