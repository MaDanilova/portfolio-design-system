"use client";

import { useState } from "react";
import { Tabs } from "@/components/Tabs";
import { Badge } from "@/components/Badge";
import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  BarChart3,
  Layers,
  Lightbulb,
  Compass,
  GraduationCap,
  Globe,
  Lock,
  Zap,
  Database,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Shield,
  Layout,
  Settings,
  PlusCircle,
  List,
  Eye,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── OOUX Object Nodes ─── */

interface ObjectAttr {
  name: string;
  type: string;
}

interface OOUXObject {
  name: string;
  icon: LucideIcon;
  color: "acid" | "mist" | "warning" | "default";
  attributes: ObjectAttr[];
  actions?: string[];
}

const objects: OOUXObject[] = [
  {
    name: "User",
    icon: User,
    color: "mist",
    attributes: [
      { name: "id", type: "uuid" },
      { name: "email", type: "string" },
      { name: "full_name", type: "string" },
      { name: "avatar_url", type: "string?" },
    ],
    actions: ["Sign up", "Sign in", "Sign out", "Update profile", "Delete account"],
  },
  {
    name: "Review",
    icon: FileText,
    color: "acid",
    attributes: [
      { name: "id", type: "string" },
      { name: "name", type: "string" },
      { name: "date", type: "string" },
      { name: "overall", type: "number" },
      { name: "focus", type: "string" },
      { name: "pageType", type: "string" },
      { name: "summary", type: "string" },
      { name: "competitivePosition", type: "string" },
      { name: "strengths", type: "string[]" },
      { name: "improvements", type: "string[]" },
      { name: "criticalGaps", type: "string[]" },
    ],
    actions: ["Create", "View", "Search", "Filter", "Sort", "Delete"],
  },
  {
    name: "Scores",
    icon: BarChart3,
    color: "acid",
    attributes: [
      { name: "positioning", type: "0–10" },
      { name: "caseStudy", type: "0–10" },
      { name: "visualDesign", type: "0–10" },
      { name: "strategicDepth", type: "0–10" },
      { name: "aiTools", type: "0–10" },
      { name: "personality", type: "0–10" },
      { name: "infoArchitecture", type: "0–10" },
      { name: "copywriting", type: "0–10" },
      { name: "accessibility", type: "0–10" },
    ],
  },
  {
    name: "Page",
    icon: Layers,
    color: "acid",
    attributes: [
      { name: "id", type: "string" },
      { name: "name", type: "string" },
      { name: "score", type: "0–10" },
      { name: "feedback[]", type: "FeedbackItem" },
    ],
  },
  {
    name: "Recommendation",
    icon: Lightbulb,
    color: "acid",
    attributes: [
      { name: "priority", type: "number" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "category", type: "string" },
    ],
  },
  {
    name: "PositioningRewrite",
    icon: Compass,
    color: "default",
    attributes: [
      { name: "safe", type: "string" },
      { name: "bold", type: "string" },
    ],
  },
  {
    name: "LevelAssessment",
    icon: GraduationCap,
    color: "default",
    attributes: [
      { name: "apparent", type: "string" },
      { name: "matches", type: "string" },
      { name: "advice", type: "string" },
    ],
  },
];

interface Relationship {
  from: string;
  to: string;
  label: string;
  type: "1:N" | "1:1" | "1:1?";
}

const relationships: Relationship[] = [
  { from: "User", to: "Review", label: "has many", type: "1:N" },
  { from: "Review", to: "Scores", label: "has one", type: "1:1" },
  { from: "Review", to: "Page", label: "has many", type: "1:N" },
  { from: "Review", to: "Recommendation", label: "has many", type: "1:N" },
  { from: "Review", to: "PositioningRewrite", label: "has one?", type: "1:1?" },
  { from: "Review", to: "LevelAssessment", label: "has one?", type: "1:1?" },
];

