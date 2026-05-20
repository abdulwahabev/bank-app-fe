import { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, Typography, Modal, Divider } from 'antd';
import {
    SendOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    UserOutlined,
    DollarOutlined
} from '@ant-design/icons';
import api from '@/config/api';
import { useAuth } from '../../../context/AuthContext';

const { Title, Text } = Typography;
const { confirm } = Modal;

const Transfer = () => {
    const { user, readProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showBalance, setShowBalance] = useState(true);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        if (values.amount > (user?.balance || 0)) {
            return window.toastify?.("Insufficient balance!", "error");
        }

        const modal = confirm({
            title: <span className="text-xl font-black">Confirm Transfer</span>,
            icon: <SendOutlined className="text-blue-500" />,
            content: (
                <div className="py-4">
                    <Text type="secondary">You are sending</Text>
                    <div className="text-2xl font-black text-slate-800">Rs. {values.amount.toLocaleString()}</div>
                    <Divider className="my-2" />
                    <Text type="secondary">To Account</Text>
                    <div className="text-lg font-bold text-blue-600 tracking-widest">{values.accountNumber}</div>
                </div>
            ),
            okText: 'Confirm & Send',
            cancelText: 'Cancel',
            okButtonProps: {
                className: "!bg-slate-900 h-10 rounded-lg border-none font-bold !text-white",
            },
            onOk: async () => {
                setLoading(true);

                try {
                    const payload = {
                        accountNumber: values.accountNumber,
                        amount: values.amount,
                        description: "Transfer to " + values.accountNumber
                    };

                    const res = await api.post('/transactions/transfer', payload);

                    if (res.data.success) {
                        form.resetFields();
                        window.toastify?.(res.data.message, "success");

                        // Balance refresh logic
                        await readProfile();

                        setLoading(false);
                        modal.destroy();
                    }
                } catch (error) {
                    setLoading(false);
                    if (error.response) {
                        const msg = error.response.data.message || "Transfer failed";
                        window.toastify?.(msg, "error");
                    }
                }
            },
        });
    };

    return (
        <div className="max-w-md mx-auto animate-in fade-in duration-700 p-4">

            <Card className="rounded-[2.5rem] shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-xl" styles={{ body: { padding: '32px' } }} >

                <div className="mb-4">
                    <Title level={2} className="!m-0 font-black tracking-[-1px] text-slate-800">
                        Transfer <span className="text-blue-600">Money</span>
                    </Title>
                </div>

                {/* Wallet Card Section */}
                <div className="mb-8 relative overflow-hidden bg-slate-900 rounded-[22px] p-5 shadow-2xl group">

                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/40 transition-all duration-700" />

                    <div className="relative z-10">

                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                            <Text className="text-[10px] font-bold !text-white tracking-[2px]">Available Amount</Text>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                                <span className="text-blue-500 font-extrabold text-sm self-center">Rs.</span>
                                <Title level={2} className="!text-white !m-0 font-sans tracking-tight !font-black" style={{ fontSize: '20px' }}>
                                    {showBalance ? `${user?.balance?.toLocaleString() || 0}` : "••••••"}
                                </Title>
                            </div>
                            <Button type="text" className="bg-white/10 hover:bg-white/20 !text-white rounded-xl h-10 w-10 flex items-center justify-center border border-white/10" onClick={() => setShowBalance(!showBalance)} icon={showBalance ? <EyeInvisibleOutlined className="!text-white" /> : <EyeOutlined className="!text-white" />} />
                        </div>

                    </div>
                </div>

                {/* Transfer Form */}
                <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>

                    <Form.Item name="accountNumber"
                        label={<Text className="text-[10px] uppercase font-black text-slate-400 ml-1 tracking-widest">Account Number</Text>}
                        rules={[{ required: true, message: 'Account Number is required' }]}>

                        <Input prefix={<UserOutlined className="text-blue-500 mr-2" />}
                            placeholder="A/C Number"
                            className="h-12 bg-slate-50 border-none rounded-xl shadow-sm"
                        />

                    </Form.Item>

                    <Form.Item name="amount"
                        label={<Text className="text-[10px] uppercase font-black text-slate-400 ml-1 tracking-widest">Amount</Text>}
                        rules={[{ required: true, message: 'Enter amount' }]}>

                        <InputNumber prefix={<DollarOutlined className="text-green-500 mr-2" />}
                            placeholder="0.00"
                            style={{ width: '100%' }}
                            className="h-12 rounded-xl bg-slate-50 border-none font-black text-slate-800 shadow-sm"
                            min={1}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />

                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={loading} block
                        style={{ height: '50px', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '16px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '16px' }}>
                        Send Money
                        <SendOutlined style={{ transform: 'rotate(-45deg)', fontSize: '24px' }} />
                    </Button>

                </Form>

            </Card>

        </div>

    );
};

export default Transfer;