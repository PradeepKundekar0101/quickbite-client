"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface Address {
  label: string;
  street: string;
  city: string;
  zipCode: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Address>({
    label: "",
    street: "",
    city: "",
    zipCode: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    api.users
      .me()
      .then((data) => {
        setProfile({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          addresses: data.addresses || [],
        });
        setEditName(data.name);
        setEditPhone(data.phone || "");
        setAddresses(data.addresses || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await api.users.update({
        name: editName,
        phone: editPhone,
        addresses,
      });
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  }

  function addAddress() {
    if (!newAddr.label || !newAddr.street || !newAddr.city || !newAddr.zipCode)
      return;
    setAddresses((prev) => [...prev, { ...newAddr }]);
    setNewAddr({ label: "", street: "", city: "", zipCode: "" });
    setShowAddAddress(false);
  }

  function removeAddress(idx: number) {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
  }

  if (authLoading || (!user && !authLoading) || loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="skeleton h-10 w-48 mb-8" />
        <div className="space-y-4">
          <div className="skeleton h-16 rounded-2xl" />
          <div className="skeleton h-16 rounded-2xl" />
          <div className="skeleton h-16 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text">
            Profile
          </h1>
          <p className="text-text-muted mt-1.5">
            Manage your account settings
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-danger bg-danger-light hover:bg-danger/20 transition-colors"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in ${
            message.type === "success"
              ? "bg-success-light text-success"
              : "bg-danger-light text-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic info */}
        <div className="p-6 rounded-2xl bg-card border border-border-light">
          <h2 className="font-heading text-lg font-bold text-text mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                <User size={12} />
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                <Mail size={12} />
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-surface/50 border border-border-light text-sm text-text-muted cursor-not-allowed"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                <Phone size={12} />
                Phone
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="p-6 rounded-2xl bg-card border border-border-light">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-text">
              Delivery Addresses
            </h2>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <Plus size={14} />
              Add New
            </button>
          </div>

          {addresses.length === 0 && !showAddAddress && (
            <p className="text-sm text-text-muted py-4 text-center">
              No saved addresses yet
            </p>
          )}

          <div className="space-y-3">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border-light"
              >
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text">
                    {addr.label}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {addr.street}, {addr.city} - {addr.zipCode}
                  </p>
                </div>
                <button
                  onClick={() => removeAddress(idx)}
                  className="p-1.5 rounded-lg text-text-light hover:text-danger hover:bg-danger-light transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {showAddAddress && (
              <div className="p-4 rounded-xl bg-surface border border-primary/20 space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Label (e.g. Home)"
                    value={newAddr.label}
                    onChange={(e) =>
                      setNewAddr((p) => ({ ...p, label: e.target.value }))
                    }
                    className="px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <input
                    placeholder="Zip Code"
                    value={newAddr.zipCode}
                    onChange={(e) =>
                      setNewAddr((p) => ({ ...p, zipCode: e.target.value }))
                    }
                    className="px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <input
                  placeholder="Street address"
                  value={newAddr.street}
                  onChange={(e) =>
                    setNewAddr((p) => ({ ...p, street: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <input
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) =>
                    setNewAddr((p) => ({ ...p, city: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg bg-card border border-border text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowAddAddress(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-text-muted hover:bg-card transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addAddress}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
