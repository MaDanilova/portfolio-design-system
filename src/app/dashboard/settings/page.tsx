"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Divider } from "@/components/Divider";
import { Modal } from "@/components/Modal";

const focusOptions = [
  { value: "full", label: "Full Review" },
  { value: "layout", label: "Layout Only" },
  { value: "typography", label: "Typography Only" },
  { value: "hierarchy", label: "Visual Hierarchy" },
  { value: "storytelling", label: "Storytelling" },
];

export default function SettingsPage() {
  const [typographyAudit, setTypographyAudit] = useState(true);
  const [storytelling, setStorytelling] = useState(true);
  const [emailNotify, setEmailNotify] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

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
        {/* Profile */}
        <section>
          <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
            Profile
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <Avatar size="lg" initials="DD" />
            <button className="text-sm font-body text-mist hover:text-mist-dim transition-colors duration-fast">
              Change avatar
            </button>
          </div>
          <div className="space-y-4">
            <Input
              label="Display Name"
              id="display-name"
              defaultValue="Daria Dzisko"
            />
            <Input
              label="Email"
              id="email"
              defaultValue="daria@example.com"
              disabled
              helperText="Email cannot be changed"
            />
            <Button variant="secondary">Update Profile</Button>
          </div>
        </section>

        <Divider />

        {/* Review Preferences */}
        <section>
          <h2 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-4">
            Review Preferences
          </h2>
          <div className="space-y-5">
            <Select
              label="Default review focus"
              options={focusOptions}
              id="default-focus"
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
            <Button variant="secondary">Save Preferences</Button>
          </div>
        </section>

        <Divider />

        {/* Danger Zone */}
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
          setDeleteModalOpen(false);
          setDeleteConfirm("");
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
          >
            Cancel
          </Button>
          <Button
            className="bg-error hover:bg-error-dim"
            disabled={deleteConfirm !== "DELETE"}
          >
            Delete Account
          </Button>
        </div>
      </Modal>
    </div>
  );
}
