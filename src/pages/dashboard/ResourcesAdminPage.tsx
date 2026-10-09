import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, InputNumber, Popconfirm, Tag, message } from "antd";
import { Plus, Edit2, Trash2, BookOpen, ExternalLink } from "lucide-react";
import { resourcesApi } from "../../services/api";

export default function ResourcesAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await resourcesApi.getAdminResources();
      setData(res.data || []);
    } catch (err: any) {
      message.error(err.message || "Failed to load resources");
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
      form.setFieldsValue({ category: "Admission Guides", type: "PDF", sortOrder: 0 });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await resourcesApi.updateResource(editingItem.id, values);
        message.success("Resource updated.");
      } else {
        await resourcesApi.createResource(values);
        message.success("Resource added.");
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      message.error(err.message || "Failed to save resource.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await resourcesApi.deleteResource(id);
      message.success("Resource deleted.");
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
      width: 170,
      render: (cat: string) => <Tag color="geekblue">{cat}</Tag>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 90,
      render: (t: string) => <Tag color="purple">{t}</Tag>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t: string, r: any) => (
        <div>
          <span className="font-semibold text-neutral-900 block">{t}</span>
          {r.url && (
            <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <span>{r.url}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Button size="small" icon={<Edit2 className="w-3.5 h-3.5" />} onClick={() => handleOpenModal(record)} />
          <Popconfirm title="Delete this resource?" onConfirm={() => handleDelete(record.id)}>
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
            <BookOpen className="w-6 h-6 text-red-700" />
            <span>Resources & Opportunities</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage admission guides, study compendiums, scholarships, internships, and student competition links.
          </p>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenModal()}
          className="bg-red-700 hover:bg-red-800 font-semibold"
        >
          Add Resource
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
        title={editingItem ? "Edit Resource" : "Add Resource or Opportunity"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="Save"
        width={600}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Admission Guides">Admission Guides</Select.Option>
                <Select.Option value="Study Material">Study Material</Select.Option>
                <Select.Option value="Scholarships">Scholarships</Select.Option>
                <Select.Option value="Internships & Jobs">Internships & Jobs</Select.Option>
                <Select.Option value="Competitions">Competitions</Select.Option>
                <Select.Option value="Useful Links">Useful Links</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="type" label="Resource Type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="PDF">PDF Download</Select.Option>
                <Select.Option value="Guide">Web Guide</Select.Option>
                <Select.Option value="Link">External Link</Select.Option>
                <Select.Option value="Portal">Opportunity Portal</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Complete IBA DU BBA Admission Playbook" />
          </Form.Item>

          <Form.Item name="url" label="Resource URL / Download Link">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="description" label="Short Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Describe the guide contents..." />
          </Form.Item>

          <Form.Item name="sortOrder" label="Sort Order">
            <InputNumber className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
