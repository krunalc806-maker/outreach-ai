import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const WorkspacePage = dynamic(() => import("@/components/dashboard/WorkspacePage"), {
  loading: () => <div className="mx-auto h-96 max-w-7xl animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/70" />,
});

const supportedRoutes = new Set([
  "chat",
  "demo",
  "evidence",
  "cases",
  "campaigns",
  "campaigns/new",
  "templates",
  "analytics",
  "settings",
  "profile",
  "billing",
  "ai/email-generator",
  "leads/import",
]);

export default async function WorkspaceRoute({
  params,
}: {
  params: Promise<{ workspace: string[] }>;
}) {
  const { workspace } = await params;
  const route = workspace.join("/");

  if (!supportedRoutes.has(route)) {
    notFound();
  }

  if (route === "chat") {
    const ChatPage = (await import("@/components/chat/ChatPage")).default;
    return <ChatPage />;
  }

  if (route === "demo") {
    const CompetitionDemo = (await import("@/components/demo/CompetitionDemo")).default;
    return <CompetitionDemo />;
  }

  if (route === "evidence") {
    const ResearchEvidence = (await import("@/components/evidence/ResearchEvidence")).default;
    return <ResearchEvidence />;
  }

  if (route === "cases") {
    const CaseWorkspace = (await import("@/components/cases/CaseWorkspace")).default;
    return <CaseWorkspace />;
  }

  if (route === "profile") {
    const ProfilePage = (await import("@/components/profile/ProfilePage")).default;
    return <ProfilePage />;
  }

  if (route === "templates") {
    const TemplatesPage = (await import("@/components/templates/TemplatesPage")).default;
    return <TemplatesPage />;
  }

  return <WorkspacePage route={route} />;
}
