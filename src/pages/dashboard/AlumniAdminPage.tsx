import { useState, useEffect } from "react";
import { Table, Button, Switch, Popconfirm, Tag, message } from "antd";
import { GraduationCap, Trash2, CheckCircle, XCircle } from "lucide-react";
import { alumniApi } from "../../services/api";

export default function AlumniAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await alumniApi.getAdminAlumni();
      setData(res.data || []);
    } catch (err: any) {
      message.error(err.message || "Failed to load alumni records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: "APPROVED" | "PENDING" | "REJECTED") => {
    try {
      await alumniApi.updateAlumniStatus(id, { status });
      message.success(`Status updated to ${status}`);
      loadData();
    } catch (err: any) {
      message.error(err.message || "Failed to update status");
    }
  };

  const handleFeaturedToggle = async (id: string, isFeatured: boolean) => {
    try {
      await alumniApi.updateAlumniStatus(id, { isFeatured });
      message.success(isFeatured ? "Marked as Featured Story" : "Unmarked as Featured");
      loadData();
    } catch (err: any) {
      message.error(err.message || "Failed to update featured flag");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await alumniApi.deleteAlumni(id);
      message.success("Alumni record deleted.");
      loadData();
    } catch (err: any) {
      message.error(err.message || "Failed to delete.");
    }
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (st: string) => {
        if (st === "APPROVED") return <Tag color="green">APPROVED</Tag>;
        if (st === "PENDING") return <Tag color="gold">PENDING REVIEW</Tag>;
        return <Tag color="red">REJECTED</Tag>;
      },
    },
    {
      title: "Featured",
      dataIndex: "isFeatured",
      key: "isFeatured",
      width: 90,
      render: (feat: boolean, record: any) => (
        <Switch
          size="small"
          checked={feat}
          onChange={(checked) => handleFeaturedToggle(record.id, checked)}
        />
      ),
    },
    {
      title: "Alumnus",
      dataIndex: "fullName",
      key: "fullName",
      render: (name: string, r: any) => (
        <div>
          <span className="font-bold text-neutral-900 block">{name}</span>
          <span className="text-xs text-red-700 font-mono">{r.batch}</span>
        </div>
      ),
    },
    {
      title: "Current Institution / Role",
      key: "institution",
      render: (_: any, r: any) => (
        <div className="text-xs space-y-0.5">
          <div className="font-semibold text-neutral-800">{r.currentInstitution}</div>
          {r.currentRole && <div className="text-neutral-500">{r.currentRole}</div>}
        </div>
      ),
    },
    {
      title: "Quote / Advice",
      dataIndex: "quote",
      key: "quote",
      ellipsis: true,
      render: (q: string) => q || <span className="text-neutral-400 italic">No quote</span>,
    },
    {
      title: "Consent",
      dataIndex: "consentPublish",
      key: "consentPublish",
      width: 90,
      render: (c: boolean) => <Tag color={c ? "blue" : "default"}>{c ? "Consented" : "Private"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-1.5">
          {record.status !== "APPROVED" && (
            <Button
              size="small"
              type="primary"
              className="bg-emerald-600 hover:bg-emerald-700 text-xs"
              icon={<CheckCircle className="w-3 h-3" />}
              onClick={() => handleStatusChange(record.id, "APPROVED")}
            >
              Approve
            </Button>
          )}
          {record.status !== "REJECTED" && (
            <Button
              size="small"
              danger
              icon={<XCircle className="w-3 h-3" />}
              onClick={() => handleStatusChange(record.id, "REJECTED")}
            />
          )}
          <Popconfirm title="Delete record?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<Trash2 className="w-3 h-3" />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-red-700" />
            <span>Alumni Directory & Moderation Queue</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review public alumni join submissions, verify consent, and feature notable alumni stories on the website.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}
