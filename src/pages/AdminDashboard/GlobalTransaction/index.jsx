import React, { useState, useEffect, useRef } from 'react';
import { Table, Tag, message, Input, Typography, Spin, Button, Row, Col, Empty } from 'antd';
import { SearchOutlined, DownloadOutlined, HistoryOutlined, CheckCircleFilled, BankOutlined } from '@ant-design/icons';
import api from '@/config/api';
import html2canvas from 'html2canvas'; // <--- PNG download ke liye zaroori hai

const { Title, Text } = Typography;

const GlobalTransaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const hiddenReceiptRef = useRef(); // Receipt generation ke liye reference

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/all-transactions');
            setTransactions(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            message.error("Sync Error!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTransactions(); }, []);

    // --- PNG DOWNLOAD FUNCTION (CORRECTED) ---
    const handleDownloadReceipt = async (record) => {
        const msgHide = message.loading(`Generating receipt for ${record._id.slice(-6).toUpperCase()}...`, 0);

        try {
            // Hum ek temporary div banayenge receipt design ke liye jo screen par nazar nahi ayega
            const receiptDiv = document.createElement('div');

            // Profesional Receipt Design (Inline Styles ke sath taake canvas sahi render kare)
            receiptDiv.innerHTML = `
                <div style="padding: 40px; background: white; width: 400px; font-family: sans-serif; color: #1e293b; border-radius: 20px; border: 1px solid #e2e8f0;">
                    <div style="height: 6px; background: #10b981; border-radius: 10px; margin-bottom: 30px;"></div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <div>
                            <div style="font-size: 10px; color: #94a3b8; font-weight: bold; letter-spacing: 1px;">DIGITAL RECEIPT</div>
                            <div style="font-size: 22px; font-weight: 900; color: #0f172a;">Transaction Info</div>
                        </div>
                        <div style="width: 50px; height: 50px; background: #f0fdf4; border-radius: 15px; display: flex; align-items: center; justify-content: center; color: #10b981; font-size: 24px; border: 1px solid #dcfce7;">
                            ✓
                        </div>
                    </div>

                    <div style="background: #f8fafc; padding: 20px; border-radius: 15px; text-align: center; border: 1px solid #f1f5f9; margin-bottom: 30px;">
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 5px;">Total Amount</div>
                        <div style="font-size: 32px; font-weight: 900; color: #059669;">
                            Rs. ${record.amount?.toLocaleString()}
                        </div>
                    </div>

                    <div style="display: flex; flexDirection: column; gap: 15px;">
                        <div style="display: flex; justify-content: space-between; font-size: 13px;">
                            <span style="color: #64748b;">Sender</span>
                            <span style="font-weight: bold; color: #0f172a;">${record.senderName || 'System'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px;">
                            <span style="color: #64748b;">Receiver</span>
                            <span style="font-weight: bold; color: #0f172a;">${record.receiverName || 'N/A'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px;">
                            <span style="color: #64748b;">Date</span>
                            <span style="font-weight: bold; color: #0f172a;">${new Date(record.createdAt).toLocaleString()}</span>
                        </div>
                        <div style="border-top: 1px dashed #e2e8f0; padding-top: 15px; margin-top: 5px;">
                            <div style="color: #94a3b8; font-size: 10px; font-weight: bold; margin-bottom: 3px;">REFERENCE ID</div>
                            <div style="font-size: 11px; font-family: monospace; color: #6366f1; word-break: break-all;">
                                ${record._id}
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #cbd5e1; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                        Verified by BankDigital Secure System
                    </div>
                </div>
            `;

            document.body.appendChild(receiptDiv); // Temporary add to body

            // html2canvas se div ko PNG mein convert karein
            const canvas = await html2canvas(receiptDiv, {
                backgroundColor: '#f8fafc', // Receipt ke bahar ka halka background
                scale: 2, // High resolution
                logging: false,
                useCORS: true
            });

            document.body.removeChild(receiptDiv); // Remove temporary div

            // Download Link generate karein
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `Receipt-${record._id.slice(-6).toUpperCase()}.png`;
            link.href = dataUrl;
            link.click();

            message.success("Receipt downloaded!");

        } catch (error) {
            console.error("Download Error:", error);
            message.error("Failed to generate image.");
        } finally {
            msgHide(); // Loading message ko hide karein
        }
    };

    const filteredData = transactions.filter(item => {
        const sName = (item.senderName || item.sender?.fullName || '').toLowerCase();
        const rName = (item.receiverName || item.receiver?.fullName || '').toLowerCase();
        const search = searchText.toLowerCase();
        return sName.includes(search) || rName.includes(search) || item._id.includes(searchText);
    });

    const isMobile = screenWidth < 768;

    return (
        <div style={{ padding: isMobile ? '16px' : '30px', background: '#f8fafc', minHeight: '100vh' }}>

            {/* Header Section */}
            <div style={{ marginBottom: '25px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '15px' }}>
                <div>
                    <Title level={isMobile ? 4 : 2} style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
                        <HistoryOutlined style={{ marginRight: '10px', color: '#6366f1' }} />
                        Global Activity
                    </Title>
                    <Text type="secondary">Monitor all platform transactions</Text>
                </div>

                <Input
                    placeholder="Search ID or Name..."
                    prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                    style={{
                        maxWidth: isMobile ? '100%' : '350px',
                        height: '45px',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                    }}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
            </div>

            {loading ? (
                <div style={{ padding: '100px 0', textAlign: 'center' }}><Spin size="large" /></div>
            ) : filteredData.length === 0 ? (
                <Empty description="No transactions found" style={{ marginTop: '50px' }} />
            ) : (
                <div className="transaction-container">

                    {/* 📱 MOBILE VIEW */}
                    {isMobile ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredData.map(item => (
                                <div key={item._id} style={{ background: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <Tag style={{ borderRadius: '6px', border: 'none', background: '#f1f5f9', color: '#64748b', fontWeight: 'bold' }}>
                                            ID: {item._id.slice(-6).toUpperCase()}
                                        </Tag>
                                        <Text style={{ fontWeight: 900, fontSize: '18px', color: '#0f172a' }}>
                                            Rs. {Number(item.amount).toLocaleString()}
                                        </Text>
                                    </div>

                                    <div style={{ marginBottom: '20px', borderLeft: '3px solid #6366f1', paddingLeft: '12px' }}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <Text style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, display: 'block' }}>SENDER</Text>
                                            <Text strong style={{ fontSize: '14px' }}>{item.senderName || 'System'}</Text>
                                        </div>
                                        <div>
                                            <Text style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, display: 'block' }}>RECEIVER</Text>
                                            <Text strong style={{ fontSize: '14px' }}>{item.receiverName || 'N/A'}</Text>
                                        </div>
                                    </div>

                                    {/* Action Button Mobile (Only Download) */}
                                    <Button
                                        block
                                        type="primary"
                                        icon={<DownloadOutlined />}
                                        onClick={() => handleDownloadReceipt(item)}
                                        style={{ borderRadius: '12px', height: '45px', fontWeight: 600, background: '#2d4783ff', border: 'none' }}
                                    >
                                        Download
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* 💻 DESKTOP VIEW */
                        <div style={{ background: 'white', borderRadius: '24px', padding: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <Table
                                dataSource={filteredData}
                                rowKey="_id"
                                pagination={{ pageSize: 10, placement: ['bottomCenter'] }}
                                className="custom-table"
                                columns={[
                                    {
                                        title: 'REFERENCE',
                                        dataIndex: '_id',
                                        render: id => <code style={{ color: '#6366f1', fontWeight: 'bold' }}>#{id.slice(-6).toUpperCase()}</code>
                                    },
                                    { title: 'SENDER', dataIndex: 'senderName', render: n => <Text strong>{n || 'System'}</Text> },
                                    { title: 'RECEIVER', dataIndex: 'receiverName', render: n => <Text strong>{n || 'N/A'}</Text> },
                                    {
                                        title: 'AMOUNT',
                                        dataIndex: 'amount',
                                        align: 'right',
                                        render: a => <Text style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Rs. {a?.toLocaleString()}</Text>
                                    },
                                    { title: 'DATE', dataIndex: 'createdAt', render: d => new Date(d).toLocaleDateString('en-GB') },
                                    {
                                        title: 'ACTION',
                                        align: 'center',
                                        render: (_, record) => (
                                            /* Only Download Button (Rectangle Style) */
                                            <Button
                                                type="primary"
                                                icon={<DownloadOutlined />}
                                                onClick={() => handleDownloadReceipt(record)}
                                                style={{ background: '#263869ff', borderRadius: '8px', border: 'none', fontSize: '12px', height: '32px' }}
                                            >
                                                PNG
                                            </Button>
                                        )
                                    }
                                ]}
                            />
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .ant-table-thead > tr > th { background: transparent !important; font-size: 11px !important; text-transform: uppercase; color: #94a3b8 !important; letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9 !important; }
                .ant-table-row:hover { background-color: #fbfcfe !important; }
                .ant-pagination-item-active { border-radius: 8px; background: #6366f1 !important; border: none; }
                .ant-pagination-item-active a { color: white !important; }
            `}</style>
        </div>
    );
};

export default GlobalTransaction;