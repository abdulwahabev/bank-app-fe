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
            width: 200,
            render: (_, record) => (
                /* Arbitrary aur break classes ko safe inline styles mein badal diya hai */
                <div style={{ minWidth: '180px' }}>
                    <div 
                        style={{ wordBreak: 'break-word', fontWeight: 'bold' }} 
                        className="text-slate-800"
                    >
                        {record.fullName}
                    </div>
                    <div 
                        style={{ wordBreak: 'break-all' }} 
                        className="text-xs text-slate-400"
                    >
                        {record.email}
                    </div>
                </div>
            )
        },
        { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 140 },
    ];

    // --- Active Tab Columns ---
    const activeColumns = [
        ...baseColumns,
        { title: 'Account #', dataIndex: 'accountNumber', key: 'acc', width: 150 },
        {
            title: 'Balance',
            dataIndex: 'balance',
            width: 140,
            render: (bal) => <span className="text-green-600 font-bold whitespace-nowrap">Rs. {bal?.toLocaleString()}</span>
        },
        {
            title: 'Card Status',
            width: 120,
            render: (_, record) => (
                <Tag color={record.cardDetails?.isFrozen ? 'volcano' : 'green'} className="m-0">
                    {record.cardDetails?.isFrozen ? 'FROZEN' : 'ACTIVE'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space size="middle" className="whitespace-nowrap">
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
        { title: 'CNIC', dataIndex: ['kycDetails', 'cnic'], key: 'cnic', width: 150 },
        { title: 'Initial Deposit', dataIndex: ['kycDetails', 'initialDeposit'], width: 140, render: (d) => <span className="whitespace-nowrap">Rs. {d}</span> },
        {
            title: 'Address',
            dataIndex: ['kycDetails', 'address'],
            key: 'address',
            ellipsis: true,
            width: 200,
            render: (addr) => <Tooltip title={addr}>{addr}</Tooltip>
        },
        {
            title: 'Approval',
            key: 'approve',
            width: 130,
            render: (_, record) => (
                <Button
                type="primary"
                icon={<CheckOutlined />}
                /* Hover state aur background ko direct style props se control kiya hai taake compiler strictness pass ho jaye */
                style={{ 
                    backgroundColor: '#16a34a', 
                    borderColor: '#16a34a' 
                }}
                /* CSS variables ka use karr ke hover state handle ki hai, jisse VS code ko koi shikayat nahi hogi */
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#15803d';
                    e.currentTarget.style.borderColor = '#15803d';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#16a34a';
                    e.currentTarget.style.borderColor = '#16a34a';
                }}
                className="border-none rounded-lg whitespace-nowrap"
                onClick={() => handleApprove(record._id)}
            >
                Approve
            </Button>
            )
        },
        {
            title: 'Reject',
            width: 100,
            render: (_, record) => <Button type="text" danger className="whitespace-nowrap" onClick={() => handleDelete(record._id)}>Reject</Button>
        }
    ];

    // Data Filtering
    const pendingData = users.filter(u => u.status === 'pending');
    const activeData = users.filter(u => u.status === 'active');

    const tabItems = [
        {
            key: '1',
            label: <span><ClockCircleOutlined /> Pending ({pendingData.length})</span>,
            /* Scroll configuration ko clean kiya taake alignment break na ho */
            children: (
                <div className="w-full overflow-x-auto">
                    <Table
                        dataSource={pendingData}
                        columns={pendingColumns}
                        rowKey="_id"
                        loading={loading}
                        scroll={{ x: 800 }}
                    />
                </div>
            )
        },
        {
            key: '2',
            label: <span><UserOutlined /> Active ({activeData.length})</span>,
            children: (
                <div className="w-full overflow-x-auto">
                    <Table
                        dataSource={activeData}
                        columns={activeColumns}
                        rowKey="_id"
                        loading={loading}
                        scroll={{ x: 850 }}
                    />
                </div>
            )
        }
    ];

    return (
        /* Padding aur borders ko choti screens ke liye container responsive kiya */
        <Card className="rounded-2xl md:rounded-3xl shadow-lg border-none p-2 md:p-6 bg-white">
            {/* Inline style ka use karke !mb-6 ke error ko permanently theek kiya hai */}
            <Title level={2} style={{ marginBottom: '24px' }} className="text-slate-700 italic text-xl md:text-2xl">
                Bank Administration
            </Title>
            <Tabs defaultActiveKey="1" items={tabItems} className="custom-tabs" />
        </Card>
    );
};

export default ManageUser;