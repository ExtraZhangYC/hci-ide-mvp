import { AppShell } from "@/components/AppShell";
import { AgentBoard } from "@/pages/AgentBoard";
import { TaskBoard } from "@/pages/TaskBoard";
import { CouncilBoard } from "@/pages/CouncilBoard";
import { useDemoStore } from "@/store/useDemoStore";

export default function App() {
  const currentPage = useDemoStore((s) => s.currentPage);

  return (
    <AppShell>
      {currentPage === "agents" && <AgentBoard />}
      {currentPage === "tasks" && <TaskBoard />}
      {currentPage === "council" && <CouncilBoard />}
    </AppShell>
  );
}
