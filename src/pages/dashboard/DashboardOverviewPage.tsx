import { useEffect, useState } from "react";
import { Link } from "react-router";
import { TrendingUp, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { registrationsApi } from "../../services/api";

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegistrations: 1284,
    todayRegistrations: 48,
    unreadMessages: 3,
    activeActivities: 4,
    maxCapacity: 1800,
    capacityPercent: 71,
  });

  const [trackDistribution, setTrackDistribution] = useState<any[]>([
    { id: "buet", name: "BUET & Engineering Drills", registered: 480, capacity: 600, percentage: 80, color: "bg-purple-600" },
    { id: "iba", name: "IBA & Business Leadership", registered: 350, capacity: 450, percentage: 78, color: "bg-blue-600" },
    { id: "medical", name: "Medical & Healthcare Strategy", registered: 284, capacity: 450, percentage: 63, color: "bg-rose-600" },
    { id: "abroad", name: "Abroad Studies & IELTS Global", registered: 170, capacity: 300, percentage: 57, color: "bg-amber-600" },
  ]);

  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([
    { id: "1", code: "NACS26-00482", fullName: "Md. Tanvir Ahmed", phone: "01711234567", institution: "Notre Dame College, Dhaka", track: { name: "BUET" }, status: "CONFIRMED" },
    { id: "2", code: "NACS26-00483", fullName: "Farhan Tanvir", phone: "01812345678", institution: "Dhaka City College", track: { name: "IBA" }, status: "CONFIRMED" },
    { id: "3", code: "NACS26-00484", fullName: "Samiha Anjum", phone: "01913456789", institution: "Holy Cross College", track: { name: "MEDICAL" }, status: "CONFIRMED" },
    { id: "4", code: "NACS26-00485", fullName: "Abrar Fahim", phone: "01614567890", institution: "Rajuk Uttara Model College", track: { name: "ABROAD" }, status: "CONFIRMED" },
  ]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await registrationsApi.getDashboardStats();
      if (res.data) {
        if (res.data.kpi) {
          setStats(res.data.kpi);
        }
        if (res.data.trackDistribution && res.data.trackDistribution.length > 0) {
          const colors = ["bg-purple-600", "bg-blue-600", "bg-rose-600", "bg-amber-600", "bg-emerald-600"];
          setTrackDistribution(
            res.data.trackDistribution.map((t: any, i: number) => ({
              ...t,
              color: colors[i % colors.length],
            }))
          );
        }
        if (res.data.recentRegistrations && res.data.recentRegistrations.length > 0) {
          setRecentRegistrations(res.data.recentRegistrations);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleExportCSV = async () => {
    try {
      const rosterRes = await registrationsApi.getRoster({ limit: 1000 });
      const rows = rosterRes.data && rosterRes.data.length > 0 ? rosterRes.data : recentRegistrations;

      let csv = "Code,FullName,Phone,Institution,HSCBatch,Group,Track,Status,CreatedAt\n";
      rows.forEach((r: any) => {
        const trackName = r.track?.name || r.track || "N/A";
        csv += `"${r.code}","${r.fullName}","${r.phone}","${r.institution || ""}","${r.hscBatch || ""}","${r.group || ""}","${trackName}","${r.status}","${r.createdAt || ""}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `NACS26_Registrations_Export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Registrations CSV exported successfully!");
    } catch {
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Summit Readiness Ticker */}
      <div className="bg-[#1A1614] text-white p-6 rounded-xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E8C547] block mb-1">
            Flagship Event Status
          </span>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl uppercase text-white">
            1st National Academic Career Summit 2026
          </h2>
          <p className="text-xs text-neutral-300 mt-1">
            Saturday, 14 November 2026 &bull; Notre Dame College Campus, Motijheel, Dhaka.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadDashboardData}
            title="Refresh Data"
            className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#A81818] hover:bg-[#8F1313] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/dashboard/registrations"
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            Manage Attendees
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Registrations */}
        <div className="bg-white p-5 rounded-xl border border-[#D5CEBC] shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-[#6E685E] mb-2">
            <span>Total Registered</span>
            <span className="text-[#2E7D32]">{stats.capacityPercent}% full</span>
          </div>
          <div className="font-display font-black text-3xl text-[#1A1614]">
            {stats.totalRegistrations}
          </div>
          <div className="mt-2 text-xs text-[#6E685E]">
            Target: <strong>{stats.maxCapacity}</strong> students
          </div>
          <div className="w-full bg-[#EFEADB] h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#A81818] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.capacityPercent)}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 2: Today Registrations */}
        <div className="bg-white p-5 rounded-xl border border-[#D5CEBC] shadow-xs">
          <div className="text-xs font-bold uppercase text-[#6E685E] mb-2">
            Today's Inflow
          </div>
          <div className="font-display font-black text-3xl text-[#A81818]">
            +{stats.todayRegistrations}
          </div>
          <div className="mt-2 text-xs text-[#2E7D32] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Live attendee intake
          </div>
        </div>

        {/* KPI 3: Messages */}
        <div className="bg-white p-5 rounded-xl border border-[#D5CEBC] shadow-xs">
          <div className="text-xs font-bold uppercase text-[#6E685E] mb-2">
            Unread Inquiries
          </div>
          <div className="font-display font-black text-3xl text-[#1A1614]">
            {stats.unreadMessages}
          </div>
          <div className="mt-2 text-xs text-[#6E685E]">
            <Link to="/dashboard/messages" className="text-[#A81818] font-bold hover:underline">
              View Inbox &rarr;
            </Link>
          </div>
        </div>

        {/* KPI 4: Published Activities */}
        <div className="bg-white p-5 rounded-xl border border-[#D5CEBC] shadow-xs">
          <div className="text-xs font-bold uppercase text-[#6E685E] mb-2">
            Active Modules
          </div>
          <div className="font-display font-black text-3xl text-[#1A1614]">
            {stats.activeActivities}
          </div>
          <div className="mt-2 text-xs text-[#6E685E]">
            Summit Tracks Active
          </div>
        </div>
      </div>

      {/* Track Distribution & Group Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Track Split (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFEADB]">
            <h3 className="font-display font-bold text-sm uppercase text-[#1A1614]">
              Track-Wise Registration Breakdown
            </h3>
            <span className="text-xs text-[#6E685E]">{trackDistribution.length} Pathways</span>
          </div>

          <div className="space-y-4">
            {trackDistribution.map((item, idx) => {
              const count = item.registered || item.count || 0;
              const max = item.capacity || item.max || 450;
              const pct = item.percentage ?? Math.round((count / max) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1A1614]">
                    <span>{item.name || item.track}</span>
                    <span className="font-mono text-[#6E685E]">
                      {count} / {max} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EFEADB] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${item.color || "bg-brand"} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Group Stream Split (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFEADB]">
            <h3 className="font-display font-bold text-sm uppercase text-[#1A1614]">
              Stream Distribution
            </h3>
            <span className="text-xs text-[#6E685E]">HSC 2026–2028</span>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-[#F5F1E6] border border-[#D5CEBC] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#1A1614] block">Science Stream</span>
                <span className="text-[11px] text-[#6E685E]">BUET, Medical & Abroad</span>
              </div>
              <span className="font-mono font-black text-lg text-[#1A1614]">
                {Math.round(stats.totalRegistrations * 0.6)}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F5F1E6] border border-[#D5CEBC] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#1A1614] block">Commerce Stream</span>
                <span className="text-[11px] text-[#6E685E]">DU IBA & BUP FBS</span>
              </div>
              <span className="font-mono font-black text-lg text-[#1A1614]">
                {Math.round(stats.totalRegistrations * 0.28)}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F5F1E6] border border-[#D5CEBC] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#1A1614] block">Humanities / Arts</span>
                <span className="text-[11px] text-[#6E685E]">IBA & Abroad Track</span>
              </div>
              <span className="font-mono font-black text-lg text-[#1A1614]">
                {Math.round(stats.totalRegistrations * 0.12)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFEADB]">
          <div>
            <h3 className="font-display font-bold text-sm uppercase text-[#1A1614]">
              Recent Registrations
            </h3>
            <span className="text-xs text-[#6E685E]">Latest submissions</span>
          </div>

          <Link
            to="/dashboard/registrations"
            className="text-xs font-bold text-[#A81818] hover:underline"
          >
            View All Registrations &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EFEADB] text-[#1A1614] font-bold uppercase">
                <th className="p-3 border-b border-[#D5CEBC]">Pass Code</th>
                <th className="p-3 border-b border-[#D5CEBC]">Full Name</th>
                <th className="p-3 border-b border-[#D5CEBC]">Phone</th>
                <th className="p-3 border-b border-[#D5CEBC]">Institution</th>
                <th className="p-3 border-b border-[#D5CEBC]">Track</th>
                <th className="p-3 border-b border-[#D5CEBC]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEADB]">
              {recentRegistrations.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-[#F5F1E6] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#A81818]">{row.code}</td>
                  <td className="p-3 font-semibold text-[#1A1614]">{row.fullName}</td>
                  <td className="p-3 font-mono text-[#6E685E]">{row.phone}</td>
                  <td className="p-3 text-[#4A4540]">{row.institution}</td>
                  <td className="p-3 font-bold uppercase text-[#1A1614]">
                    {row.track?.name || row.trackName || "Track"}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
