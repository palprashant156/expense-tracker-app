import Link from "next/link";
import { LayoutDashboard, Users, Activity, Settings, Database, MessageSquare } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 text-white flex-shrink-0 hidden md:flex flex-col border-r border-zinc-800 h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 mr-3 flex items-center justify-center font-bold">
          SW
        </div>
        <span className="font-bold text-lg">SpendWise Admin</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          <Link href="/" className="flex items-center px-3 py-2.5 bg-zinc-900 rounded-md text-emerald-400 font-medium">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/users" className="flex items-center px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md font-medium transition-colors">
            <Users className="w-5 h-5 mr-3" />
            User Management
          </Link>
          <Link href="/ai-monitor" className="flex items-center px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md font-medium transition-colors">
            <Activity className="w-5 h-5 mr-3" />
            AI Monitoring
          </Link>
          <Link href="/audit-logs" className="flex items-center px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md font-medium transition-colors">
            <Database className="w-5 h-5 mr-3" />
            Audit Logs
          </Link>
          <Link href="/feedback" className="flex items-center px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md font-medium transition-colors">
            <MessageSquare className="w-5 h-5 mr-3" />
            Feedback
          </Link>
        </nav>
      </div>
      
      <div className="p-4 border-t border-zinc-800">
        <Link href="/settings" className="flex items-center px-3 py-2 text-zinc-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
