import React, { useState } from 'react';
import { Layout, Tag, Avatar, Modal, Descriptions, Button, Divider } from 'antd';
import { UserOutlined, MailOutlined, BankOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Transfer from '@/pages/Dashboard/Transfer';
import History from '@/pages/Dashboard/History';
import MyCard from '@/pages/Dashboard/MyCard';
import Overview from '@/pages/Dashboard/Overview';
import NoPages from '@/components/NoPages';

const { Header, Content } = Layout;

const Dashboard = () => {
    const { user } = useAuth();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Modal kholne ka function
    const showProfile = () => setIsProfileModalOpen(true);
    // Modal band karne ka function
    const handleClose = () => setIsProfileModalOpen(false);

    return (

        <Layout className="min-h-screen bg-[#fcfdfe]">

            <Sidebar />

            <Layout className="bg-transparent">

                <Header className="!bg-white !px-6 flex items-center justify-between h-16 border-b border-gray-200">

                    {/* LEFT: Greeting */}
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs text-gray-500"><b>Welcome back</b></span>
                        <h1 className="text-base font-semibold text-gray-800 m-0">
                            {user?.fullName || "User"}
                        </h1>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center gap-6">
                        {/* Clickable Avatar */}
                        <div onClick={showProfile} className="cursor-pointer hover:opacity-80 transition-all">
                            <Avatar size="medium" className="bg-blue-600 font-bold">
                                {user?.fullName?.charAt(0).toUpperCase() || "U"}
                            </Avatar>
                        </div>
                    </div>

                </Header>

                {/* --- USER PROFILE MODAL --- */}
                <Modal
                    title={<span className="text-lg font-bold">User Account Details</span>}
                    open={isProfileModalOpen}
                    onCancel={handleClose}
                    footer={[
                        <Button key="close" type="primary" onClick={handleClose} className="rounded-lg bg-blue-600">
                            Done
                        </Button>
                    ]}
                    centered
                    borderRadius={20}
                    width={500}
                >
                    <div className="flex flex-col items-center py-6">
                        <Avatar size={80} className="bg-blue-600 text-2xl font-bold mb-4">
                            {user?.fullName?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                        <h2 className="text-xl font-bold text-gray-800 m-0">{user?.fullName}</h2>
                        <Tag color="blue" className="mt-2 rounded-full border-none px-3 font-bold uppercase text-[10px]">Bank Member</Tag>
                    </div>

                    <Divider className="my-2" />

                    <div className="space-y-4 p-4">
                        <div className="flex items-center gap-4">
                            <MailOutlined className="text-blue-500 text-lg" />
                            <div>
                                <p className="text-gray-400 text-[10px] uppercase font-bold m-0 tracking-widest">Email Address</p>
                                <p className="text-gray-800 font-semibold m-0">{user?.email || "n/a"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <BankOutlined className="text-blue-500 text-lg" />
                            <div>
                                <p className="text-gray-400 text-[10px] uppercase font-bold m-0 tracking-widest">Account Number</p>
                                <p className="text-gray-800 font-mono font-bold m-0">{user?.accountNumber || "PK 8824 9921 0012"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <SafetyOutlined className="text-blue-500 text-lg" />
                            <div>
                                <p className="text-gray-400 text-[10px] uppercase font-bold m-0 tracking-widest">Security Status</p>
                                <Tag color="green" className="m-0 border-none font-bold">Verified</Tag>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Content className="p-10">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/transfer" element={<Transfer />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/cards" element={<MyCard />} />
                        <Route path="*" element={<NoPages />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;