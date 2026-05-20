import React, { useState, useEffect } from 'react';
import { Card, Switch, InputNumber, Button, Alert, Row, Col, Typography, Space, message } from 'antd';
import { LockOutlined, SafetyCertificateOutlined, DashboardOutlined, SaveOutlined } from '@ant-design/icons';
import api from '@/config/api';

const { Title, Text } = Typography;

const SecurityLimit = () => {
    // State to manage limits
    const [limits, setLimits] = useState({
        maxDailyTransfer: 250000,
        perTransactionLimit: 50000,
        allowInternational: true
    });
    const [loading, setLoading] = useState(false);

    // 1. BACKEND SE DATA FETCH KARNA
    const fetchLimits = async () => {
        try {
            const res = await api.get('/admin/get-security-settings');
            if (res.data) {
                setLimits(res.data);
            }
        } catch (err) {
            console.error("Error fetching limits:", err);
            message.error("Failed to load security settings");
        }
    };

    useEffect(() => {
        fetchLimits();
    }, []);

    // 2. BACKEND PAR DATA SAVE KARNA
    const handleSave = async () => {
        setLoading(true);
        const hide = message.loading('Updating system limits...', 0);

        try {
            await api.post('/admin/update-security-settings', limits);
            message.success('Security updated successfully!');
        } catch (err) {
            message.error('Update failed! Check backend API.');
        } finally {
            hide();
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen">
            <div className="mb-8">
                <Title level={2} className="!font-black !text-slate-800 tracking-tighter m-0 uppercase">
                    Security & Guardrails
                </Title>
                <Text className="text-slate-500 font-medium italic">
                    Configure global transaction thresholds and access controls.
                </Text>
            </div>

            <Alert
                title="Active Protection: System Security Status is High"
                description="All protocols are currently following the 2026 Audit Standard."
                type="success"
                showIcon icon={<SafetyCertificateOutlined />}
                className="mb-8 rounded-[1.5rem] border-none shadow-sm p-4 font-bold"
            />

            <Row gutter={[24, 24]}>
                {/* TRANSACTION CONTROLS */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<Space><LockOutlined className="text-blue-600" /><span>Transaction Controls</span></Space>}
                        className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-shadow">

                        <div className="flex justify-between items-center mb-6 py-2 border-b border-slate-50">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700">Allow International Transfers</span>
                                <Text className="text-[10px] text-slate-400">Enable SWIFT/SEPA network access</Text>
                            </div>
                            <Switch
                                checked={limits.allowInternational}
                                onChange={(checked) => setLimits({ ...limits, allowInternational: checked })}
                                className="bg-slate-300"
                            />
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700">Two-Factor Auth (2FA)</span>
                                <Text className="text-[10px] text-slate-400">Mandatory for all admin actions</Text>
                            </div>
                            <Switch checked disabled />
                        </div>
                    </Card>
                </Col>

                {/* THRESHOLD LIMITS */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<Space><DashboardOutlined className="text-blue-600" /><span>Threshold Limits</span></Space>}
                        className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="mb-6">
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
                                Max Daily Transfer (PKR)
                            </label>
                            <InputNumber
                                value={limits.maxDailyTransfer}
                                onChange={(val) => setLimits({ ...limits, maxDailyTransfer: val })}
                                formatter={value => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/Rs\.\s?|(,*)/g, '')}
                                className="w-full rounded-2xl bg-slate-50 border-none h-12 flex items-center font-bold text-lg"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
                                Per Transaction Limit
                            </label>
                            <InputNumber
                                value={limits.perTransactionLimit}
                                onChange={(val) => setLimits({ ...limits, perTransactionLimit: val })}
                                formatter={value => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/Rs\.\s?|(,*)/g, '')}
                                className="w-full rounded-2xl bg-slate-50 border-none h-12 flex items-center font-bold text-lg"
                            />
                        </div>

                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            block
                            loading={loading}
                            className="rounded-2xl h-14 bg-blue-600 hover:bg-blue-700 font-bold shadow-xl shadow-blue-100 uppercase tracking-tight transition-all"
                            onClick={handleSave}
                        >
                            Update Security Policy
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SecurityLimit;