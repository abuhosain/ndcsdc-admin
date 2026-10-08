import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "antd";
import { toast } from "sonner";

interface MessageItem {
  id: string;
  name: string;
  contact: string;
  subject: string;
  body: string;
  isRead: boolean;
  date: string;
}

const INITIAL_MESSAGES: MessageItem[] = [
  { id: "1", name: "Sabbir Hossain", contact: "01788990011", subject: "Summit Registration", body: "Hello, I am from St. Joseph Higher Secondary School. Can our college batch attend together?", isRead: false, date: "2026-10-08 17:40" },
  { id: "2", name: "Dr. K. M. Rahman", contact: "rahman.mentor@gmail.com", subject: "Sponsorship", body: "We would like to discuss potential scholarship support for the medical mock examination winners.", isRead: false, date: "2026-10-08 16:15" },
  { id: "3", name: "Tanmoy Paul", contact: "01922334455", subject: "General Inquiry", body: "Is scientific calculator allowed during the BUET mock test?", isRead: true, date: "2026-10-07 11:20" },
];

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  const toggleRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
    );
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("Message deleted.");
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
            Public contact inquiries & delegate questions
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl border border-[#D5CEBC] shadow-xs divide-y divide-[#EFEADB] overflow-hidden">
        {messages.map((m) => (
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
                className="px-3 py-1.5 bg-[#1A1614] text-white text-xs font-bold uppercase rounded cursor-pointer"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="p-1.5 text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="p-8 text-center text-xs text-[#6E685E]">
            Inbox is currently empty.
          </div>
        )}
      </div>

      {/* Message Modal */}
      <Modal
        open={!!selectedMessage}
        onCancel={() => setSelectedMessage(null)}
        footer={null}
        title={
          <span className="font-display font-bold text-base uppercase text-[#1A1614]">
            Message Details
          </span>
        }
      >
        {selectedMessage && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-3 bg-[#F5F1E6] rounded border border-[#D5CEBC] space-y-1">
              <div><strong>From:</strong> {selectedMessage.name} ({selectedMessage.contact})</div>
              <div><strong>Subject:</strong> {selectedMessage.subject}</div>
              <div><strong>Date:</strong> {selectedMessage.date}</div>
            </div>

            <div className="p-4 bg-white border border-[#D5CEBC] rounded text-sm text-[#1A1614] leading-relaxed">
              {selectedMessage.body}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-[#1A1614] text-white rounded text-xs font-bold uppercase"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
