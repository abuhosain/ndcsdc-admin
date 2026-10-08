import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function SiteSettingsAdminPage() {
  const [settings, setSettings] = useState({
    clubName: "Notre Dame Career & Skill Development Club",
    shortName: "NDCSDC",
    tagline: "A day dedicated to guiding every aspirant toward the right path.",
    email: "ndcsdc.ndc@gmail.com",
    phone: "+880 1700-000000",
    address: "Notre Dame College, Toyenbee Circular Rd, Motijheel, Dhaka 1000",
    eventTitle: "1st National Academic Career Summit 2026",
    eventDate: "2026-11-14",
    eventVenue: "Notre Dame College Auditorium & Campus, Dhaka",
    registrationStatus: "OPEN",
    totalCapacity: 1800,
    websitePartnerName: "NeexG",
    websitePartnerUrl: "https://neexg.com",
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Site and Summit settings updated successfully.");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
          Global Site & Event Settings
        </h2>
        <p className="text-xs text-[#6E685E] mt-0.5">
          Configure live club metadata, summit countdown drivers, and registration status
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Summit & Registration Controls */}
        <div className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs space-y-4">
          <h3 className="font-display font-bold text-sm uppercase text-[#1A1614] pb-3 border-b border-[#EFEADB]">
            Summit & Registration Controls
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
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6]"
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
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Event Venue
              </label>
              <input
                type="text"
                value={settings.eventVenue}
                onChange={(e) => setSettings({ ...settings, eventVenue: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Registration Status
              </label>
              <select
                value={settings.registrationStatus}
                onChange={(e) => setSettings({ ...settings, registrationStatus: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-bold cursor-pointer"
              >
                <option value="OPEN">OPEN (Accepting Registrations)</option>
                <option value="CLOSING_SOON">CLOSING SOON</option>
                <option value="CLOSED">CLOSED (Capacity Full)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Club Information */}
        <div className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs space-y-4">
          <h3 className="font-display font-bold text-sm uppercase text-[#1A1614] pb-3 border-b border-[#EFEADB]">
            Club Identity & Secretariat Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Full Club Name
              </label>
              <input
                type="text"
                value={settings.clubName}
                onChange={(e) => setSettings({ ...settings, clubName: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Campus Location Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#F5F1E6]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Official Website Partner Configuration */}
        <div className="bg-white p-6 rounded-xl border-2 border-[#A81818] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEADB]">
            <h3 className="font-display font-bold text-sm uppercase text-[#1A1614]">
              Website Partner Settings
            </h3>
            <span className="text-[10px] font-bold uppercase text-[#A81818] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Contract Protected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Partner Brand Name
              </label>
              <input
                type="text"
                disabled
                value={settings.websitePartnerName}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#EFEADB] text-neutral-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Partner Website Backlink
              </label>
              <input
                type="url"
                disabled
                value={settings.websitePartnerUrl}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-[#EFEADB] text-neutral-800 font-bold font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-xs uppercase tracking-wider py-3 px-8 font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes…" : "Save Site Settings"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
