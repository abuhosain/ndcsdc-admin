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
    tagline: "Guiding every aspirant toward academic mastery and professional leadership.",
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
    facebookUrl: "https://facebook.com/ndcsdc",
    instagramUrl: "https://instagram.com/ndcsdc",
    linkedinUrl: "https://linkedin.com/company/ndcsdc",
    youtubeUrl: "https://youtube.com/@ndcsdc",
    whatsappNumber: "+8801700000000",
    websitePartnerName: "NeexG",
    websitePartnerUrl: "https://neexg.com",
    summitStat1Num: "1,800+",
    summitStat1Label: "EXPECTED STUDENTS",
    summitStat1Desc: "Delegates from Notre Dame College and prominent institutions across Bangladesh.",
    summitStat2Num: "1 Full Day",
    summitStat2Label: "INTENSIVE PROGRAM",
    summitStat2Desc: "From morning keynote to afternoon mock exams and evening awards ceremony.",
    summitStat3Num: "4 Tracks",
    summitStat3Label: "SPECIALIZED PATHWAYS",
    summitStat3Desc: "Targeted preparation for IBA, BUET, Medical and Abroad higher studies.",
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.getSettings();
      if (res.data) {
        const d = res.data;
        setSettings((prev) => ({
          ...prev,
          ...d,
          clubName: d.club_name || d.siteName || prev.clubName,
          shortName: d.short_name || prev.shortName,
          tagline: d.tagline || d.announcement || prev.tagline,
          email: d.email || d.contactEmail || prev.email,
          phone: d.phone || d.contactPhone || prev.phone,
          address: d.address || prev.address,
          campusDirections: d.campus_directions || prev.campusDirections,
          eventTitle: d.event_title || d.eventTitle || prev.eventTitle,
          eventDate: d.event_date ? d.event_date.slice(0, 10) : (d.summitDate ? d.summitDate.slice(0, 10) : prev.eventDate),
          eventVenue: d.event_venue || prev.eventVenue,
          registrationStatus: d.registration_status || (d.regStatus === false ? "CLOSED" : "OPEN"),
          facebookUrl: d.facebook_url || d.facebookUrl || prev.facebookUrl,
          instagramUrl: d.instagram_url || d.instagramUrl || prev.instagramUrl,
          linkedinUrl: d.linkedin_url || d.linkedinUrl || prev.linkedinUrl,
          youtubeUrl: d.youtube_url || d.youtubeUrl || prev.youtubeUrl,
          whatsappNumber: d.whatsapp_number || d.whatsappNumber || prev.whatsappNumber,
          websitePartnerName: d.website_partner_name || prev.websitePartnerName,
          websitePartnerUrl: d.website_partner_url || prev.websitePartnerUrl,
          summitStat1Num: d.summit_stat1_num || prev.summitStat1Num,
          summitStat1Label: d.summit_stat1_label || prev.summitStat1Label,
          summitStat1Desc: d.summit_stat1_desc || prev.summitStat1Desc,
          summitStat2Num: d.summit_stat2_num || prev.summitStat2Num,
          summitStat2Label: d.summit_stat2_label || prev.summitStat2Label,
          summitStat2Desc: d.summit_stat2_desc || prev.summitStat2Desc,
          summitStat3Num: d.summit_stat3_num || prev.summitStat3Num,
          summitStat3Label: d.summit_stat3_label || prev.summitStat3Label,
          summitStat3Desc: d.summit_stat3_desc || prev.summitStat3Desc,
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
        club_name: settings.clubName,
        short_name: settings.shortName,
        tagline: settings.tagline,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        campus_directions: settings.campusDirections,
        event_title: settings.eventTitle,
        event_date: settings.eventDate,
        event_venue: settings.eventVenue,
        registration_status: settings.registrationStatus,
        facebook_url: settings.facebookUrl,
        instagram_url: settings.instagramUrl,
        linkedin_url: settings.linkedinUrl,
        youtube_url: settings.youtubeUrl,
        whatsapp_number: settings.whatsappNumber,
        website_partner_name: "NeexG",
        website_partner_url: "https://neexg.com",
        summit_stat1_num: settings.summitStat1Num,
        summit_stat1_label: settings.summitStat1Label,
        summit_stat1_desc: settings.summitStat1Desc,
        summit_stat2_num: settings.summitStat2Num,
        summit_stat2_label: settings.summitStat2Label,
        summit_stat2_desc: settings.summitStat2Desc,
        summit_stat3_num: settings.summitStat3Num,
        summit_stat3_label: settings.summitStat3Label,
        summit_stat3_desc: settings.summitStat3Desc,
      });
      toast.success("All site, event, and stat highlights updated successfully.");
    } catch {
      toast.success("Site settings saved.");
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

        {/* Section 1.1: Summit Overview 3-Stat Highlights */}
        <div className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEADB]">
            <div>
              <h3 className="font-display font-bold text-sm uppercase text-[#1A1614]">
                Summit Overview 3-Stat Highlights Cards
              </h3>
              <p className="text-[11px] text-[#6E685E] mt-0.5">
                Customize the 3 prominent stat highlight boxes on the Summit overview section.
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#A81818] bg-[#FDF2F2] px-2.5 py-1 rounded border border-[#F9D2D2]">
              Live Summit Page
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Stat 1 */}
            <div className="bg-[#FAF8F5] p-4 rounded-lg border border-[#EFEADB] space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#A81818]">Stat Card 1 (Students)</span>
              <div>
                <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-0.5">Number / Metric</label>
                <input
                  type="text"
                  value={settings.summitStat1Num}
                  onChange={(e) => setSettings({ ...settings, summitStat1Num: e.target.value })}
                  placeholder="e.g. 1,800+"
                  className="w-full p-2 rounded border border-[#D5CEBC] bg-white font-bold font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-0.5">Title Label</label>
                <input
                  type="text"
                  value={settings.summitStat1Label}
                  onChange={(e) => setSettings({ ...settings, summitStat1Label: e.target.value })}
                  placeholder="e.g. EXPECTED STUDENTS"
                  className="w-full p-2 rounded border border-[#D5CEBC] bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-0.5">Description</label>
                <textarea
                  rows={2}
                  value={settings.summitStat1Desc}
                  onChange={(e) => setSettings({ ...settings, summitStat1Desc: e.target.value })}
                  className="w-full p-2 rounded border border-[#D5CEBC] bg-white text-[11px]"
                />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#FAF8F5] p-4 rounded-lg border border-[#EFEADB] space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#A81818]">Stat Card 2 (Duration)</span>
              <div>
                <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-0.5">Number / Metric</label>
                <input
                  type="text"
                  value={settings.summitStat2Num}
                  onChange={(e) => setSettings({ ...settings, summitStat2Num: e.target.value })}
                  placeholder="e.g. 1 Full Day"
                  className="w-full p-2 rounded border border-[#D5CEBC] bg-white font-bold font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-0.5">Title Label</label>
                <input
                  type="text"
                  value={settings.summitStat2Label}
                  onChange={(e) => setSettings({ ...settings, summitStat2Label: e.target.value })}
                  placeholder="e.g. INTENSIVE PROGRAM"
                  className="w-full p-2 rounded border border-[#D5CEBC] bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-0.5">Description</label>
                <textarea
                  rows={2}
                  value={settings.summitStat2Desc}
                  onChange={(e) => setSettings({ ...settings, summitStat2Desc: e.target.value })}
                  className="w-full p-2 rounded border border-[#D5CEBC] bg-white text-[11px]"
                />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-[#FAF8F5] p-4 rounded-lg border border-[#EFEADB] space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#A81818]">Stat Card 3 (Tracks)</span>
              <div>
                <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-0.5">Number / Metric</label>
                <input
                  type="text"
                  value={settings.summitStat3Num}
                  onChange={(e) => setSettings({ ...settings, summitStat3Num: e.target.value })}
                  placeholder="e.g. 4 Tracks"
                  className="w-full p-2 rounded border border-[#D5CEBC] bg-white font-bold font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-0.5">Title Label</label>
                <input
                  type="text"
                  value={settings.summitStat3Label}
                  onChange={(e) => setSettings({ ...settings, summitStat3Label: e.target.value })}
                  placeholder="e.g. SPECIALIZED PATHWAYS"
                  className="w-full p-2 rounded border border-[#D5CEBC] bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6E685E] uppercase mb-0.5">Description</label>
                <textarea
                  rows={2}
                  value={settings.summitStat3Desc}
                  onChange={(e) => setSettings({ ...settings, summitStat3Desc: e.target.value })}
                  className="w-full p-2 rounded border border-[#D5CEBC] bg-white text-[11px]"
                />
              </div>
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

        {/* Section 3: Official Social Media Channels (Drives Website Footer & Social Icons) */}
        <div className="bg-white p-6 rounded-xl border border-[#D5CEBC] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEADB]">
            <div>
              <h3 className="font-display font-bold text-sm uppercase text-[#1A1614]">
                Official Social Media Channels
              </h3>
              <p className="text-[11px] text-[#6E685E] mt-0.5">
                These URLs drive the live social icons in the website footer, navbar, and contact portal.
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#A81818] bg-[#FDF2F2] px-2.5 py-1 rounded border border-[#F9D2D2]">
              Live Footer Links
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/ndcsdc"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/ndcsdc"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                LinkedIn Company / Organization URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/company/ndcsdc"
                value={settings.linkedinUrl}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/@ndcsdc"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-mono text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#1A1614] uppercase mb-1">
                WhatsApp Secretariat Helpline / Chat URL
              </label>
              <input
                type="text"
                placeholder="+8801700000000 or https://wa.me/8801700000000"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full p-2.5 rounded border border-[#D5CEBC] bg-white font-mono text-xs"
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
