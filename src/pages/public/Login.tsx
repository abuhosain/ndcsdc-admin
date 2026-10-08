import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("admin@ndcsdc.org");
  const [password, setPassword] = useState("admin1234");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("ndcsdc_auth", JSON.stringify({ email, role: "SUPER_ADMIN", name: "NDCSDC Super Admin" }));
      toast.success("Welcome back! Signed in to NDCSDC Admin Portal.");
      navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1A1614] p-4 text-[#F5EFE0]">
      {/* Container Card */}
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#110E0C] p-8 sm:p-10 shadow-2xl">
        
        {/* Header with Dual Brand Logos */}
        <div className="mb-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 bg-[#EFEADB] p-2 rounded-xl border border-[#D5CEBC] w-fit mx-auto shadow-sm">
            <div className="relative w-9 h-9 flex items-center justify-center bg-white rounded-md overflow-hidden">
              <img
                src="/logos/ndc-college-logo.jpeg"
                alt="NDC"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-[1px] h-7 bg-[#B9B29E]"></div>
            <div className="relative w-9 h-9 flex items-center justify-center bg-white rounded-md overflow-hidden">
              <img
                src="/logos/ndcsdc-logo.jpeg"
                alt="NDCSDC"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A81818] bg-rose-950/40 border border-rose-900/60 px-2.5 py-0.5 rounded">
              Secretariat Access
            </span>
            <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white mt-2">
              NDCSDC Admin
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Notre Dame Career & Skill Development Club &bull; NACS 2026
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ndcsdc.org"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900/80 py-3 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:border-[#A81818] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900/80 py-3 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:border-[#A81818] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#A81818] hover:bg-[#8F1313] py-3 px-4 font-display font-bold text-xs uppercase tracking-wider text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Authenticating…" : "Sign In to Secretariat Desk"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-4 border-t border-neutral-800 text-center text-[11px] text-neutral-400">
          Notre Dame College, Motijheel, Dhaka &bull; PERN Stack Portal
        </div>

      </div>
    </div>
  );
}
