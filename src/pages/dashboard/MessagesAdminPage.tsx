import { useEffect, useState } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";
import { contactApi } from "../../services/api";

interface MessageItem {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  contact?: string;
  subject?: string | null;
  message?: string;
  body?: string;
  isRead: boolean;
  createdAt?: string;
  date?: string;
}

const INITIAL_MESSAGES: MessageItem[] = [
  { id: "1", name: "Sabbir Hossain", contact: "01788990011", subject: "Summit Registration", body: "Hello, I am from St. Joseph Higher Secondary School. Can our college batch attend together?", isRead: false, date: "2026-10-08 17:40" },
  { id: "2", name: "Dr. K. M. Rahman", contact: "rahman.mentor@gmail.com", subject: "Sponsorship", body: "We would like to discuss potential scholarship support for the medical mock examination winners.", isRead: false, date: "2026-10-08 16:15" },
  { id: "3", name: "Tanmoy Paul", contact: "01922334455", subject: "General Inquiry", body: "Is scientific calculator allowed during the BUET mock test?", isRead: true, date: "2026-10-07 11:20" },
];

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  const loadInbox = async () => {
    try {
      setLoading(true);
      const res = await contactApi.getInbox();
      if (res.data && res.data.length > 0) {
        setMessages(
          res.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            contact: m.phone || m.email || "N/A",
            subject: m.subject || "General Inquiry",
            body: m.message,
            isRead: Boolean(m.isRead),
            date: m.createdAt ? new Date(m.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent",
          }))
        );
      }
    } catch {
      // Keep initial
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  const toggleRead = async (id: string) => {
    try {
      await contactApi.toggleRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contactApi.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted.");
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted (Local).");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-xl uppercase text-[#1A1614]">
            Secretariat Messages Inbox
          </h2>
          <p className="text-xs text-[#6E685E] mt-0.5">
            Public contact inquiries & delegate questions ({messages.filter((m) => !m.isRead).length} unread)
          </p>
        </div>

        <button
          onClick={loadInbox}
          title="Refresh Inbox"
          className="p-2.5 bg-white border border-[#D5CEBC] rounded-lg text-[#1A1614] hover:bg-[#F5F1E6] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs divide-y divide-[#EFEADB] overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6E685E]">Inbox is empty.</div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                !m.isRead ? "bg-[#F5F1E6]/70 font-medium" : "hover:bg-[#F5F1E6]"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-sm text-[#1A1614]">
                    {m.name}
                  </span>
                  <span className="text-xs font-mono text-[#6E685E]">{m.contact}</span>
                  <span className="px-2 py-0.5 rounded bg-[#EFEADB] text-[#1A1614] text-[10px] font-bold uppercase">
                    {m.subject}
                  </span>
                  {!m.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#A81818]"></span>
                  )}
                </div>
                <p className="text-xs text-[#4A4540] line-clamp-2 max-w-2xl leading-relaxed">
                  {m.body}
                </p>
                <div className="text-[10px] text-[#6E685E]">{m.date}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSelectedMessage(m);
                    if (!m.isRead) toggleRead(m.id);
                  }}
                  className="px-3 py-1.5 bg-white border border-[#D5CEBC] text-xs font-bold rounded-lg hover:bg-[#EFEADB] cursor-pointer"
                >
                  Read
                </button>
                <button
                  onClick={() => toggleRead(m.id)}
                  className="text-xs text-[#6E685E] hover:underline cursor-pointer"
                >
                  {m.isRead ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal View Detail */}
      <Modal
        open={Boolean(selectedMessage)}
        onCancel={() => setSelectedMessage(null)}
        footer={null}
        centered
        title={<span className="font-display font-bold uppercase text-sm">Inquiry Details</span>}
      >
        {selectedMessage && (
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-[#F5F1E6] rounded-lg border border-[#D5CEBC] space-y-1.5">
              <div><strong>Sender:</strong> {selectedMessage.name}</div>
              <div><strong>Contact:</strong> {selectedMessage.contact}</div>
              <div><strong>Subject:</strong> {selectedMessage.subject}</div>
              <div><strong>Date:</strong> {selectedMessage.date}</div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-[#D5CEBC] leading-relaxed text-[#1A1614]">
              {selectedMessage.body}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
