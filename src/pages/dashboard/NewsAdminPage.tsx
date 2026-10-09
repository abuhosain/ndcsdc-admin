import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Switch, Popconfirm, Tag, message } from "antd";
import { Plus, Edit2, Trash2, Newspaper, Pin } from "lucide-react";
import { newsApi } from "../../services/api";

export default function NewsAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await newsApi.getAdminNews();
      setData(res.data || []);
    } catch (err: any) {
      message.error(err.message || "Failed to load news");
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
      form.setFieldsValue({ category: "Announcement", isPinned: false, status: "PUBLISHED" });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await newsApi.updateNews(editingItem.id, values);
        message.success("News article updated.");
      } else {
        await newsApi.createNews(values);
        message.success("News article published.");
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      message.error(err.message || "Failed to save news.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await newsApi.deleteNews(id);
      message.success("Article deleted.");
      loadData();
    } catch (err: any) {
      message.error(err.message || "Failed to delete.");
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 140,
      render: (c: string, r: any) => (
        <div className="flex items-center gap-1.5">
          {r.isPinned && <Pin className="w-3.5 h-3.5 text-red-700" />}
          <Tag color="volcano">{c}</Tag>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t: string) => <span className="font-semibold text-neutral-900">{t}</span>,
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
      ellipsis: true,
    },
    {
      title: "Published At",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 130,
      render: (d: string) => (d ? new Date(d).toLocaleDateString() : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Button size="small" icon={<Edit2 className="w-3.5 h-3.5" />} onClick={() => handleOpenModal(record)} />
          <Popconfirm title="Delete this article?" onConfirm={() => handleDelete(record.id)}>
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
            <Newspaper className="w-6 h-6 text-red-700" />
            <span>News & Announcements</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Publish official announcements, press releases, result notifications, and pinned bulletins.
          </p>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenModal()}
          className="bg-red-700 hover:bg-red-800 font-semibold"
        >
          Publish Article
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
        title={editingItem ? "Edit Announcement" : "Create Official Announcement"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Publish"
        width={640}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Announcement">Announcement</Select.Option>
                <Select.Option value="Notice">Notice</Select.Option>
                <Select.Option value="Result">Result</Select.Option>
                <Select.Option value="Press">Press</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="isPinned" label="Pin as Important Notice" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <Form.Item name="title" label="Article Headline / Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Delegate Registration Opens for NACS 2026" />
          </Form.Item>

          <Form.Item name="summary" label="Summary / Short Excerpt" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Brief summary shown on listings..." />
          </Form.Item>

          <Form.Item name="body" label="Full Article Content">
            <Input.TextArea rows={5} placeholder="Full content and guidelines..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
