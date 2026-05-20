import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Modal, message, Card, Tooltip, Tabs, Typography } from 'antd';
import { DeleteOutlined, StopOutlined, CheckCircleOutlined, CheckOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import api from '@/config/api';

const { Title } = Typography;

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Backend se saare users mangwa rahe hain
            const res = await api.get('/admin/all-users');
            setUsers(res.data);
        } catch (err) {
            window.toastify("Data fetch karne mein masla hua", "error");
        }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    // --- Approval Logic ---
    const handleApprove = async (id) => {
        try {
            const res = await api.patch(`/admin/verify-kyc/${id}`, { status: 'active' });
            if (res.data.success) {
                window.toastify(`Account Approved! No: ${res.data.user.accountNumber}`, "success");
                fetchUsers();
            }
        } catch (err) {
            window.toastify("Approval fail ho gayi", "error");
        }
    };

    // --- Freeze/Unfreeze Logic ---
    const handleToggleFreeze = async (id) => {
        try {
            await api.patch(`/admin/toggle-freeze/${id}`);
            message.success("User status updated");
            fetchUsers();
        } catch (err) {
            message.error("Action perform nahi ho saka");
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Delete User Account?',
            content: 'Kya aap waqai is account ko hamesha ke liye delete karna chahte hain?',
            okText: 'Yes, Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await api.delete(`/admin/delete-user/${id}`);
                    message.success("User deleted");
                    fetchUsers();
                } catch (err) { message.error("Delete nahi ho saka"); }
            },
        });
    };

    // --- Common Columns ---
    const baseColumns = [
        {
            title: 'User Details',
            key: 'details',
            render: (_, record) => (
                <div>
                    <div className="font-bold text-slate-800">{record.fullName}</div>
                    <div className="text-xs text-slate-400">{record.email}</div>
                </div>
            )
        },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    ];

    // --- Active Tab Columns ---
    const activeColumns = [
        ...baseColumns,
        { title: 'Account #', dataIndex: 'accountNumber', key: 'acc' },
        {
            title: 'Balance',
            dataIndex: 'balance',
            render: (bal) => <b className="text-green-600">Rs. {bal?.toLocaleString()}</b>
        },
        {
            title: 'Card Status',
            render: (_, record) => (
                <Tag color={record.cardDetails?.isFrozen ? 'volcano' : 'green'}>
                    {record.cardDetails?.isFrozen ? 'FROZEN' : 'ACTIVE'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={record.cardDetails?.isFrozen ? "Unfreeze" : "Freeze"}>
                        <Button shape="circle" icon={record.cardDetails?.isFrozen ? <CheckCircleOutlined /> : <StopOutlined />} danger={!record.cardDetails?.isFrozen} onClick={() => handleToggleFreeze(record._id)} />
                    </Tooltip>
                    <Button shape="circle" type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
                </Space>
            ),
        }
    ];

    // --- Pending Tab Columns ---
    const pendingColumns = [
        ...baseColumns,
        { title: 'CNIC', dataIndex: ['kycDetails', 'cnic'], key: 'cnic' },
        { title: 'Initial Deposit', dataIndex: ['kycDetails', 'initialDeposit'], render: (d) => `Rs. ${d}` },
        { 
            title: 'Address', 
            dataIndex: ['kycDetails', 'address'], 
            key: 'address',
            ellipsis: true,
            render: (addr) => <Tooltip title={addr}>{addr}</Tooltip>
        },
        {
            title: 'Approval',
            key: 'approve',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    className="bg-green-600 hover:!bg-green-700 border-none rounded-lg"
                    onClick={() => handleApprove(record._id)}
                >
                    Approve
                </Button>
            )
        },
        {
            title: 'Reject',
            render: (_, record) => <Button type="text" danger onClick={() => handleDelete(record._id)}>Reject</Button>
        }
    ];

    // Data Filtering
    const pendingData = users.filter(u => u.status === 'pending');
    const activeData = users.filter(u => u.status === 'active');

    const tabItems = [
        {
            key: '1',
            label: <span><ClockCircleOutlined /> Pending Requests ({pendingData.length})</span>,
            children: <Table dataSource={pendingData} columns={pendingColumns} rowKey="_id" loading={loading} />
        },
        {
            key: '2',
            label: <span><UserOutlined /> Active Accounts ({activeData.length})</span>,
            children: <Table dataSource={activeData} columns={activeColumns} rowKey="_id" loading={loading} />
        }
    ];

    return (
        <Card className="rounded-3xl shadow-lg border-none">
            <Title level={2} className="!mb-6 text-slate-700 italic">Bank Administration</Title>
            <Tabs defaultActiveKey="1" items={tabItems} className="custom-tabs" />
        </Card>
    );
};

export default ManageUser;