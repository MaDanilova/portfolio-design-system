"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Divider } from "@/components/Divider";
import { Modal } from "@/components/Modal";
import { Alert } from "@/components/Alert";
import { Spinner } from "@/components/Spinner";
import { createClient } from "@/lib/supabase/client";

const focusOptions = [
  { value: "full", label: "Full Review" },
  { value: "layout", label: "Layout Only" },
  { value: "typography", label: "Typography Only" },
  { value: "hierarchy", label: "Visual Hierarchy" },
  { value: "storytelling", label: "Storytelling" },
];

interface ProfileData {
  full_name: string;
  email: string;
  initials: string;
  default_focus: string;
  typography_audit: boolean;
  storytelling: boolean;
  email_notify: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // Profile form
  const [displayName, setDisplayName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Preferences
  const [defaultFocus, setDefaultFocus] = useState("full");
  const [typographyAudit, setTypographyAudit] = useState(true);
  const [storytelling, setStorytelling] = useState(true);
  const [emailNotify, setEmailNotify] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Delete account
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Load user data on mount
  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileRow } = await supabase
        .from("profiles")
        .select(
          "full_name, default_focus, typography_audit, storytelling, email_notify"
        )
        .eq("id", user.id)
        .single();

      const fullName =
        profileRow?.full_name || user.user_metadata?.full_name || "User";
      const email = user.email || "";
      const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const data: ProfileData = {
        full_name: fullName,
        email,
        initials,
        default_focus: profileRow?.default_focus ?? "full",
        typography_audit: profileRow?.typography_audit ?? true,
        storytelling: profileRow?.storytelling ?? true,
        email_notify: profileRow?.email_notify ?? false,
      };

      setProfile(data);
      setDisplayName(data.full_name);
      setDefaultFocus(data.default_focus);
      setTypographyAudit(data.typography_audit);
      setStorytelling(data.storytelling);
      setEmailNotify(data.email_notify);
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleUpdateProfile() {
    setProfileSaving(true);
    setProfileMessage(null);

    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: displayName }),
    });

    const data = await res.json();

    if (res.ok) {
      setProfileMessage({ type: "success", text: "Profile updated" });
      router.refresh();
    } else {
      setProfileMessage({
        type: "error",
        text: data.error || "Failed to update profile",
      });
    }

    setProfileSaving(false);
  }

  async function handleChangePassword() {
    setPasswordSaving(true);
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      setPasswordSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      setPasswordSaving(false);
      return;
    }

    const res = await fetch("/api/settings/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setPasswordMessage({ type: "success", text: "Password updated" });
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMessage({
        type: "error",
        text: data.error || "Failed to update password",
      });
    }

    setPasswordSaving(false);
  }

  async function handleSavePreferences() {
    setPrefsSaving(true);
    setPrefsMessage(null);

    const res = await fetch("/api/settings/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        default_focus: defaultFocus,
        typography_audit: typographyAudit,
        storytelling,
        email_notify: emailNotify,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setPrefsMessage({ type: "success", text: "Preferences saved" });
    } else {
      setPrefsMessage({
        type: "error",
        text: data.error || "Failed to save preferences",
      });
    }

    setPrefsSaving(false);
  }

  async function handleDeleteAccount() {
    setDeleting(true);

    const res = await fetch("/api/settings/account", {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeleteConfirm("");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings" },
        ]}
        className="mb-6"
      />

      <h1 className="font-display font-bold text-3xl tracking-tight text-ink-primary mb-8">
        Settings
      </h1>

      <div className="max-w-lg space-y-8">
        {/* ── Profile ── */}
        <section>
          <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
            Profile
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <Avatar size="lg" initials={profile?.initials || "?"} />
          </div>
          <div className="space-y-4">
            <Input
              label="Display Name"
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Input
              label="Email"
              id="email"
              value={profile?.email || ""}
              disabled
              helperText="Email cannot be changed"
            />
            {profileMessage && (
              <Alert
                status={profileMessage.type}
                dismissible
                onDismiss={() => setProfileMessage(null)}
              >
                {profileMessage.text}
              </Alert>
            )}
            <Button
              variant="secondary"
              onClick={handleUpdateProfile}
              disabled={
                profileSaving ||
                displayName.trim() === "" ||
                displayName === profile?.full_name
              }
            >
              {profileSaving ? "Saving..." : "Update Profile"}
            </Button>
          </div>
        </section>

        <Divider />

        {/* ── Change Password ── */}
        <section>
          <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
            Change Password
          </h2>
          <div className="space-y-4">
            <Input
              label="New Password"
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
            />
            <Input
              label="Confirm New Password"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              error={
                confirmPassword.length > 0 && newPassword !== confirmPassword
                  ? "Passwords do not match"
                  : undefined
              }
            />
            {passwordMessage && (
              <Alert
                status={passwordMessage.type}
                dismissible
                onDismiss={() => setPasswordMessage(null)}
              >
                {passwordMessage.text}
              </Alert>
            )}
            <Button
              variant="secondary"
              onClick={handleChangePassword}
              disabled={
                passwordSaving ||
                newPassword.length < 8 ||
                newPassword !== confirmPassword
              }
            >
              {passwordSaving ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </section>

        <Divider />

        {/* ── Review Preferences ── */}
        <section>
          <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
            Review Preferences
          </h2>
          <div className="space-y-5">
            <Select
              label="Default review focus"
              options={focusOptions}
              id="default-focus"
              value={defaultFocus}
              onChange={(e) => setDefaultFocus(e.target.value)}
            />
            <Toggle
              label="Include typography audit"
              checked={typographyAudit}
              onChange={setTypographyAudit}
            />
            <Toggle
              label="Include storytelling assessment"
              checked={storytelling}
              onChange={setStorytelling}
            />
            <Toggle
              label="Receive email when review is ready"
              checked={emailNotify}
              onChange={setEmailNotify}
            />
            {prefsMessage && (
              <Alert
                status={prefsMessage.type}
                dismissible
                onDismiss={() => setPrefsMessage(null)}
              >
                {prefsMessage.text}
              </Alert>
            )}
            <Button
              variant="secondary"
              onClick={handleSavePreferences}
              disabled={prefsSaving}
            >
              {prefsSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </section>

        <Divider />

        {/* ── Danger Zone ── */}
        <section>
          <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
            Danger Zone
          </h2>
          <Card className="border-error">
            <p className="text-sm font-medium text-ink-primary mb-1">
              Delete Account
            </p>
            <p className="text-sm text-ink-secondary mb-4">
              Permanently delete your account and all review data. This action
              cannot be undone.
            </p>
            <Button
              variant="ghost"
              className="text-error hover:text-error"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete My Account
            </Button>
          </Card>
        </section>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeleteConfirm("");
          }
        }}
        size="sm"
        title="Are you sure?"
      >
        <p className="text-sm text-ink-secondary mb-4">
          This will permanently delete your account, all reviews, and all
          associated data. This action cannot be undone.
        </p>
        <Input
          label='Type "DELETE" to confirm'
          id="delete-confirm"
          placeholder="DELETE"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
        />
        <div className="flex items-center gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => {
              setDeleteModalOpen(false);
              setDeleteConfirm("");
            }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            className="bg-error hover:bg-error-dim"
            disabled={deleteConfirm !== "DELETE" || deleting}
            onClick={handleDeleteAccount}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
