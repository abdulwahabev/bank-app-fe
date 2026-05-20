import React, { useState, useEffect } from "react"; // Fixed: Added useEffect import
import { Card, Col, Row, Tag, Typography, Button, Progress, Modal } from "antd";
import {
    SendOutlined, SafetyCertificateOutlined, ThunderboltOutlined, ArrowUpOutlined, EyeOutlined, EyeInvisibleOutlined, WalletOutlined,
    HistoryOutlined, CreditCardOutlined, PlusCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/config/api";
import { InputNumber, message } from "antd";

const { Title, Text } = Typography;

const Overview = () => {
    const { user, readProfile } = useAuth();
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState(1000);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showBalance, setShowBalance] = useState(true);
    const [history, setHistory] = useState([]); // State for real transaction data

    // --- FUNCTIONAL LOGIC START ---
    const userData = user?.user || user;
    const currentBalance = userData?.balance ?? 0;
    const currentUserId = userData?._id || userData?.id;

    // 1. Fetch Transactions from API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/transactions/history');
                setHistory(res.data.history || []);
            } catch (err) {
                console.error("Stats fetch error:", err);
            }
        };
        fetchStats();
    }, [user]); // Re-fetch if user profile updates

    // 2. Monthly Spend Calculation (Based on your Transaction Model)
    // Filter: Agar user 'sender' hai aur type 'transfer' hai, ya type 'withdraw' hai.
    const monthlySpend = history
        .filter(t => {
            const isSender = (t.sender?._id || t.sender)?.toString() === currentUserId?.toString();
            return (t.type === 'transfer' && isSender) || t.type === 'withdraw';
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    // 3. Savings Calculation (Static 25% of balance for UI purpose)
    const savingsAmount = currentBalance * 0.25;

    // 4. Progress Bar Logic
    const totalCashFlow = currentBalance + monthlySpend;
    const spendProgress = totalCashFlow > 0 ? Math.round((monthlySpend / totalCashFlow) * 100) : 0;

    // 5. Security Level Logic
    const isSecurityHigh = userData?.isVerified || true;

    // --- DEPOSIT FUNCTION ---
    const handleDeposit = async () => {
        if (depositAmount < 1000) {
            return message.error("Minimum deposit is Rs. 1000");
        }
        setLoading(true);
        try {
            const res = await api.post('/transactions/deposit', { amount: depositAmount });

            if (res.data.success) {
                message.success(res.data.message);
                setIsDepositOpen(false);
                await readProfile(); // Refresh Auth State
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Deposit failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 bg-[#fbfcfd]"
            style={{ backgroundImage: `radial-gradient(at 80% 10%, hsla(210,100%,96%,1) 0px, transparent 50%),radial-gradient(at 20% 90%, hsla(210,100%,98%,1) 0px, transparent 50%)` }}>

            {/* SECTION 1: TOP CARDS */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <div className="relative h-[320px] rounded-[40px] overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-500 cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #1a1c2c 0%, #4a192c 100%)' }}>
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                        <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Text className="uppercase tracking-[4px] text-[10px] !text-white block mb-2 font-bold">Total Balance</Text>
                                    <div className="flex items-center gap-4">
                                        <Title level={1} className="!text-white !m-0 font-medium tracking-tight text-4xl md:text-5xl">
                                            {showBalance ? `Rs. ${Number(currentBalance).toLocaleString()}` : "••••••••"}
                                        </Title>
                                        <Button type="text" icon={showBalance ? <EyeInvisibleOutlined /> : <EyeOutlined />} className="text-white/50 hover:text-white" onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }} />
                                    </div>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="mc" className="h-10 opacity-80" />
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <Text className="!text-white font-mono tracking-widest text-lg md:text-xl block mb-1">
                                        {userData?.accountNumber ? `**** **** **** ${userData.accountNumber.toString().slice(-4)}` : '**** **** **** 8824'}
                                    </Text>
                                    <Text className="!text-white font-light tracking-widest uppercase text-[10px] opacity-80">
                                        {userData?.fullName || "Premium Member"}
                                    </Text>
                                </div>
                                <Button
                                    icon={<SendOutlined rotate={-45} />}
                                    className="bg-white text-black border-none rounded-2xl h-12 w-12 flex items-center justify-center shadow-xl hover:scale-110 transition-all"
                                    onClick={(e) => { e.stopPropagation(); navigate('/dashboard/transfer'); }}
                                />
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} lg={8}>
                    <Card className="h-full rounded-[40px] border-none shadow-xl bg-white flex items-center" hoverable>
                        <div className="space-y-8 w-full p-2">
                            <div className="space-y-1">
                                <Text className="text-slate-400 text-[10px] uppercase font-black tracking-[2px] block mb-2">Account Holder</Text>
                                <Title level={3} className="!m-0 !font-bold tracking-tight text-slate-800 uppercase text-lg">
                                    {userData?.fullName || "Active Member"}
                                </Title>
                                <Tag color="blue" className="rounded-full border-none text-[9px] font-bold mt-2">Verified Account</Tag>
                            </div>
                            <div className="space-y-1">
                                <Text className="text-slate-400 text-[10px] uppercase font-black tracking-[2px] block mb-2">Account Number</Text>
                                <Text className="text-slate-800 font-mono text-base tracking-[2px] font-bold">
                                    {userData?.accountNumber ? `PK ${userData.accountNumber}` : 'PK 8824 9921 0012'}
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* SECTION 2: FAST ACCESS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { icon: <PlusCircleOutlined />, label: "Add Money", color: "text-orange-600", action: "deposit" },
                    { icon: <SendOutlined />, label: "Send", color: "text-blue-500", path: "/dashboard/transfer" },
                    { icon: <CreditCardOutlined />, label: "Cards", color: "text-purple-500", path: "/dashboard/cards" },
                    { icon: <HistoryOutlined />, label: "History", color: "text-emerald-500", path: "/dashboard/history" },
                    { icon: <WalletOutlined />, label: "Wallet", color: "text-orange-500", action: "wallet" }
                ].map((item, i) => (
                    <div key={i}
                        onClick={() => {
                            if (item.action === "wallet") setIsWalletOpen(true);
                            else if (item.action === "deposit") setIsDepositOpen(true);
                            else navigate(item.path);
                        }}
                        className="bg-white p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border border-slate-50 group"
                    >
                        <div className={`${item.color} text-2xl transition-transform group-hover:scale-110`}>
                            {item.icon}
                        </div>
                        <span className="text-slate-600 font-black text-[10px] uppercase tracking-[2px]">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* SECTION 3: REFINED INSIGHTS */}
            <div>
                <div className="flex justify-between items-center mb-6 px-2">
                    <Title level={4} className="!m-0 !font-bold">Account Insights</Title>
                    <Button type="link" className="text-blue-600 font-bold" onClick={() => navigate('/dashboard/history')}>View Reports</Button>
                </div>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <Card className="rounded-[32px] border-none shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="p-3 bg-red-50 text-red-500 rounded-xl"><ArrowUpOutlined /></div>
                                    <Tag color="red" className="rounded-full border-none text-[10px] font-bold uppercase">Expense</Tag>
                                </div>
                                <div>
                                    <Text className="text-slate-400 text-xs block font-medium">Debit</Text>
                                    <Title level={3} className="!m-0 !font-bold">Rs. {monthlySpend.toLocaleString()}</Title>
                                </div>
                                <Progress percent={spendProgress} showInfo={false} strokeColor="#ff4d4f" size={{ height: 6 }} />
                                <Text className="text-[10px] text-slate-400 font-bold uppercase">{spendProgress}% of total cash flow</Text>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card className="rounded-[32px] border-none shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><ThunderboltOutlined /></div>
                                    <Tag color="green" className="rounded-full border-none text-[10px] font-bold uppercase">Savings</Tag>
                                </div>
                                <div>
                                    <Text className="text-slate-400 text-xs block font-medium">Available Credit</Text>
                                    <Title level={3} className="!m-0 !font-bold">Rs. {savingsAmount.toLocaleString()}</Title>
                                </div>
                                <Progress percent={25} showInfo={false} strokeColor="#10b981" size={{ height: 6 }} />
                                <Text className="text-[10px] text-slate-400 font-bold uppercase">25% Locked for Security</Text>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card className="rounded-[32px] border-none shadow-lg text-white group" style={{ background: '#0a39a7ff' }}>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="p-3 bg-white/10 text-blue-400 rounded-xl"><SafetyCertificateOutlined /></div>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-4 bg-blue-500 rounded-full animate-pulse" />
                                        <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                                        <div className={`w-1.5 h-4 rounded-full ${isSecurityHigh ? 'bg-blue-500' : 'bg-slate-700'}`} />
                                    </div>
                                </div>
                                <div>
                                    <Text className="text-white/50 text-[10px] uppercase font-bold tracking-widest block">Security Level</Text>
                                    <Title level={3} className="!m-0 !text-white !font-bold tracking-tight">Excellent</Title>
                                </div>
                                <Text className="text-blue-400 text-[9px] font-black uppercase tracking-widest">2FA & Encryption Active</Text>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* WALLET MODAL */}
            <Modal
                title={<span className="text-lg font-black uppercase tracking-widest text-slate-800">Wallet Summary</span>}
                open={isWalletOpen}
                onCancel={() => setIsWalletOpen(false)}
                footer={null} centered width={400} className="premium-modal"
            >
                <div className="space-y-6 py-4 text-center">
                    <div className="bg-orange-50 p-8 rounded-[30px] border border-orange-100">
                        <Text className="text-orange-400 text-[10px] uppercase font-black tracking-widest block mb-2">Total Wallet Balance</Text>
                        <Title level={2} className="!m-0 !text-orange-600 !font-bold">Rs. {Number(currentBalance).toLocaleString()}</Title>
                    </div>
                    <Button block size="large" className="rounded-2xl h-14 bg-orange-500 text-white border-none font-bold hover:!bg-orange-600 shadow-lg shadow-orange-100 uppercase text-[10px] tracking-widest" onClick={() => { setIsWalletOpen(false); setIsDepositOpen(true); }}>
                        Add Money to Wallet
                    </Button>
                </div>
            </Modal>

            {/* DEPOSIT MODAL */}
            <Modal
                title={<span className="text-xl font-black uppercase tracking-tight text-slate-800">Add Money <span className="text-blue-600">to Account</span></span>}
                open={isDepositOpen}
                onCancel={() => setIsDepositOpen(false)}
                footer={null} centered borderRadius={30} className="premium-modal"
            >
                <div className="py-6 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
                        <Text className="text-[10px] uppercase font-black text-slate-400 block mb-3 ml-1 tracking-widest">Enter Amount (Min Rs. 1,000)</Text>
                        <InputNumber
                            className="w-full h-14 rounded-2xl flex items-center text-xl font-bold border-none bg-white shadow-sm"
                            value={depositAmount}
                            onChange={(val) => setDepositAmount(val)}
                            min={1000}
                            formatter={value => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/Rs\.\s?|(,*)/g, '')}
                        />
                    </div>
                    <Button block type="primary" size="large" loading={loading} onClick={handleDeposit} className="h-16 rounded-[20px] bg-slate-900 border-none text-base font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] transition-all">
                        Confirm Deposit
                    </Button>
                    <Text className="text-center block text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Money will be added instantly to your wallet
                    </Text>
                </div>
            </Modal>
        </div>
    );
};

export default Overview;