import { useState } from 'react';
import { Card, Typography, Tag, Switch, Modal, InputNumber, message } from 'antd';
import { SafetyOutlined, EyeOutlined, LockOutlined, UnlockOutlined, EyeInvisibleOutlined, WifiOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../../../context/AuthContext';
import api from '@/config/api';

const { Title, Text } = Typography;

const MyCard = () => {

    const { user, readProfile } = useAuth();
    const [isFrozen, setIsFrozen] = useState(user?.cardDetails?.isFrozen || false);
    const [showDetails, setShowDetails] = useState(false);
    const [spendLimit, setSpendLimit] = useState(user?.cardDetails?.dailyLimit || 50000);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

    const cardNumber = user?.cardDetails?.cardNumber?.toString() || "4218000000000000";
    const cvv = user?.cardDetails?.cvv || "---";

    // Card Number Formatting Logic
    const formattedNumber = showDetails
        ? cardNumber.match(/.{1,4}/g)?.join('   ')
        : `****   ****   ****   ${cardNumber.slice(-4)}`;

    const handleFreezeToggle = async (checked) => {
        try {
            const res = await api.patch('/card/toggle-freeze');
            if (res.data.success) {
                setIsFrozen(res.data.isFrozen);
                message.success(res.data.message);
                await readProfile();
            }
        } catch (err) {
            message.error("Failed to update card status");
        }
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center lg:text-left">
                    <Title level={2} className="!m-0 font-black italic uppercase tracking-tighter text-slate-800">My Virtual Card</Title>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

                    {/* --- ATM CARD DISPLAY --- */}
                    <div className="w-full max-w-[450px] aspect-[1.6/1] perspective-1000 mx-auto lg:mx-0">
                        <div className={`relative w-full h-full rounded-[24px] shadow-2xl transition-all duration-700 overflow-hidden border border-white/10 ${isFrozen ? 'grayscale contrast-75' : 'hover:rotate-x-2 hover:shadow-blue-500/20'
                            }`}
                            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)' }}>

                            {/* Glass Shine Effect */}
                            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/5 via-transparent to-transparent rotate-12 pointer-events-none"></div>

                            {/* Frozen Overlay Logic */}
                            {isFrozen && (
                                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[3px] animate-in fade-in duration-500">
                                    <div className="bg-white/10 p-4 rounded-full mb-2">
                                        <LockOutlined className="text-white text-3xl" />
                                    </div>
                                    <Tag color="error" className="px-6 py-1 rounded-full font-black uppercase tracking-[3px] border-none shadow-lg">FROZEN</Tag>
                                </div>
                            )}

                            <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start">
                                    <div className="max-w-[150px]">
                                        <Text className="!text-white uppercase text-[9px] tracking-[3px] font-bold block mb-1">Bank Digital</Text>
                                        <Title level={5} className="!text-white !m-0 font-black italic uppercase tracking-tight">Premium</Title>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <WifiOutlined className="!text-white text-xl rotate-90" />
                                        <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700 border border-yellow-800/50 shadow-inner overflow-hidden relative">
                                            <div className="absolute inset-0 grid grid-cols-2 opacity-20"><div className="border-r border-b border-black"></div></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="my-4">
                                    <Text className="!text-white tracking-[0.15em] font-mono text-xl md:text-2xl block text-center transition-all duration-500"
                                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                        {formattedNumber}
                                    </Text>
                                    {showDetails && (
                                        <div className="flex justify-center mt-2 animate-in slide-in-from-top-2 duration-300">
                                            <Tag className="bg-white/10 border-white/20 text-white font-mono">CVV: {cvv}</Tag>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-white/40 text-[8px] uppercase tracking-wider mb-0 font-bold">Card Holder</p>
                                            <p className="text-white font-medium tracking-wide uppercase text-xs md:text-sm mt-1">{user?.fullName || "Valued Member"}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-[8px] uppercase tracking-wider mb-0 font-bold">Expires</p>
                                            <p className="text-white font-medium text-xs md:text-sm mt-1 font-mono">08/32</p>
                                        </div>
                                    </div>
                                    <div className="flex -space-x-4">
                                        <div className="w-9 h-9 bg-red-600/90 rounded-full border border-white/5"></div>
                                        <div className="w-9 h-9 bg-yellow-500/90 rounded-full border border-white/5 mix-blend-screen"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- MANAGEMENT CONTROLS --- */}
                    <Card className="w-full lg:max-w-md rounded-[32px] border-none shadow-2xl bg-white">
                        <div className="p-2 space-y-6">
                            <Title level={4} className="font-black uppercase tracking-tight text-slate-800 flex items-center gap-3">
                                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                                Management
                            </Title>

                            <div className="space-y-4">
                                {/* Freeze Toggle */}
                                <div className={`flex justify-between items-center p-5 rounded-3xl transition-all duration-300 ${isFrozen ? 'bg-red-50 ring-1 ring-red-100' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${isFrozen ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {isFrozen ? <LockOutlined /> : <SafetyOutlined />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 m-0 text-xs uppercase">Card Status</p>
                                            <p className="text-[10px] text-slate-500 m-0 font-medium">{isFrozen ? "Frozen & Protected" : "Active & Ready"}</p>
                                        </div>
                                    </div>
                                    <Switch size="small" checked={!isFrozen} onChange={handleFreezeToggle} />
                                </div>

                                {/* Reveal Details Toggle */}
                                <div className="flex justify-between items-center p-5 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all cursor-pointer group"
                                    onClick={() => setShowDetails(!showDetails)}>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                            {showDetails ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 m-0 text-xs uppercase">Security Info</p>
                                            <p className="text-[10px] text-slate-500 m-0 font-medium italic">Reveal CVV & Full Number</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{showDetails ? 'Hide' : 'Show'}</button>
                                </div>

                                {/* Spend Limit Control */}
                                <div className="flex justify-between items-center p-5 bg-slate-50 rounded-3xl group cursor-pointer" onClick={() => setIsLimitModalOpen(true)}>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-purple-100 p-3 rounded-2xl text-purple-600 group-hover:rotate-12 transition-transform">
                                            <UnlockOutlined />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 m-0 text-xs uppercase">Daily Limit</p>
                                            <p className="text-[10px] text-slate-500 m-0 font-medium">Rs. {spendLimit.toLocaleString()} / day</p>
                                        </div>
                                    </div>
                                    <EditOutlined className="text-slate-400" />
                                </div>
                            </div>

                            <div className="bg-slate-800 p-5 rounded-[24px] text-center shadow-lg shadow-slate-200">
                                <Text className="!text-white text-[9px] font-black tracking-[1px] block">
                                    Secure Digital Banking
                                </Text>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Limit Adjustment Modal */}
            <Modal
                title="Adjust Spend Limit"
                open={isLimitModalOpen}
                onOk={() => setIsLimitModalOpen(false)}
                onCancel={() => setIsLimitModalOpen(false)}
                centered
                className="premium-modal"
            >
                <div className="py-4 space-y-4">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Set New Daily Transaction Limit</p>
                    <InputNumber
                        className="w-full h-12 rounded-xl flex items-center text-lg font-bold"
                        formatter={value => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\Rs.\s?|(,*)/g, '')}
                        value={spendLimit}
                        onChange={(val) => setSpendLimit(val)}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default MyCard;