function ObjectNode({ obj }: { obj: OOUXObject }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = obj.icon;
  const colorMap = {
    acid: "border-acid/40 hover:border-acid",
    mist: "border-mist/40 hover:border-mist",
    warning: "border-warning/40 hover:border-warning",
    default: "border-border hover:border-border-strong",
  };
  const textColor = {
    acid: "text-acid",
    mist: "text-mist",
    warning: "text-warning",
    default: "text-ink-secondary",
  };

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "bg-surface-raised border rounded-xl p-4 text-left transition-all duration-200 w-full",
        colorMap[obj.color]
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={cn("w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center", textColor[obj.color])}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className={cn("font-display font-semibold text-base tracking-tight", textColor[obj.color])}>
          {obj.name}
        </h3>
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-ink-muted ml-auto" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-ink-muted ml-auto" />
        )}
      </div>

      {expanded && (
        <div className="mt-3 space-y-2">
          <div className="space-y-1">
            {obj.attributes.map((attr) => (
              <div key={attr.name} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-ink-secondary">{attr.name}</span>
                <span className="text-ink-muted">{attr.type}</span>
              </div>
            ))}
          </div>
          {obj.actions && (
            <div className="pt-2 border-t border-border flex flex-wrap gap-1">
              {obj.actions.map((a) => (
                <span key={a} className="text-[10px] font-body text-ink-muted bg-surface-subtle px-1.5 py-0.5 rounded">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </button>
  );
}

function RelationshipRow({ rel }: { rel: Relationship }) {
  return (
    <div className="flex items-center gap-2 text-xs font-body">
      <span className="text-ink-primary font-medium">{rel.from}</span>
      <ArrowRight className="w-3 h-3 text-ink-muted" />
      <Badge variant={rel.type === "1:N" ? "acid" : rel.type === "1:1" ? "mist" : "default"}>
        {rel.label}
      </Badge>
      <ArrowRight className="w-3 h-3 text-ink-muted" />
      <span className="text-ink-primary font-medium">{rel.to}</span>
      <span className="text-ink-muted ml-auto">{rel.type}</span>
    </div>
  );
}

function OOUXTab() {
  return (
    <div className="space-y-10">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-acid" />
          <span className="text-xs text-ink-muted font-body">Core objects</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-mist" />
          <span className="text-xs text-ink-muted font-body">Auth objects</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-surface-subtle border border-border" />
          <span className="text-xs text-ink-muted font-body">Optional</span>
        </div>
      </div>

      {/* Object grid */}
      <div>
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
          OBJECTS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {objects.map((obj) => (
            <ObjectNode key={obj.name} obj={obj} />
          ))}
        </div>
      </div>

      {/* Relationships */}
      <div>
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
          RELATIONSHIPS
        </p>
        <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-3">
          {relationships.map((rel) => (
            <RelationshipRow key={`${rel.from}-${rel.to}`} rel={rel} />
          ))}
        </div>
      </div>

      {/* Storage */}
      <div>
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
          STORAGE
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-surface-raised border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-mist" />
              <span className="font-body font-medium text-sm text-ink-primary">Supabase</span>
            </div>
            <p className="text-xs text-ink-muted font-body">auth.users + profiles table</p>
            <p className="text-xs text-ink-muted font-body">Cookie-based sessions (SSR)</p>
          </div>
          <div className="bg-surface-raised border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-mist" />
              <span className="font-body font-medium text-sm text-ink-primary">Supabase Reviews</span>
            </div>
            <p className="text-xs text-ink-muted font-body">Reviews stored in reviews table (per user)</p>
            <p className="text-xs text-ink-muted font-body">Full review JSON in feedback column</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── IA Tab ─── */

interface RouteNode {
  path: string;
  label: string;
  icon: LucideIcon;
  auth: "public" | "protected" | "api";
  children?: RouteNode[];
}

const siteMap: RouteNode[] = [
  {
    path: "/",
    label: "Landing Page",
    icon: Globe,
    auth: "public",
  },
  {
    path: "/login",
    label: "Sign In",
    icon: Lock,
    auth: "public",
  },
  {
    path: "/register",
    label: "Sign Up",
    icon: Lock,
    auth: "public",
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Layout,
    auth: "protected",
    children: [
      { path: "/dashboard/new", label: "New Review", icon: PlusCircle, auth: "protected" },
      {
        path: "/dashboard/reviews",
        label: "All Reviews",
        icon: List,
        auth: "protected",
        children: [
          { path: "/dashboard/reviews/:id", label: "Review Detail", icon: Eye, auth: "protected" },
        ],
      },
      { path: "/dashboard/settings", label: "Settings", icon: Settings, auth: "protected" },
    ],
  },
  {
    path: "/design-system",
    label: "Design System",
    icon: Palette,
    auth: "public",
    children: [
      { path: "/design-system/components/*", label: "25 Component Pages", icon: Layers, auth: "public" },
      { path: "/design-system/architecture", label: "Architecture (this page)", icon: Compass, auth: "public" },
    ],
  },
  {
    path: "/api/review",
    label: "POST /api/review",
    icon: Zap,
    auth: "api",
  },
];

function RouteTreeNode({ node, depth = 0 }: { node: RouteNode; depth?: number }) {
  const Icon = node.icon;
  const authColor = {
    public: "success",
    protected: "mist",
    api: "warning",
  } as const;
  const authLabel = {
    public: "Public",
    protected: "Auth",
    api: "API",
  };

  return (
    <div>
      <div
        className="flex items-center gap-2.5 py-2 group"
        style={{ paddingLeft: depth * 24 }}
      >
        {depth > 0 && (
          <div className="w-4 h-px bg-border" />
        )}
        <Icon className="w-4 h-4 text-ink-muted shrink-0" />
        <span className="text-sm font-body text-ink-primary">{node.label}</span>
        <span className="text-xs font-mono text-ink-muted">{node.path}</span>
        <Badge variant={authColor[node.auth]} className="ml-auto">
          {authLabel[node.auth]}
        </Badge>
      </div>
      {node.children?.map((child) => (
        <RouteTreeNode key={child.path} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

interface FlowStep {
  label: string;
  icon: LucideIcon;
  color: "acid" | "mist" | "warning" | "default";
  sub?: string;
}

const dataFlow: FlowStep[] = [
  { label: "Upload", icon: PlusCircle, color: "acid", sub: "File or URL" },
  { label: "API Route", icon: Zap, color: "warning", sub: "/api/review" },
  { label: "GPT-4o", icon: Zap, color: "warning", sub: "Vision analysis" },
  { label: "Validate", icon: Shield, color: "default", sub: "Portfolio gate" },
  { label: "Save", icon: Database, color: "default", sub: "Supabase" },
  { label: "Display", icon: Eye, color: "acid", sub: "/reviews/:id" },
];

function DataFlowDiagram() {
  const colorMap = {
    acid: "border-acid/40 text-acid",
    mist: "border-mist/40 text-mist",
    warning: "border-warning/40 text-warning",
    default: "border-border text-ink-secondary",
  };

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {dataFlow.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.label} className="flex items-center shrink-0">
            <div className={cn("bg-surface-raised border rounded-xl p-3 text-center min-w-[100px]", colorMap[step.color])}>
              <Icon className="w-5 h-5 mx-auto mb-1.5" />
              <p className="text-xs font-body font-medium text-ink-primary">{step.label}</p>
              {step.sub && <p className="text-[10px] text-ink-muted font-body mt-0.5">{step.sub}</p>}
            </div>
            {i < dataFlow.length - 1 && (
              <ArrowRight className="w-4 h-4 text-ink-muted mx-1 shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function AuthGateDiagram() {
  return (
    <div className="bg-surface-raised border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="w-4 h-4 text-mist" />
        <span className="font-body font-medium text-sm text-ink-primary">Middleware Auth Gate</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Badge variant="mist">Protected</Badge>
          <div className="text-xs font-body text-ink-secondary space-y-1">
            <p><span className="text-ink-primary font-mono">/dashboard/*</span></p>
            <p>No session → redirect to <span className="font-mono text-mist">/login</span></p>
            <p>Has session → allow through</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-start gap-3">
          <Badge variant="success">Public</Badge>
          <div className="text-xs font-body text-ink-secondary space-y-1">
            <p><span className="text-ink-primary font-mono">/login</span> , <span className="text-ink-primary font-mono">/register</span></p>
            <p>Has session → redirect to <span className="font-mono text-acid">/dashboard</span></p>
            <p>No session → allow through</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-start gap-3">
          <Badge variant="default">Open</Badge>
          <div className="text-xs font-body text-ink-secondary space-y-1">
            <p><span className="text-ink-primary font-mono">/</span> , <span className="text-ink-primary font-mono">/design-system/*</span> , <span className="text-ink-primary font-mono">/api/*</span></p>
            <p>No auth check — always accessible</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IATab() {
  return (
    <div className="space-y-10">
      {/* Site Map */}
      <div>
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
          SITE MAP
        </p>
        <div className="bg-surface-raised border border-border rounded-xl p-5">
          {siteMap.map((node) => (
            <RouteTreeNode key={node.path} node={node} />
          ))}
        </div>
      </div>

      {/* Data Flow */}
      <div>
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
          DATA FLOW — REVIEW PIPELINE
        </p>
        <DataFlowDiagram />
      </div>

      {/* Auth Gate */}
      <div>
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
          AUTH GATE LOGIC
        </p>
        <AuthGateDiagram />
      </div>

      {/* Page States */}
      <div>
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
          PAGE STATES
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 pr-4 text-ink-muted font-medium">Page</th>
                <th className="text-left py-2.5 pr-4 text-ink-muted font-medium">Empty</th>
                <th className="text-left py-2.5 pr-4 text-ink-muted font-medium">Loading</th>
                <th className="text-left py-2.5 pr-4 text-ink-muted font-medium">Error</th>
                <th className="text-left py-2.5 text-ink-muted font-medium">Loaded</th>
              </tr>
            </thead>
            <tbody className="text-ink-secondary">
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 text-ink-primary">Dashboard</td>
                <td className="py-2.5 pr-4">EmptyState + CTA</td>
                <td className="py-2.5 pr-4">Skeleton cards</td>
                <td className="py-2.5 pr-4 text-ink-muted">—</td>
                <td className="py-2.5">Stats + review list</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 text-ink-primary">New Review</td>
                <td className="py-2.5 pr-4">Upload form</td>
                <td className="py-2.5 pr-4">Progress bar (4 steps)</td>
                <td className="py-2.5 pr-4">Alert (error)</td>
                <td className="py-2.5">Redirect to detail</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 text-ink-primary">Reviews</td>
                <td className="py-2.5 pr-4">EmptyState</td>
                <td className="py-2.5 pr-4 text-ink-muted">—</td>
                <td className="py-2.5 pr-4 text-ink-muted">—</td>
                <td className="py-2.5">Card list + filters</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 text-ink-primary">Review Detail</td>
                <td className="py-2.5 pr-4 text-ink-muted">—</td>
                <td className="py-2.5 pr-4">Skeleton</td>
                <td className="py-2.5 pr-4">Not found</td>
                <td className="py-2.5">Full detail + tabs</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2.5 pr-4 text-ink-primary">Login</td>
                <td className="py-2.5 pr-4">Form</td>
                <td className="py-2.5 pr-4">Button spinner</td>
                <td className="py-2.5 pr-4">Alert (error)</td>
                <td className="py-2.5">Redirect to dashboard</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-ink-primary">Register</td>
                <td className="py-2.5 pr-4">Form</td>
                <td className="py-2.5 pr-4">Button spinner</td>
                <td className="py-2.5 pr-4">Alert (error)</td>
                <td className="py-2.5">Redirect to dashboard</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default function ArchitecturePage() {
  return (
    <div>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          ARCHITECTURE
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          OOUX & Information Architecture
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Visual map of the app&apos;s object model (OOUX) and information architecture.
          Click any object card to expand its attributes and actions.
        </p>
      </div>

      <Tabs
        tabs={[
          {
            id: "ooux",
            label: "OOUX — Objects",
            content: <OOUXTab />,
          },
          {
            id: "ia",
            label: "Information Architecture",
            content: <IATab />,
          },
        ]}
        defaultTab="ooux"
      />
    </div>
  );
}
