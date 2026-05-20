import React from 'react';
import { Row, Col, Typography, Card, Button } from 'antd';
import { ThunderboltOutlined, CreditCardOutlined, BarChartOutlined, BellOutlined, InteractionOutlined, WalletOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

const Features = () => {

    const { isAuth } = useAuth();
    const navigate = useNavigate();

    const featuresList = [
        { title: "Instant Payments", desc: "Send and receive money within seconds using Raast ID.", icon: <ThunderboltOutlined className="text-blue-600" /> },
        { title: "Digital Cards", desc: "Get an instant virtual card for international shopping.", icon: <CreditCardOutlined className="text-blue-600" /> },
        { title: "Expense Tracker", desc: "See exactly where your money goes with automated analytics.", icon: <BarChartOutlined className="text-blue-600" /> },
        { title: "Smart Alerts", desc: "Stay updated with real-time push notifications.", icon: <BellOutlined className="text-blue-600" /> },
        { title: "Bill Payments", desc: "Pay all your utility bills with just one tap.", icon: <InteractionOutlined className="text-blue-600" /> },
        { title: "Savings Vaults", desc: "Save money for your future goals effortlessly.", icon: <WalletOutlined className="text-blue-600" /> },
    ];

    return (
        /* pt-32 ensures content is below the fixed navbar on mobile */
        <div className="relative z-10 pt-32 pb-20 px-6 bg-white min-h-screen">

            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-16">

                    <Title className="text-3xl md:text-5xl font-extrabold text-slate-800">
                        Manage your <span className="text-blue-600">Finances</span> digitally.
                    </Title>

                    <Paragraph className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
                        Fast, transparent, and secure banking at your fingertips.
                    </Paragraph>

                </div>

                <Row gutter={[24, 24]}>

                    {featuresList.map((item, index) => (

                        <Col xs={24} sm={12} md={8} key={index}>

                            <Card className="h-full border-slate-100 shadow-sm hover:shadow-md transition-all rounded-3xl p-2">

                                <div className="text-3xl mb-4">{item.icon}</div>
                                <Title level={4}>{item.title}</Title>
                                <Text className="text-slate-500">{item.desc}</Text>

                            </Card>

                        </Col>
                    ))}
                </Row>

                <div className="mt-16 bg-slate-200 rounded-[2.5rem] p-10 text-center text-white">

                    <Title level={3} className="text-white mb-6">Ready to start?</Title>
                    {isAuth ? (
                        <Button type="primary" size="large" className="h-12 px-8 rounded-xl bg-blue-600 border-none font-bold"
                            onClick={() => navigate('/dashboard')}>
                            Go to Dashboard <ArrowRightOutlined />
                        </Button>
                    ) : (
                        <Button type="primary" size="large" className="h-12 px-8 rounded-xl bg-blue-600 border-none font-bold"
                            onClick={() => navigate('/auth/register')}>
                            Open Account <ArrowRightOutlined />
                        </Button>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Features;