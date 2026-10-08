import { FolderGit2, Briefcase, Eye, ArrowUpRight, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Total Projects", value: "24", change: "+12%", icon: FolderGit2, color: "from-indigo-500 to-violet-600" },
    { title: "Experiences", value: "8", change: "+2", icon: Briefcase, color: "from-violet-500 to-purple-600" },
    { title: "Portfolio Views", value: "14.2k", change: "+28.4%", icon: Eye, color: "from-cyan-500 to-blue-600" },
    { title: "Active Clients", value: "12", change: "+4", icon: Users, color: "from-emerald-500 to-teal-600" },
    { title: "Total Projects", value: "24", change: "+12%", icon: FolderGit2, color: "from-indigo-500 to-violet-600" },
    { title: "Experiences", value: "8", change: "+2", icon: Briefcase, color: "from-violet-500 to-purple-600" },
    { title: "Portfolio Views", value: "14.2k", change: "+28.4%", icon: Eye, color: "from-cyan-500 to-blue-600" },
    { title: "Active Clients", value: "12", change: "+4", icon: Users, color: "from-emerald-500 to-teal-600" },
    { title: "Total Projects", value: "24", change: "+12%", icon: FolderGit2, color: "from-indigo-500 to-violet-600" },
    { title: "Experiences", value: "8", change: "+2", icon: Briefcase, color: "from-violet-500 to-purple-600" },
    { title: "Portfolio Views", value: "14.2k", change: "+28.4%", icon: Eye, color: "from-cyan-500 to-blue-600" },
    { title: "Active Clients", value: "12", change: "+4", icon: Users, color: "from-emerald-500 to-teal-600" },
    { title: "Total Projects", value: "24", change: "+12%", icon: FolderGit2, color: "from-indigo-500 to-violet-600" },
    { title: "Experiences", value: "8", change: "+2", icon: Briefcase, color: "from-violet-500 to-purple-600" },
    { title: "Portfolio Views", value: "14.2k", change: "+28.4%", icon: Eye, color: "from-cyan-500 to-blue-600" },
    { title: "Active Clients", value: "12", change: "+4", icon: Users, color: "from-emerald-500 to-teal-600" },
    { title: "Total Projects", value: "24", change: "+12%", icon: FolderGit2, color: "from-indigo-500 to-violet-600" },
    { title: "Experiences", value: "8", change: "+2", icon: Briefcase, color: "from-violet-500 to-purple-600" },
    { title: "Portfolio Views", value: "14.2k", change: "+28.4%", icon: Eye, color: "from-cyan-500 to-blue-600" },
    { title: "Active Clients", value: "12", change: "+4", icon: Users, color: "from-emerald-500 to-teal-600" },
  ];

  const recentProjects = [
    { name: "Portfolio.OS Dashboard", category: "Web App", status: "Active", date: "Aug 2026" },
    { name: "E-Commerce Suite", category: "Full Stack", status: "Completed", date: "Jul 2026" },
    { name: "AI Image Generator UI", category: "React / Vite", status: "In Review", date: "Jun 2026" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back! Here's what's happening with your portfolio today.
          </p>
        </div>
        <button className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-600 hover:to-violet-700 hover:shadow-indigo-500/30">
          <span>Add New Project</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {stat.title}
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${stat.color} shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
                  <TrendingUp className="mr-1 h-3.5 w-3.5" />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Content Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Projects Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Projects</h2>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-3">Project Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentProjects.map((project, idx) => (
                  <tr key={idx} className="group transition-colors hover:bg-slate-800/40">
                    <td className="py-4 font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {project.name}
                    </td>
                    <td className="py-4 text-slate-400">{project.category}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400">
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 text-right text-slate-400">{project.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick System Summary Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">Portfolio Analytics</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your overall engagement and profile performance has increased significantly over the last 30 days.
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Profile Completion</span>
                  <span>92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 w-[92%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Server Uptime</span>
                  <span>99.9%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[99.9%]" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>System Status: <strong className="text-emerald-400">Optimal</strong></span>
            <span>v1.0.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
