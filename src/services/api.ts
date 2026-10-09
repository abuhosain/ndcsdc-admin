// NDCSDC Admin API Service Client
const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:8001/api/v1";

export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function getAuthToken(): string | null {
  return localStorage.getItem("ndcsdc_token");
}

export function setAuthSession(token: string, user: any) {
  localStorage.setItem("ndcsdc_token", token);
  localStorage.setItem("ndcsdc_auth", JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem("ndcsdc_token");
  localStorage.removeItem("ndcsdc_auth");
}

export function getStoredUser(): any | null {
  const raw = localStorage.getItem("ndcsdc_auth");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const url = `${BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  let data: any = null;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}

// ── 1. AUTH SERVICES ─────────────────────────────────────────
export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    return request<{ accessToken: string; refreshToken: string; user: any }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },
  getMe: async () => {
    return request<any>("/auth/me");
  },
  logout: async () => {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      clearAuthSession();
    }
  },
  changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
    return request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// ── 2. DASHBOARD & REGISTRATIONS ─────────────────────────────
export const registrationsApi = {
  getDashboardStats: async () => {
    return request<any>("/registrations/admin/dashboard-stats");
  },
  getRoster: async (params?: {
    search?: string;
    trackId?: string;
    group?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.trackId && params.trackId !== "ALL") query.set("trackId", params.trackId);
    if (params?.group && params.group !== "ALL") query.set("group", params.group);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    return request<any[]>(`/registrations/admin/roster?${query.toString()}`);
  },
  updateStatus: async (id: string, status: "CONFIRMED" | "CANCELLED") => {
    return request(`/registrations/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  verifyPass: async (code: string) => {
    return request<any>(`/registrations/verify/${encodeURIComponent(code)}`);
  },
};

// ── 3. SUMMIT MANAGEMENT ─────────────────────────────────────
export const summitApi = {
  getTracks: async () => {
    return request<any[]>("/summit/tracks");
  },
  updateTrack: async (id: string, payload: any) => {
    return request(`/summit/admin/tracks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  getSchedule: async () => {
    return request<any[]>("/summit/schedule");
  },
  createScheduleItem: async (payload: { time: string; title: string; hall?: string; type?: string; sortOrder?: number }) => {
    return request("/summit/admin/schedule", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateScheduleItem: async (id: string, payload: any) => {
    return request(`/summit/admin/schedule/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteScheduleItem: async (id: string) => {
    return request(`/summit/admin/schedule/${id}`, {
      method: "DELETE",
    });
  },
  getFaqs: async () => {
    return request<any[]>("/summit/faqs");
  },
  createFaq: async (payload: { q: string; a: string; sortOrder?: number }) => {
    return request("/summit/admin/faqs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateFaq: async (id: string, payload: any) => {
    return request(`/summit/admin/faqs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteFaq: async (id: string) => {
    return request(`/summit/admin/faqs/${id}`, {
      method: "DELETE",
    });
  },
};

// ── 4. ACTIVITIES & GALLERY ───────────────────────────────────
export const activitiesApi = {
  getAdminActivities: async () => {
    return request<any[]>("/activities/admin/all");
  },
  createActivity: async (payload: any) => {
    return request("/activities/admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateActivity: async (id: string, payload: any) => {
    return request(`/activities/admin/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteActivity: async (id: string) => {
    return request(`/activities/admin/${id}`, {
      method: "DELETE",
    });
  },
};

export const galleryApi = {
  getAdminGallery: async () => {
    return request<any[]>("/gallery/admin/all");
  },
  createGalleryPhoto: async (payload: { title: string; imageUrl: string; category: string; caption?: string }) => {
    return request("/gallery/admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteGalleryPhoto: async (id: string) => {
    return request(`/gallery/admin/${id}`, {
      method: "DELETE",
    });
  },
};

// ── 5. TEAM & PARTNERS ────────────────────────────────────────
export const teamApi = {
  getAdminTeam: async (params?: { panelType?: string; panelYear?: string }) => {
    const query = new URLSearchParams();
    if (params?.panelType) query.set("panelType", params.panelType);
    if (params?.panelYear) query.set("panelYear", params.panelYear);
    return request<any[]>(`/team/admin/all?${query.toString()}`);
  },
  createMember: async (payload: any) => {
    return request("/team/admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateMember: async (id: string, payload: any) => {
    return request(`/team/admin/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteMember: async (id: string) => {
    return request(`/team/admin/${id}`, {
      method: "DELETE",
    });
  },
};

export const partnersApi = {
  getAdminPartners: async () => {
    return request<any[]>("/partners/admin/all");
  },
  createPartner: async (payload: any) => {
    return request("/partners/admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updatePartner: async (id: string, payload: any) => {
    return request(`/partners/admin/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deletePartner: async (id: string) => {
    return request(`/partners/admin/${id}`, {
      method: "DELETE",
    });
  },
};

// ── 6. ACHIEVEMENTS & IMPACT ──────────────────────────────────
export const achievementsApi = {
  getAdminAchievements: async () => {
    return request<any[]>("/achievements/admin");
  },
  createAchievement: async (payload: any) => {
    return request("/achievements", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateAchievement: async (id: string, payload: any) => {
    return request(`/achievements/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteAchievement: async (id: string) => {
    return request(`/achievements/${id}`, {
      method: "DELETE",
    });
  },
};

// ── 7. NEWS & ANNOUNCEMENTS ──────────────────────────────────
export const newsApi = {
  getAdminNews: async () => {
    return request<any[]>("/news/admin");
  },
  createNews: async (payload: any) => {
    return request("/news", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateNews: async (id: string, payload: any) => {
    return request(`/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteNews: async (id: string) => {
    return request(`/news/${id}`, {
      method: "DELETE",
    });
  },
};

// ── 8. RESOURCES & OPPORTUNITIES ─────────────────────────────
export const resourcesApi = {
  getAdminResources: async () => {
    return request<any[]>("/resources/admin");
  },
  createResource: async (payload: any) => {
    return request("/resources", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateResource: async (id: string, payload: any) => {
    return request(`/resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteResource: async (id: string) => {
    return request(`/resources/${id}`, {
      method: "DELETE",
    });
  },
};

// ── 9. ALUMNI DIRECTORY & MODERATION ─────────────────────────
export const alumniApi = {
  getAdminAlumni: async () => {
    return request<any[]>("/alumni/admin");
  },
  updateAlumniStatus: async (id: string, payload: any) => {
    return request(`/alumni/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteAlumni: async (id: string) => {
    return request(`/alumni/${id}`, {
      method: "DELETE",
    });
  },
};

// ── 10. MESSAGES & INBOX ─────────────────────────────────────
export const contactApi = {
  getInbox: async () => {
    return request<any[]>("/contact/admin/inbox");
  },
  toggleRead: async (id: string) => {
    return request(`/contact/admin/${id}/read`, {
      method: "PATCH",
    });
  },
  deleteMessage: async (id: string) => {
    return request(`/contact/admin/${id}`, {
      method: "DELETE",
    });
  },
};

// ── 11. SITE SETTINGS ────────────────────────────────────────
export const settingsApi = {
  getSettings: async () => {
    return request<any>("/settings/admin");
  },
  updateSettings: async (payload: any) => {
    return request("/settings/admin", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};

// ── 12. ADMIN USERS & AUDIT LOGS ─────────────────────────────
export const usersAuditApi = {
  getUsers: async () => {
    return request<any[]>("/admin/users");
  },
  createUser: async (payload: any) => {
    return request("/admin/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateRole: async (id: string, role: string) => {
    return request(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },
  getAuditLogs: async () => {
    return request<any[]>("/admin/audit-logs");
  },
};
