"use client";

import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export function ProductCard({
  product,
  restaurantId,
  restaurantName,
}: {
  product: Product;
  restaurantId: string;
  restaurantName: string;
}) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.product._id === product._id);
  const inCart = !!cartItem;

  function handleAdd() {
    addItem(product, restaurantId, restaurantName);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group flex gap-4 p-4 rounded-2xl bg-card border border-border-light hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface flex-shrink-0">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="120px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-text leading-snug">
              {product.name}
            </h3>
            <span className="inline-flex px-2 py-0.5 rounded-md bg-surface text-xs font-medium text-text-muted flex-shrink-0">
              {product.category}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-bold text-text">
            ₹{product.price}
          </span>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              added
                ? "bg-success-light text-success"
                : inCart
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                Added
              </>
            ) : (
              <>
                <Plus size={14} />
                {inCart ? `Add More (${cartItem.quantity})` : "Add"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
