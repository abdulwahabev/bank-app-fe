import { useState } from 'react';
import { Form, Input, Button, Card, Typography, InputNumber, Select } from 'antd';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { IdcardOutlined, HomeOutlined, BankOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Application = () => {
    const { user, dispatch } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form submit function
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/user/submit-kyc", values, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                window.toastify("Application submitted! Waiting for Admin approval.", "success");
                // 2. Status update taake routing pending page pe le jaye
                dispatch({ type: "LOGIN", payload: { ...user, status: 'pending' } });
            }
        } catch (error) {
            window.toastify(error.response?.data?.message || "Submission failed", "error");
        } finally {
            setLoading(false);
        }
    };

    // 3. Agar user pehle hi submit kar chuka hai (Pending status)
    if (user?.status === 'pending') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <Card className="max-w-md w-full text-center rounded-2xl shadow-lg">
                    <ClockCircleOutlined className="text-6xl text-orange-400 mb-4" />
                    <Title level={3}>Application Under Review</Title>
                    <Text className="text-slate-500">Aapki darkhwast mosool ho chuki hai. Admin ki tasdeeq ke baad aapka account active kar diya jayega.</Text>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <Card className="max-w-xl w-full rounded-2xl shadow-xl">
                <Title level={3} className="text-center !mb-2">Complete Your Bank Profile</Title>
                <Text className="text-center block text-slate-400 mb-8">Please provide your legal information to open an account</Text>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="cnic"
                        label="CNIC Number (13 Digits)"
                        rules={[{ required: true, message: 'CNIC is required' }, { pattern: /^\d{13}$/, message: 'CNIC must be 13 digits without dashes' }]}
                    >
                        <Input prefix={<IdcardOutlined className="text-blue-500" />} placeholder="e.g. 4210112345671" size="large" />
                    </Form.Item>

                    <Form.Item name="address" label="Residential Address" rules={[{ required: true }]}>
                        <Input.TextArea prefix={<HomeOutlined />} placeholder="Your permanent address" rows={3} />
                    </Form.Item>

                    <Form.Item name="accountType" label="Account Type" initialValue="Saving">
                        <Select size="large">
                            <Select.Option value="Saving">Saving Account</Select.Option>
                            <Select.Option value="Current">Current Account</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* 1. InputNumber ki width 'w-full' (100%) kar di gayi hai */}
                    <Form.Item
                        name="initialDeposit"
                        label="Initial Deposit (Minimum Rs. 500)"
                        rules={[{ required: true, message: 'Please enter initial deposit' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }} // Ye line width ko force karegi
                            size="large"
                            min={500}
                            placeholder="Amount enter karein"
                            prefix={<BankOutlined className="text-green-500" />}
                            formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Visual polish (Optional)
                            parser={(value) => value.replace(/\Rs\.\s?|(,*)/g, '')} // Visual polish (Optional)
                        />
                    </Form.Item>

                    {/* 3. Button tab tak disable rahega jab tak request process ho rahi hai */}
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        loading={loading}
                        disabled={loading}
                        className="bg-blue-600 h-12 mt-4 font-bold uppercase"
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Application;