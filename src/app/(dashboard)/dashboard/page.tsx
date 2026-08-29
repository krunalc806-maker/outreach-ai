import CaseWorkspace from "@/components/cases/CaseWorkspace";
import MetricsCards from "@/components/dashboard/MetricsCards";
import OutreachPanel from "@/components/dashboard/OutreachPanel";
import AIComposerPanel from "@/components/dashboard/AIComposerPanel";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Autonomous Consumer Agent Mission Control */}
      <CaseWorkspace />

      {/* Preserved Workspace & Operational Infrastructure */}
      <div className="pt-6 border-t border-white/10 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white">Operational Telemetry & Batch Tools</h2>
          <p className="text-xs text-zinc-400">Preserved infrastructure for CRM sync, batch notices, and metrics monitoring</p>
        </div>
        <MetricsCards />
        <OutreachPanel />
        <AIComposerPanel />
      </div>
    </div>
  );
}
