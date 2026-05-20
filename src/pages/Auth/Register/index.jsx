import { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api from "@/config/api";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const initialState = { fullName: "", email: "", phone: "", password: "", confirmPassword: "" };

const Register = () => {

    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    // Input change handler
    const handleChange = (e) => setState(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async () => {

        const { fullName, email, phone, password, confirmPassword } = state;

        // --- Frontend Validations ---
        if (fullName.trim().length < 3) return window.toastify("Name is too short", "error");
        if (!email.includes("@")) return window.toastify("Please enter a valid email", "error");
        if (password.length < 6) return window.toastify("Password must be at least 6 characters", "error");
        if (password !== confirmPassword) return window.toastify("Passwords do not match", "error");

        const formData = { fullName, email, phone, password };

        setIsProcessing(true);

        try {
            // API Call to your Node.js backend
            const response = await api.post("/auth/register", formData);

            // Backend usually returns { message: "...", user: { accountNumber: "..." } } 
            // ya phir direct data mein bhejta hai. Niche wala logic handle karega dono:
            if (response.status === 201 || response.data.success) {


                window.toastify("Registered Successfully", "success");

                setState(initialState);

                // Login page par navigate karein 3 seconds baad ya foran
                setTimeout(() => {
                    navigate("/auth/login");
                }, 1000);
            }
        }
        catch (error) {
            // Backend error message handle karein
            const errorMsg = error.response?.data?.message || "Registered Failed! Try again.";
            window.toastify(errorMsg, "error");
        }
        finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10 px-4">

            <Card className="max-w-2xl w-full rounded-3xl border-0 shadow-2xl overflow-hidden" styles={{ body: { padding: '40px' } }}>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block p-3 bg-blue-50 rounded-2xl mb-4">
                        <Title level={2} className="!m-0 !text-blue-600 !font-black tracking-tight italic">
                            Digital Bank 🏦
                        </Title>
                    </div>
                    <Text className="text-slate-400 block text-sm font-bold uppercase tracking-widest">
                        Join Pakistan's Premier Digital Network
                    </Text>
                </div>

                <Form layout="vertical" className="grid grid-cols-1 md:grid-cols-2 gap-x-6" onFinish={handleSubmit}>

                    {/* Full Name */}
                    <Form.Item label={<span className="font-bold text-slate-600">Full Name</span>} className="md:col-span-2">
                        <Input prefix={<UserOutlined className="text-blue-500 mr-2" />} name="fullName" placeholder="Enter Your Full Name" size="large" className="rounded-xl h-12" onChange={handleChange} value={state.fullName} />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item label={<span className="font-bold text-slate-600">Email Address</span>}>
                        <Input prefix={<MailOutlined className="text-blue-500 mr-2" />} name="email" type="email" placeholder="Enter Your Email Address" size="large" className="rounded-xl h-12" onChange={handleChange} value={state.email} />
                    </Form.Item>

                    {/* Phone */}
                    <Form.Item label={<span className="font-bold text-slate-600">Phone Number</span>}>
                        <Input prefix={<PhoneOutlined className="text-blue-500 mr-2" />} name="phone" placeholder="Enter Your Phone Number" size="large" className="rounded-xl h-12" onChange={handleChange} value={state.phone} />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item label={<span className="font-bold text-slate-600">Password</span>}>
                        <Input.Password prefix={<LockOutlined className="text-blue-500 mr-2" />} name="password" placeholder="Enter Your Password" size="large" className="rounded-xl h-12" onChange={handleChange} value={state.password} />
                    </Form.Item>

                    {/* Confirm Password */}
                    <Form.Item label={<span className="font-bold text-slate-600">Verify Password</span>}>
                        <Input.Password prefix={<SafetyCertificateOutlined className="text-blue-500 mr-2" />} name="confirmPassword" placeholder="Enter Your Password" size="large" className="rounded-xl h-12" onChange={handleChange} value={state.confirmPassword} />
                    </Form.Item>

                    {/* Submit Button */}
                    <Button type="primary" loading={isProcessing} htmlType="submit" size="large" className="w-full md:col-span-2 h-14 bg-blue-600 hover:!bg-blue-700 font-black text-base rounded-2xl shadow-lg shadow-blue-100 mt-6 border-none uppercase tracking-widest">
                        Create Account
                    </Button>
                </Form>

                <div className="text-center mt-6 border-t border-slate-50">
                    <p className="text-slate-500 font-medium">
                        Already have an account?
                        <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-black ml-2 transition-all">
                            Log In Here
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Register;