import Link from "next/link";
import Image from "next/image";
import { Star, Clock, MapPin } from "lucide-react";
import type { Restaurant } from "@/lib/types";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const isOpen = restaurant.isOpen;

  return (
    <Link
      href={`/restaurants/${restaurant._id}`}
      className="group block rounded-2xl bg-card border border-border-light overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {restaurant.imageUrl ? (
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {!isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-white/90 text-sm font-semibold text-text">
              Currently Closed
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-text shadow-sm">
            {restaurant.cuisine}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading text-lg font-bold text-text group-hover:text-primary transition-colors">
          {restaurant.name}
        </h3>

        <div className="flex items-center gap-3 mt-2 text-sm text-text-muted">
          <span className="inline-flex items-center gap-1">
            <Star size={14} className="text-warning fill-warning" />
            <span className="font-semibold text-text">{restaurant.rating}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} />
            {restaurant.deliveryTime}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-xs text-text-light">
          <MapPin size={12} />
          <span className="truncate">{restaurant.address}</span>
        </div>
      </div>
    </Link>
  );
}
