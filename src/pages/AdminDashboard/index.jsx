import { useState, useEffect } from 'react';
import { Layout, Card, Table, Row, Col, Input, Statistic, Badge, Avatar } from 'antd';
import { TeamOutlined, BankOutlined, SearchOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import api from '@/config/api';

// Sub-components
import GlobalTransaction from './GlobalTransaction';
import Verification from './Verification';
import BankReport from './BankReport';
import SecurityLimit from './SecurityLimit';
import ManageUser from './ManageUser';

const { Header, Content } = Layout;

// Dashboard ka Overview Component (Main Page)
const AdminOverview = ({ stats, users, loading }) => {
    const columns = [
        { title: 'Full Name', dataIndex: 'fullName', key: 'fullName', render: (text) => <span className="font-semibold">{text}</span> },
        { title: 'Account #', dataIndex: 'accountNumber', key: 'accountNumber' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance', render: (val) => `Rs. ${val.toLocaleString()}` },
        { title: 'Email', dataIndex: 'email', key: 'email' },
    ];

    return (
        <>
            {/* Stats Row */}
            <Row gutter={[24, 24]} className="mb-8">
                {stats.map((s, i) => (
                    <Col key={i} xs={24} sm={12} lg={6}>

                        <Card loading={loading} className="rounded-3xl border-none shadow-sm transition-transform hover:scale-[1.02]">
                            <Statistic
                                title={<span className="font-bold tracking-wider text-slate-400">{s.title.toUpperCase()}</span>}
                                value={s.value}
                                prefix={<span className="mr-2 text-blue-500">{s.icon}</span>}
                                styles={{ content: { fontWeight: 800, color: '#1e293b', fontSize: '1.75rem' } }}
                            />
                        </Card>

                    </Col>
                ))}
            </Row>

            {/* Users List Table */}
            <Card title={<span className="font-bold text-lg text-slate-800">Quick User Management</span>}
                className="rounded-3xl border-none shadow-sm overflow-hidden">

                <Table loading={loading} dataSource={users} columns={columns} rowKey="_id"
                    scroll={{ x: 600 }} pagination={{ pageSize: 5, size: 'small' }} />

            </Card>

        </>
    );
};

const AdminDashboard = () => {

    const [stats, setStats] = useState([
        { title: 'Total Users', value: 0, icon: <TeamOutlined /> },
        { title: 'Liquidity', value: 'Rs. 0', icon: <BankOutlined /> },
    ]);

    const [allUsers, setAllUsers] = useState([]);
    const [adminInfo, setAdminInfo] = useState({ fullName: 'Admin', profileImage: '' });
    const [loading, setLoading] = useState(true);

    // Backend se data mangwane ke liye useEffect
    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const token = localStorage.getItem('token'); // JWT token
                // APIs Calling (Using central api instance)
                const [statsRes, usersRes] = await Promise.all([
                    api.get('/admin/dashboard-stats'),
                    api.get('/admin/all-users')
                ]);

                setStats([
                    { title: 'Total Users', value: statsRes.data.totalUsers, icon: <TeamOutlined /> },
                    { title: 'Liquidity', value: statsRes.data.totalLiquidity, icon: <BankOutlined /> },
                ]);

                setAllUsers(usersRes.data);
                // Admin ki info set karein (Pehla user admin hai ya separate profile API se)
                setAdminInfo(usersRes.data.find(u => u.role === 'admin') || { fullName: 'Admin' });

                setLoading(false);

            }
            catch (error) {
                console.error("Dashboard Error:", error);
                // message.error("Connection Refused! Check if Backend is running on port 8000");
                setLoading(false);
            }
        };

        fetchDashboardData();

    }, []);

    return (

        <Layout className="min-h-screen bg-[#f8fafc]">

            <Sidebar />

            <Layout className="bg-transparent">

                <Header className="!bg-white !px-6 flex items-center justify-between h-16 sticky top-0 z-10 shadow-sm">

                    <div className="flex items-center gap-4 w-full max-w-lg">

                        <Input allowClear prefix={<SearchOutlined className="text-gray-400" />} placeholder="Global Search..." size="large" className="!rounded-lg !bg-gray-100 border-none" />

                    </div>

                    <div className="flex items-center gap-6">

                        <Badge dot><BellOutlined className="text-lg text-gray-500 cursor-pointer" /></Badge>

                        <div className="h-6 w-px bg-gray-200" />

                        {/* Functional Admin Avatar with Cloudinary Link */}
                        <div className="flex items-center gap-3">

                            <Avatar size="middle" className="bg-black shadow-sm" src={adminInfo.profileImage || null} icon={!adminInfo.profileImage && <UserOutlined />}>
                                {/* Agar image na ho to naam ka pehla letter dikhayen */}
                                {!adminInfo.profileImage && adminInfo.fullName?.charAt(0)}
                            </Avatar>

                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800 leading-none">
                                    {adminInfo.fullName}
                                </span>
                            </div>

                        </div>
                    </div>

                </Header>

                <Content className="p-4 sm:p-6 lg:p-10">
                    <Routes>
                        <Route index element={<AdminOverview stats={stats} users={allUsers} loading={loading} />} />
                        <Route path="global-transaction" element={<GlobalTransaction />} />
                        <Route path="verification" element={<Verification />} />
                        <Route path="bank-report" element={<BankReport />} />
                        <Route path="security-limit" element={<SecurityLimit />} />
                        <Route path="manage-user" element={<ManageUser />} />
                    </Routes>
                </Content>

            </Layout>

        </Layout>

    );
};

export default AdminDashboard;