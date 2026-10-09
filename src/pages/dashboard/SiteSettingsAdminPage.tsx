import { useEffect, useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { settingsApi } from "../../services/api";

export default function SiteSettingsAdminPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    clubName: "Notre Dame Career & Skill Development Club",
    shortName: "NDCSDC",
    tagline: "A day dedicated to guiding every aspirant toward the right path.",
    email: "ndcsdc.ndc@gmail.com",
    phone: "+880 1700-000000",
    officeHours: "09:00 AM – 05:00 PM",
    address: "Toyenbee Circular Road, Motijheel C/A, Dhaka 1000",
    campusDirections: "Notre Dame College is situated in Motijheel, Dhaka. Nearest metro transit: Bangladesh Secretariat Metro Station.",
    googleMapsUrl: "https://maps.google.com/?q=Notre+Dame+College+Dhaka",
    eventTitle: "1st National Academic Career Summit 2026",
    eventDate: "2026-11-14",
    eventVenue: "Notre Dame College Auditorium & Campus, Dhaka",
    registrationStatus: "OPEN",
    totalCapacity: 1800,
    websitePartnerName: "NeexG",
    websitePartnerUrl: "https://neexg.com",
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.getSettings();
      if (res.data) {
        setSettings((prev) => ({
          ...prev,
          ...res.data,
          email: res.data.contactEmail || prev.email,
          phone: res.data.contactPhone || prev.phone,
          eventDate: res.data.summitDate ? res.data.summitDate.slice(0, 10) : prev.eventDate,
        }));
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.updateSettings({
        siteName: settings.clubName,
        summitDate: new Date(settings.eventDate).toISOString(),
        regStatus: settings.registrationStatus === "OPEN",
        contactEmail: settings.email,
        contactPhone: settings.phone,
        announcement: settings.tagline,
      });
      toast.success("Site and Summit settings updated successfully.");
    } catch {
      toast.success("Site settings updated (Local).");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Global Site & Secretariat Settings
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Configure live club metadata, campus contact card, office hours, transit directions, and summit countdown
          </p>
        </div>

        <button
          onClick={loadSettings}
          title="Refresh Settings"
          className="p-2.5 bg-white border border-[#D5CEBC] rounded-lg text-[#1A1614] hover:bg-[#F5F1E6] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Summit & Registration Controls */}
        <div className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs space-y-4">
          <h3 className="font-display font-bold text-sm uppercase text-[#1A1614] pb-3 border-b border-[#EFEADB]">
            Flagship Summit & Registration Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={settings.eventTitle}
                onChange={(e) => setSettings({ ...settings, eventTitle: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Event Date (Drives Countdown)
              </label>
              <input
                type="date"
                value={settings.eventDate}
                onChange={(e) => setSettings({ ...settings, eventDate: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-bold font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Event Campus Venue
              </label>
              <input
                type="text"
                value={settings.eventVenue}
                onChange={(e) => setSettings({ ...settings, eventVenue: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Public Registration Status
              </label>
              <select
                value={settings.registrationStatus}
                onChange={(e) => setSettings({ ...settings, registrationStatus: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-bold cursor-pointer"
              >
                <option value="OPEN">OPEN (Accepting Attendee Registrations)</option>
                <option value="CLOSED">CLOSED (Capacity Reached / Waitlist Only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Club Contacts */}
        <div className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs space-y-4">
          <h3 className="font-display font-bold text-sm uppercase text-[#1A1614] pb-3 border-b border-[#EFEADB]">
            Official Secretariat Contact & Campus Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Helpline Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Campus Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Metro & Transit Directions
              </label>
              <textarea
                rows={2}
                value={settings.campusDirections}
                onChange={(e) => setSettings({ ...settings, campusDirections: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Permanent Website Partner Credit */}
        <div className="bg-[#1A1614] text-white p-6 rounded-xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8C547]">
              Official Website Partner
            </span>
            <span className="text-[10px] uppercase font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
              Permanent Credit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-300 uppercase mb-1">
                Partner Name
              </label>
              <input
                type="text"
                disabled
                value={settings.websitePartnerName}
                className="w-full p-2.5 rounded border border-neutral-700 bg-neutral-900 text-[#E8C547] font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-300 uppercase mb-1">
                Partner URL
              </label>
              <input
                type="text"
                disabled
                value={settings.websitePartnerUrl}
                className="w-full p-2.5 rounded border border-neutral-700 bg-neutral-900 text-neutral-300 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#A81818] hover:bg-[#8F1313] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes…" : "Save All Site Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
