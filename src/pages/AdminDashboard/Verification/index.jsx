import React, { useState, useEffect } from 'react';
import { Card, Button, message, Spin, Empty, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '@/config/api';

const Verification = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {

        setLoading(true);

        try {
            // Hum pending-applications endpoint use karenge jo sirf pending users deta hai
            const res = await api.get('/admin/pending-applications');

            // Backend format: { success: true, data: [...] }
            setUsers(res.data.data || []);
        }
        catch (err) {
            message.error("Data load nahi ho saka!");
        }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAction = async (id, status) => {

        try {
            // status can be 'active' (for approve) or 'rejected'
            await api.patch(`/admin/verify-kyc/${id}`, { status });
            message.success(`User marked as ${status === 'active' ? 'Approved' : 'Rejected'}`);
            fetchUsers();
        }
        catch (err) {
            message.error("Action failed");
        }
    };

    if (loading)
        return (
            <div className="p-20 text-center">
                <Spin size="large" description="Fetching Requests..." />
            </div>
        );

    return (

        <div className="p-8 bg-[#f8fafc] min-h-screen">

            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight m-0 uppercase">KYC Requests</h1>
                    <p className="text-slate-500">Manage user identity verifications</p>
                </div>
                <SafetyCertificateOutlined className="text-4xl text-blue-200" />
            </div>

            {users.length === 0 ? (
                <Card className="rounded-[2.5rem] border-none shadow-sm p-16 text-center">
                    <Empty description="Koi pending request nahi mili" />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {users.map(user => (
                        <Card key={user._id} className="rounded-[2rem] border-none shadow-md hover:shadow-xl transition-all overflow-hidden bg-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div>
                                    <h3 className="m-0 font-bold text-slate-800 text-lg">{user.fullName}</h3>
                                    <Tag color="orange" className="rounded-full border-none px-3 font-bold text-[10px]">PENDING REVIEW</Tag>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mb-6 px-1 text-xs text-slate-500 font-medium">
                                <div className="flex justify-between"><span>CNIC:</span> <span className="text-slate-900 font-bold">{user.kycDetails?.cnic || "N/A"}</span></div>
                                <div className="flex justify-between"><span>Email:</span> <span className="text-slate-900 font-bold">{user.email}</span></div>
                                <div className="flex justify-between"><span>Phone:</span> <span className="text-slate-900 font-bold">{user.phone}</span></div>
                                <div className="flex justify-between"><span>Initial Deposit:</span> <span className="text-green-600 font-bold">Rs. {user.kycDetails?.initialDeposit?.toLocaleString()}</span></div>
                                <div className="mt-2 flex flex-col">
                                    <span className="mb-1">Address:</span>
                                    <span className="text-slate-900 font-bold bg-slate-50 p-2 rounded-lg leading-relaxed">{user.kycDetails?.address || "N/A"}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">

                                <Button type="primary" icon={<CheckCircleOutlined />} className="flex-1 rounded-2xl bg-green-600 h-12 font-bold border-none shadow-lg shadow-green-100" onClick={() => handleAction(user._id, 'active')}>
                                    Approve
                                </Button>

                                <Button danger icon={<CloseCircleOutlined />} className="flex-1 rounded-2xl h-12 font-bold bg-red-50 text-red-600 border-none hover:bg-red-100" onClick={() => handleAction(user._id, 'rejected')}>
                                    Reject
                                </Button>

                            </div>

                        </Card>
                    ))}

                </div>
            )}

        </div>

    );
};

export default Verification;