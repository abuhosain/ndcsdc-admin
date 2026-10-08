import { useState } from "react";
import { Link } from "react-router";
import {
  TrendingUp,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardOverviewPage() {
  const [registrationsCount] = useState(1284);
  const maxCapacity = 1800;
  const capacityPercent = Math.round((registrationsCount / maxCapacity) * 100);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Code,FullName,Phone,Institution,HSCBatch,Group,Track,Status,Date\n" +
      "NACS26-00482,Md. Tanvir Ahmed,01711234567,Notre Dame College Dhaka,2026,SCIENCE,BUET,CONFIRMED,2026-10-08\n" +
      "NACS26-00483,Farhan Tanvir,01812345678,Dhaka City College,2026,COMMERCE,IBA,CONFIRMED,2026-10-08\n" +
      "NACS26-00484,Samiha Anjum,01913456789,Holy Cross College,2026,SCIENCE,MEDICAL,CONFIRMED,2026-10-08\n" +
      "NACS26-00485,Abrar Fahim,01614567890,Rajuk Uttara Model College,2027,SCIENCE,ABROAD,CONFIRMED,2026-10-08\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NACS26_Registrations_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Registrations CSV exported successfully!");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Summit Readiness Ticker */}
      <div className="bg-[#1A1614] text-white p-6 rounded-xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <span className="text-[#2E7D32]">{capacityPercent}% full</span>
          </div>
          <div className="font-display font-black text-3xl text-[#1A1614]">
            {registrationsCount}
          </div>
          <div className="mt-2 text-xs text-[#6E685E]">
            Target: <strong>{maxCapacity}</strong> students
          </div>
          <div className="w-full bg-[#EFEADB] h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#A81818] h-full rounded-full transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 2: Today Registrations */}
        <div className="bg-white p-5 rounded-xl border border-[#D5CEBC] shadow-xs">
          <div className="text-xs font-bold uppercase text-[#6E685E] mb-2">
            Today's Inflow
          </div>
          <div className="font-display font-black text-3xl text-[#A81818]">
            +48
          </div>
          <div className="mt-2 text-xs text-[#2E7D32] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14% vs yesterday
          </div>
        </div>

        {/* KPI 3: Messages */}
        <div className="bg-white p-5 rounded-xl border border-[#D5CEBC] shadow-xs">
          <div className="text-xs font-bold uppercase text-[#6E685E] mb-2">
            Unread Inquiries
          </div>
          <div className="font-display font-black text-3xl text-[#1A1614]">
            3
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
            8
          </div>
          <div className="mt-2 text-xs text-[#6E685E]">
            All 4 Tracks Active
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
            <span className="text-xs text-[#6E685E]">4 Pathways</span>
          </div>

          <div className="space-y-4">
            {[
              { track: "BUET & Engineering Drills", count: 480, max: 600, color: "bg-purple-600" },
              { track: "IBA & Business Leadership", count: 350, max: 450, color: "bg-blue-600" },
              { track: "Medical & Healthcare Strategy", count: 284, max: 450, color: "bg-rose-600" },
              { track: "Abroad Studies & IELTS Global", count: 170, max: 300, color: "bg-amber-600" },
            ].map((item, idx) => {
              const pct = Math.round((item.count / item.max) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1A1614]">
                    <span>{item.track}</span>
                    <span className="font-mono text-[#6E685E]">{item.count} / {item.max} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#EFEADB] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
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
              <span className="font-mono font-black text-lg text-[#1A1614]">780</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F5F1E6] border border-[#D5CEBC] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#1A1614] block">Commerce Stream</span>
                <span className="text-[11px] text-[#6E685E]">DU IBA & BUP FBS</span>
              </div>
              <span className="font-mono font-black text-lg text-[#1A1614]">364</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F5F1E6] border border-[#D5CEBC] flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#1A1614] block">Humanities / Arts</span>
                <span className="text-[11px] text-[#6E685E]">IBA & Abroad Track</span>
              </div>
              <span className="font-mono font-black text-lg text-[#1A1614]">140</span>
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
              {[
                { code: "NACS26-00482", name: "Md. Tanvir Ahmed", phone: "01711234567", college: "Notre Dame College, Dhaka", track: "BUET", status: "CONFIRMED" },
                { code: "NACS26-00483", name: "Farhan Tanvir", phone: "01812345678", college: "Dhaka City College", track: "IBA", status: "CONFIRMED" },
                { code: "NACS26-00484", name: "Samiha Anjum", phone: "01913456789", college: "Holy Cross College", track: "MEDICAL", status: "CONFIRMED" },
                { code: "NACS26-00485", name: "Abrar Fahim", phone: "01614567890", college: "Rajuk Uttara Model College", track: "ABROAD", status: "CONFIRMED" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F5F1E6] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#A81818]">{row.code}</td>
                  <td className="p-3 font-semibold text-[#1A1614]">{row.name}</td>
                  <td className="p-3 font-mono text-[#6E685E]">{row.phone}</td>
                  <td className="p-3 text-[#4A4540]">{row.college}</td>
                  <td className="p-3 font-bold uppercase text-[#1A1614]">{row.track}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
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
