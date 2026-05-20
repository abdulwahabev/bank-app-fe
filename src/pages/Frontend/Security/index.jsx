import React from 'react';
import { Typography, Row, Col, Space, Divider, Tag } from 'antd';
import { SafetyCertificateOutlined, LockOutlined, EyeInvisibleOutlined, MobileOutlined, CheckCircleFilled, KeyOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Security = () => {

    return (

        /* Relative and z-10 to prevent navbar from blocking clicks */
        <div className="relative z-10 pt-32 pb-20 px-6 bg-[#f8fafc] min-h-screen">

            <div className="max-w-5xl mx-auto">

                <div className="flex justify-center mb-6">
                    <Tag color="success" icon={<CheckCircleFilled />} className="px-4 py-1 rounded-full font-bold">
                        SECURE CONNECTION
                    </Tag>
                </div>

                <div className="text-center mb-12">
                    <SafetyCertificateOutlined className="text-6xl text-blue-600 mb-6" />
                    <Title className="text-3xl md:text-5xl font-black text-slate-800">
                        Your Security is <span className="text-blue-600">Priority.</span>
                    </Title>
                </div>

                <div className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-lg border border-slate-50">

                    <Row gutter={[32, 32]}>

                        <Col xs={24} md={12}>
                            <Space orientation="vertical">
                                <Title level={4}><LockOutlined className="text-blue-600" /> Encryption</Title>
                                <Text className="text-slate-500">AES 256-bit bank-grade encryption for all data.</Text>
                            </Space>
                        </Col>

                        <Col xs={24} md={12}>

                            <Space orientation="vertical">
                                <Title level={4}><MobileOutlined className="text-blue-600" /> Biometrics</Title>
                                <Text className="text-slate-500">Face ID and Fingerprint login for extra safety.</Text>
                            </Space>

                        </Col>

                        <Col xs={24} md={12}>

                            <Space orientation="vertical">
                                <Title level={4}><EyeInvisibleOutlined className="text-blue-600" /> Card Control</Title>
                                <Text className="text-slate-500">Freeze or unfreeze your cards instantly via app.</Text>
                            </Space>

                        </Col>

                        <Col xs={24} md={12}>

                            <Space orientation="vertical">
                                <Title level={4}><SafetyCertificateOutlined className="text-blue-600" /> Regulated</Title>
                                <Text className="text-slate-500">Regulated by the State Bank of Pakistan.</Text>
                            </Space>

                        </Col>

                    </Row>

                    <Divider className="my-10" />

                    <div className="bg-blue-50 rounded-2xl p-6 text-center">
                        <Text className="block text-slate-500 mb-2 font-semibold">24/7 Helpline</Text>
                        <Title level={3} className="m-0 text-blue-600">0800-12345</Title>
                    </div>

                </div>

                <div className="mt-10 text-center opacity-60">
                    <Text><KeyOutlined /> We never ask for your OTP or Password.</Text>
                </div>

            </div>

        </div>
    );
};

export default Security;