"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Truck,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";

const STATUS_CONFIG = {
  placed: {
    label: "Placed",
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  preparing: {
    label: "Preparing",
    icon: ChefHat,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  delivering: {
    label: "On the way",
    icon: Truck,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success-light",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-danger",
    bg: "bg-danger-light",
  },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    api.orders
      .list()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  async function handleCancel(orderId: string) {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(orderId);
    try {
      const updated = await api.orders.cancel(orderId);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
    } catch {
      alert("Failed to cancel order");
    } finally {
      setCancelling(null);
    }
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="skeleton h-10 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text">
          Your Orders
        </h1>
        <p className="text-text-muted mt-1.5">
          Track and manage your food orders
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-text-light" />
          </div>
          <h3 className="font-heading text-xl font-bold text-text">
            No orders yet
          </h3>
          <p className="text-sm text-text-muted mt-1.5 mb-6">
            Explore restaurants and place your first order
          </p>
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Browse Restaurants
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const config = STATUS_CONFIG[order.status];
            const StatusIcon = config.icon;
            const date = new Date(order.createdAt);

            return (
              <div
                key={order._id}
                className="p-5 rounded-2xl bg-card border border-border-light hover:shadow-md transition-all duration-300 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading text-lg font-bold text-text truncate">
                        {order.restaurantName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}
                      >
                        <StatusIcon size={12} />
                        {config.label}
                      </span>
                    </div>

                    <div className="text-sm text-text-muted">
                      {date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {date.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {order.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex px-2.5 py-1 rounded-lg bg-surface text-xs font-medium text-text"
                        >
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-heading text-xl font-bold text-text">
                      ₹{order.total}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      incl. ₹{order.deliveryFee} delivery
                    </p>

                    {order.status === "placed" && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancelling === order._id}
                        className="mt-3 px-4 py-1.5 rounded-lg text-xs font-semibold text-danger bg-danger-light hover:bg-danger/20 transition-colors disabled:opacity-50"
                      >
                        {cancelling === order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
