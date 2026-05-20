import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Typography, Space, Collapse, Divider, Modal, Table, message, Card } from 'antd';
import {
    SafetyCertificateOutlined,
    ThunderboltOutlined,
    GlobalOutlined,
    QuestionCircleOutlined,
    ArrowRightOutlined,
    LockOutlined,
    WalletOutlined,
    EyeInvisibleOutlined, UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from 'antd';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Columns for the Rates Table
    const columns = [
        { title: 'Account Type', dataIndex: 'type', key: 'type', render: (t) => <Text strong>{t}</Text> },
        { title: 'Annual Profit', dataIndex: 'rate', key: 'rate', render: (r) => <Text className="text-blue-600 font-bold">{r}</Text> },
        { title: 'Min. Balance', dataIndex: 'min', key: 'min' },
    ];

    const dummyRates = [
        { key: '1', type: 'Savings Account', rate: '12.5%', min: 'Rs. 500' },
        { key: '2', type: 'Junior Wallet', rate: '8.0%', min: 'Rs. 0' },
        { key: '3', type: 'Corporate Account', rate: '10.2%', min: 'Rs. 10,000' },
    ];

    return (
        <div className="bg-[#fcfcfd] min-h-screen overflow-x-hidden">

            {/* --- 1. PREMIUM HERO SECTION --- */}
            <section className="relative pt-20 pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

                    {/* Left: Content */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-[12px] uppercase tracking-wider">
                            <SafetyCertificateOutlined /> Secure & SBP Regulated
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                            The future of <br />
                            <span className="text-blue-600">Digital Banking.</span>
                        </h1>

                        <Paragraph className="text-lg text-slate-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Open a bank account instantly with 99% approval rate. Experience fast transactions, smart savings vaults, and zero hidden fees.
                        </Paragraph>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            {user ? (
                                <Button type="primary" size="large" className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-lg font-bold border-none flex items-center gap-2" onClick={() => navigate('/dashboard')}>
                                    Go to Dashboard <ArrowRightOutlined />
                                </Button>
                            ) : (
                                <Button type="primary" size="large" className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-2xl shadow-blue-200 border-none" onClick={() => navigate('/auth/register')}>
                                    Open Free Account
                                </Button>
                            )}
                            <Button size="large" onClick={() => setIsModalOpen(true)} className="h-16 px-8 rounded-2xl font-bold text-lg border-slate-200 hover:border-blue-600">
                                View Rates
                            </Button>
                        </div>
                    </div>

                    {/* Right: Floating App UI */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 w-72 h-[580px] bg-white rounded-[3rem] border-[3px] border-slate-900 mx-auto">
                            <div className="p-6 pt-10">
                                <div className="flex justify-between items-center mb-8">
                                    <Avatar size={40} icon={<UserOutlined />} className="bg-blue-100 text-blue-600 border-none" />
                                    <Text strong className="text-slate-400">DigitalBank</Text>
                                    <ThunderboltOutlined className="text-blue-600 text-xl" />
                                </div>

                                <div className="bg-slate-400 rounded-3xl p-6 mb-6 text-white">
                                    <Text className="text-slate-400 text-xs block mb-1">Current Balance</Text>
                                    <Title level={3} className="text-white m-0 tracking-tight flex items-center gap-2">
                                        Rs. ••••••• <EyeInvisibleOutlined className="text-slate-400 text-sm" />
                                    </Title>
                                </div>

                                <div className="space-y-4">
                                    <Text strong className="text-[10px] uppercase text-slate-400 tracking-widest">Recent Activity</Text>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl" />
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 w-20 bg-slate-100 rounded" />
                                                <div className="h-2 w-12 bg-slate-50 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Decorative Background Circles */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50 -z-0" />
                    </div>
                </div>
            </section>

            {/* --- 2. FEATURES GRID --- */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <Text className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px]">Why Choose Us</Text>
                        <Title level={2} className="text-4xl font-black mt-2">Everything you expect <br /> from a modern bank.</Title>
                    </div>

                    <Row gutter={[24, 24]}>
                        {[
                            { icon: <LockOutlined />, title: 'Bank-Grade Security', desc: 'Protected by AES-256 encryption and SBP certified sandbox protocols.' },
                            { icon: <ThunderboltOutlined />, title: 'Instant Transfers', desc: 'Send money to any bank in Pakistan via RAAST in milliseconds.' },
                            { icon: <GlobalOutlined />, title: 'Borderless Banking', desc: 'Manage your finances globally with our virtual Visa debit cards.' },
                        ].map((feat, i) => (
                            <Col xs={24} md={8} key={i}>
                                <Card className="h-full rounded-3xl border-none bg-slate-50 hover:bg-white hover:shadow-xl transition-all p-4 group">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                                        {feat.icon}
                                    </div>
                                    <Title level={4} className="mb-4">{feat.title}</Title>
                                    <Paragraph className="text-slate-500 leading-relaxed">{feat.desc}</Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* --- 3. TRUST BAR --- */}
            <div className="py-16 border-y border-slate-100 bg-[#fcfcfd]">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 lg:justify-between items-center opacity-30 grayscale hover:grayscale-0 transition-all">
                    <Title level={4} className="m-0 uppercase tracking-[0.3em] text-slate-400 text-xs">Security Partners</Title>
                    <Title level={3} className="m-0 font-serif">RAAST</Title>
                    <Title level={3} className="m-0 font-sans font-black">PCI-DSS</Title>
                    <Title level={3} className="m-0 font-mono italic">SBP-Verified</Title>
                    <Title level={3} className="m-0 font-bold">VISA</Title>
                </div>
            </div>

            {/* --- 4. FAQ SECTION --- */}
            <section className="py-32 px-6 max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <Title level={2} className="font-black">Common Questions</Title>
                </div>
                <Collapse
                    accordion
                    ghost
                    expandIconPosition="end"
                    items={[
                        {
                            key: '1',
                            label: <Text className="font-bold text-lg text-slate-800">Is my money safe with DigitalBank?</Text>,
                            children: <Paragraph className="text-slate-500 py-2">Yes. We are licensed by the State Bank of Pakistan and all deposits are protected under the Deposit Protection Corporation (DPC) up to Rs. 500,000 per depositor.</Paragraph>,
                        },
                        {
                            key: '2',
                            label: <Text className="font-bold text-lg text-slate-800">How do I order a Physical Card?</Text>,
                            children: <Paragraph className="text-slate-500 py-2">Once your account is verified, you can order your metallic card directly from the App dashboard under the 'Cards' tab.</Paragraph>,
                        }
                    ]}
                />
            </section>

            {/* --- 5. RATES MODAL --- */}
            <Modal
                title={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={700}
                centered
                className="rounded-3xl overflow-hidden"
            >
                <div className="p-4">
                    <Title level={3} className="mb-6">Annual Banking Rates</Title>
                    <Table
                        dataSource={dummyRates}
                        columns={columns}
                        pagination={false}
                        className="custom-table"
                    />
                    <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex items-center gap-3">
                        <SafetyCertificateOutlined className="text-blue-600 text-xl" />
                        <Text className="text-blue-800 text-[11px] font-bold">These rates are regulated by the SBP and subject to quarterly revisions.</Text>
                    </div>
                </div>
            </Modal>

            {/* Global Style Injector */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .ant-collapse-header { padding: 24px 0 !important; border-bottom: 1px solid #f1f5f9 !important; }
                .ant-collapse-content-box { padding-left: 0 !important; }
                .custom-table .ant-table-thead > tr > th { background: #f8fafc !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8 !important; }
            `}} />
        </div>
    );
};

export default Home;