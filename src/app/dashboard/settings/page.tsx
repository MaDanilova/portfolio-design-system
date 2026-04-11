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
import { settingsFocusOptions } from "@/lib/constants";
import type { FormMessage } from "@/lib/types";

interface ProfileData {
  full_name: string;
  email: string;
  initials: string;
  default_focus: string;
  typography_audit: boolean;
  storytelling: boolean;
  email_notify: boolean;
}

interface SubmitSectionRequest {
  url: string;
  method: string;
  body: Record<string, unknown> | null;
  successText: string;
  failText: string;
}

interface SubmitSectionState {
  setSaving: (v: boolean) => void;
  setMessage: (v: FormMessage) => void;
}

async function submitSection(
  request: SubmitSectionRequest,
  state: SubmitSectionState,
): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  state.setSaving(true);
  state.setMessage(null);

  const res = await fetch(request.url, {
    method: request.method,
    ...(request.body
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request.body),
        }
      : {}),
  });

  const data = await res.json().catch(() => ({}));

  if (res.ok) {
    state.setMessage({ type: "success", text: request.successText });
  } else {
    state.setMessage({
      type: "error",
      text: (data as { error?: string }).error || request.failText,
    });
  }

  state.setSaving(false);
  return { ok: res.ok, data: data as Record<string, unknown> };
}

function ProfileSection({
  profile,
  onSaved,
}: {
  profile: ProfileData;
  onSaved: () => void;
}) {
  const [displayName, setDisplayName] = useState(profile.full_name);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<FormMessage>(null);

  async function handleSave() {
    const { ok } = await submitSection(
      {
        url: "/api/settings/profile",
        method: "PATCH",
        body: { full_name: displayName },
        successText: "Profile updated",
        failText: "Failed to update profile",
      },
      { setSaving, setMessage },
    );
    if (ok) onSaved();
  }

  return (
    <section>
      <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
        Profile
      </h2>
      <div className="flex items-center gap-4 mb-6">
        <Avatar size="lg" initials={profile.initials} />
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
          value={profile.email}
          disabled
          helperText="Email cannot be changed"
        />
        {message && (
          <Alert
            status={message.type}
            dismissible
            onDismiss={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}
        <Button
          variant="secondary"
          onClick={handleSave}
          disabled={
            saving ||
            displayName.trim() === "" ||
            displayName === profile.full_name
          }
        >
          {saving ? "Saving..." : "Update Profile"}
        </Button>
      </div>
    </section>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<FormMessage>(null);

  async function handleSave() {
    if (!currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    const { ok } = await submitSection(
      {
        url: "/api/settings/password",
        method: "PATCH",
        body: { current_password: currentPassword, password: newPassword },
        successText: "Password updated",
        failText: "Failed to update password",
      },
      { setSaving, setMessage },
    );
    if (ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <section>
      <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
        Change Password
      </h2>
      <div className="space-y-4">
        <Input
          label="Current Password"
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter your current password"
          autoComplete="current-password"
        />
        <Input
          label="New Password"
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Min 8 chars, uppercase, lowercase, number"
          autoComplete="new-password"
        />
        <Input
          label="Confirm New Password"
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          autoComplete="new-password"
          error={
            confirmPassword.length > 0 && newPassword !== confirmPassword
              ? "Passwords do not match"
              : undefined
          }
        />
        {message && (
          <Alert
            status={message.type}
            dismissible
            onDismiss={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}
        <Button
          variant="secondary"
          onClick={handleSave}
          disabled={
            saving ||
            !currentPassword ||
            newPassword.length < 8 ||
            newPassword !== confirmPassword
          }
        >
          {saving ? "Updating..." : "Change Password"}
        </Button>
      </div>
    </section>
  );
}

function PreferencesSection({ profile }: { profile: ProfileData }) {
  const [defaultFocus, setDefaultFocus] = useState(profile.default_focus);
  const [typographyAudit, setTypographyAudit] = useState(profile.typography_audit);
  const [storytelling, setStorytelling] = useState(profile.storytelling);
  const [emailNotify, setEmailNotify] = useState(profile.email_notify);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<FormMessage>(null);

  async function handleSave() {
    await submitSection(
      {
        url: "/api/settings/preferences",
        method: "PATCH",
        body: {
          default_focus: defaultFocus,
          typography_audit: typographyAudit,
          storytelling,
          email_notify: emailNotify,
        },
        successText: "Preferences saved",
        failText: "Failed to save preferences",
      },
      { setSaving, setMessage },
    );
  }

  return (
    <section>
      <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
        Review Preferences
      </h2>
      <div className="space-y-5">
        <Select
          label="Default review focus"
          options={settingsFocusOptions}
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
        {message && (
          <Alert
            status={message.type}
            dismissible
            onDismiss={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}
        <Button
          variant="secondary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </section>
  );
}

function DangerZoneSection() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!deletePassword) {
      setError("Password is required");
      return;
    }
    setDeleting(true);
    setError(null);

    const res = await fetch("/api/settings/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: deletePassword }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError((data as { error?: string }).error || "Failed to delete account");
      setDeleting(false);
    }
  }

  return (
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
          onClick={() => setModalOpen(true)}
        >
          Delete My Account
        </Button>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => {
          if (!deleting) {
            setModalOpen(false);
            setConfirmText("");
            setDeletePassword("");
          }
        }}
        size="sm"
        title="Are you sure?"
      >
        <p className="text-sm text-ink-secondary mb-4">
          This will permanently delete your account, all reviews, and all
          associated data. This action cannot be undone.
        </p>
        {error && (
          <Alert status="error" className="mb-4" dismissible onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}
        <div className="space-y-4">
          <Input
            label='Type "DELETE" to confirm'
            id="delete-confirm"
            placeholder="DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
          <Input
            label="Enter your password"
            id="delete-password"
            type="password"
            placeholder="Your current password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => {
              setModalOpen(false);
              setConfirmText("");
              setDeletePassword("");
            }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            className="bg-error hover:bg-error-dim"
            disabled={confirmText !== "DELETE" || !deletePassword || deleting}
            onClick={handleDelete}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </Modal>
    </section>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

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

      setProfile({
        full_name: fullName,
        email,
        initials,
        default_focus: profileRow?.default_focus ?? "full",
        typography_audit: profileRow?.typography_audit ?? true,
        storytelling: profileRow?.storytelling ?? true,
        email_notify: profileRow?.email_notify ?? false,
      });
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10 flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
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
        {profile && (
          <>
            <ProfileSection profile={profile} onSaved={() => router.refresh()} />
            <Divider />
            <PasswordSection />
            <Divider />
            <PreferencesSection profile={profile} />
            <Divider />
          </>
        )}
        <DangerZoneSection />
      </div>
    </div>
  );
}
