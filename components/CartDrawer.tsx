"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export function CartDrawer() {
  const {
    items,
    restaurantId,
    restaurantName,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isOpen,
    setIsOpen,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [ordering, setOrdering] = useState(false);
  const [address, setAddress] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setShowCheckout(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const deliveryFee = 30;
  const grandTotal = total + deliveryFee;

  async function handleOrder() {
    if (!user) {
      setIsOpen(false);
      router.push("/login");
      return;
    }
    if (!address.trim()) return;

    setOrdering(true);
    try {
      await api.orders.create({
        restaurantId: restaurantId!,
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
        deliveryAddress: address,
      });
      clearCart();
      setIsOpen(false);
      router.push("/orders");
    } catch {
      alert("Failed to place order. Please try again.");
    } finally {
      setOrdering(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[var(--background)] shadow-2xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-heading text-xl font-bold text-text">
              Your Cart
            </h2>
            {restaurantName && (
              <p className="text-sm text-text-muted mt-0.5">
                from {restaurantName}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl hover:bg-surface text-text-muted hover:text-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center">
              <ShoppingBag size={32} className="text-text-light" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-text">
                Cart is empty
              </p>
              <p className="text-sm text-text-muted mt-1">
                Add items from a restaurant to get started
              </p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/restaurants");
              }}
              className="mt-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border-light"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-text truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-primary font-medium mt-0.5">
                      ₹{item.product.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-surface hover:bg-border-light text-text transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold text-text">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-surface hover:bg-border-light text-text transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right min-w-[60px]">
                    <p className="text-sm font-semibold text-text">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="p-1.5 rounded-lg text-text-light hover:text-danger hover:bg-danger-light transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-4 space-y-4">
              {showCheckout ? (
                <div className="space-y-3 animate-fade-in">
                  <label className="block">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Delivery Address
                    </span>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full delivery address..."
                      rows={2}
                      className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                  </label>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-text-muted">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-text pt-1.5 border-t border-border-light">
                      <span>Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleOrder}
                    disabled={ordering || !address.trim()}
                    className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {ordering ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Place Order — ₹{grandTotal}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">
                      {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </span>
                    <span className="font-heading text-lg font-bold text-text">
                      ₹{total}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
