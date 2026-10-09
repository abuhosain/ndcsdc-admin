import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Popconfirm, Tag, message } from "antd";
import { Plus, Edit2, Trash2, Award } from "lucide-react";
import { achievementsApi } from "../../services/api";

export default function AchievementsAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await achievementsApi.getAdminAchievements();
      setData(res.data || []);
    } catch (err: any) {
      message.error(err.message || "Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item?: any) => {
    setEditingItem(item || null);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
      form.setFieldsValue({ year: "2025", category: "Milestone", isVisible: true, sortOrder: 0 });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await achievementsApi.updateAchievement(editingItem.id, values);
        message.success("Achievement updated.");
      } else {
        await achievementsApi.createAchievement(values);
        message.success("Achievement created.");
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      message.error(err.message || "Failed to save achievement.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await achievementsApi.deleteAchievement(id);
      message.success("Achievement deleted.");
      loadData();
    } catch (err: any) {
      message.error(err.message || "Failed to delete.");
    }
  };

  const columns = [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      width: 100,
      render: (yr: string) => <Tag color="blue">{yr}</Tag>,
    },
    {
      title: "Metric (Large Numeral)",
      dataIndex: "metric",
      key: "metric",
      render: (m: string) => <span className="font-bold text-red-700 text-base">{m}</span>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t: string) => <span className="font-semibold text-neutral-900">{t}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 130,
    },
    {
      title: "Visible",
      dataIndex: "isVisible",
      key: "isVisible",
      width: 100,
      render: (v: boolean) => <Tag color={v ? "green" : "default"}>{v ? "Active" : "Hidden"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Button size="small" icon={<Edit2 className="w-3.5 h-3.5" />} onClick={() => handleOpenModal(record)} />
          <Popconfirm title="Delete this achievement?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<Trash2 className="w-3.5 h-3.5" />} />
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
            <Award className="w-6 h-6 text-red-700" />
            <span>Achievements & Impact</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage quantified milestones, participant numbers, and accolades displayed on the public portal.
          </p>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenModal()}
          className="bg-red-700 hover:bg-red-800 font-semibold"
        >
          Add Milestone
        </Button>
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

      <Modal
        title={editingItem ? "Edit Achievement" : "New Milestone / Impact Record"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Save Record"
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
              <Input placeholder="e.g. 2025 or 2025-26" />
            </Form.Item>
            <Form.Item name="metric" label="Metric Numeral" rules={[{ required: true }]}>
              <Input placeholder="e.g. 5,200+ or 100%" />
            </Form.Item>
          </div>

          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Total Students Mentored" />
          </Form.Item>

          <Form.Item name="description" label="Description / Caption" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Brief summary of the achievement..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Category">
              <Input placeholder="e.g. Milestone, Impact, Summit" />
            </Form.Item>
            <Form.Item name="sortOrder" label="Sort Order">
              <InputNumber className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="isVisible" label="Display on Public Site" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
