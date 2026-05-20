import { useEffect, useState, useRef } from 'react';
import { Table, Tag, Card, Typography, Button, Modal, Row, Col, Statistic, Space, message, Popconfirm } from 'antd';
import {
    PrinterOutlined, CheckCircleFilled, DownloadOutlined, EyeOutlined,
    HistoryOutlined, CloseOutlined, ArrowUpOutlined, ArrowDownOutlined,
    ThunderboltOutlined, DeleteOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { toPng } from 'html-to-image'; // Updated Library
import { useAuth } from '../../../context/AuthContext';
import { downloadCSV } from '../../../utils/csvExport';

const { Title, Text } = Typography;

const History = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTx, setSelectedTx] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const receiptRef = useRef();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        fetchHistory();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://bank-app-be-sand.vercel.app/api/transactions/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data.history || []);
        } catch (err) {
            message.error("Failed to fetch history");
        } finally { setLoading(false); }
    };

    const handleDownloadFullStatement = () => {
        const preparedData = data.map(tx => ({
            Date: new Date(tx.createdAt).toLocaleString(),
            Description: tx.description,
            Type: tx.type,
            Amount: tx.amount,
            BalanceAfter: (tx.sender?._id || tx.sender) === user?._id ? tx.senderBalance : tx.receiverBalance,
            Status: tx.status,
            TransactionID: tx.transactionId
        }));
        downloadCSV(preparedData, `Bank_Statement_${user?.fullName}`);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`https://bank-app-be-sand.vercel.app/api/transactions/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                message.success("Transaction deleted");
                setData(prev => prev.filter(item => item._id !== id));
            }
        } catch (err) {
            message.error("Delete failed");
        }
    };

    // FIXED: Now using html-to-image which supports oklch
    const handleSaveImage = async () => {
        if (!receiptRef.current) return;
        setSaving(true);
        try {
            const dataUrl = await toPng(receiptRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                pixelRatio: 3, // For high quality
            });

            const link = document.createElement('a');
            link.download = `Receipt-${selectedTx?._id?.slice(-6) || 'txn'}.png`;
            link.href = dataUrl;
            link.click();
            message.success("PNG saved successfully!");
        } catch (error) {
            console.error("Save Error:", error);
            message.error("Rendering error. Please use Print option.");
        } finally {
            setSaving(false);
        }
    };

    const handlePrint = () => {
        const content = receiptRef.current.innerHTML;
        const pw = window.open('', '', 'width=450,height=700');
        pw.document.write(`<html><head><style>body{font-family:sans-serif;padding:20px;}.flex{display:flex;}.justify-between{justify-content:space-between;}.text-center{text-align:center;}</style></head><body>${content}</body></html>`);
        pw.document.close();
        pw.focus();
        setTimeout(() => { pw.print(); pw.close(); }, 500);
    };

    const columns = [
        {
            title: 'TRANSACTION',
            key: 'details',
            render: (_, record) => {
                const isSent = record.sender?._id === user?._id || record.sender === user?._id;
                const isDeposit = record.type === 'deposit';
                return (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${isDeposit ? "bg-blue-600 text-white" : (isSent ? "bg-rose-600 text-white" : "bg-emerald-500 text-white")}`}>
                            {isDeposit ? <ThunderboltOutlined /> : (isSent ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Text strong className="truncate text-xs sm:text-sm md:text-base">
                                {isDeposit ? "Wallet Added" : (isSent ? record.receiverName : record.senderName)}
                            </Text>
                            <Text className="text-[10px] text-slate-400">{new Date(record.createdAt).toLocaleDateString()}</Text>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'AMOUNT',
            key: 'amount',
            align: 'right',
            render: (_, record) => {
                const isDeposit = record.type === 'deposit';
                const isSent = (record.sender?._id || record.sender) === user?._id;
                const showNegative = isDeposit ? false : isSent;

                return (
                    <div className="text-right">
                        <Text strong className={`text-xs sm:text-sm ${showNegative ? "text-rose-600" : "text-emerald-600"}`}>
                            {showNegative ? '-' : '+'}Rs. {record.amount?.toLocaleString()}
                        </Text>
                    </div>
                );
            }
        },
        {
            title: 'ACTION',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => { setSelectedTx(record); setIsModalOpen(true); }}
                        className="view-btn hover:scale-105"
                    >
                        {!isMobile && "View"}
                    </Button>
                    <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)} okButtonProps={{ danger: true }}>
                        <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const isSentModal = selectedTx?.sender?._id === user?._id || selectedTx?.sender === user?._id;

    return (
        <div className="p-3 sm:p-6 lg:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* Stats */}
                <Row gutter={[12, 12]} className="mb-6">
                    <Col xs={24} sm={12} md={10}>
                        <Card className="rounded-2xl border-none shadow-sm bg-white" styles={{ body: { padding: '16px' } }}>
                            <Statistic
                                title={<span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Transaction Count</span>}
                                value={data?.length || 0}
                                styles={{ content: { color: '#1e293b', fontWeight: 800, fontSize: '1.5rem' } }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <Title level={4} className="!m-0 font-black text-slate-800 flex items-center gap-2">
                        <HistoryOutlined className="text-indigo-600" /> History
                    </Title>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadFullStatement}
                        className="bg-slate-900 border-none font-bold rounded-xl h-10 w-full sm:w-auto px-6 shadow-lg">
                        Download Statement
                    </Button>
                </div>

                {/* Table */}
                <Card className="rounded-2xl shadow-xl border-none overflow-hidden bg-white">
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="_id"
                        loading={loading}
                        pagination={{ pageSize: 7, simple: isMobile }}
                        scroll={{ x: 'max-content' }}
                    />
                </Card>
            </div>

            {/* Receipt Modal */}
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                closable={false}
                width={isMobile ? '95%' : 400}
                styles={{ body: { padding: 0 } }}
            >
                <div className="bg-slate-100 p-2 sm:p-3">
                    <div ref={receiptRef} id="receipt-content" className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200">
                        <div style={{ height: '4px', width: '100%', backgroundColor: isSentModal ? '#e11d48' : '#10b981', marginBottom: '20px', borderRadius: '10px' }}></div>

                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${isSentModal ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                    {isSentModal ? <ArrowUpOutlined className="text-rose-600" /> : <ArrowDownOutlined className="text-emerald-600" />}
                                </div>
                                <div>
                                    <div className="text-sm font-extrabold text-slate-900 leading-none">
                                        {isSentModal ? 'Money Sent' : 'Money Received'}
                                    </div>
                                    <div className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                                        <CheckCircleFilled /> Completed
                                    </div>
                                </div>
                            </div>
                            <Button type="text" shape="circle" icon={<CloseOutlined className="text-slate-400" />} onClick={() => setIsModalOpen(false)} className="bg-slate-50" />
                        </div>

                        <div className="mb-5">
                            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase text-center">Digital Receipt</div>
                            <div className="text-xl font-black text-slate-900 text-center">Transaction Info</div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 text-center">
                            <div className="text-[10px] text-slate-500 mb-1 font-medium">TOTAL AMOUNT</div>
                            <div className={`text-2xl font-black ${isSentModal ? 'text-rose-600' : 'text-emerald-600'}`}>
                                Rs. {selectedTx?.amount?.toLocaleString()}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {selectedTx?.type === 'deposit' ? (
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-400 font-bold uppercase">METHOD</span>
                                    <span className="font-bold text-emerald-600">Wallet Deposit</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-slate-400 font-bold uppercase">FROM</span>
                                        <span className="font-bold text-slate-800">{selectedTx?.senderName || 'System'}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-slate-400 font-bold uppercase">TO</span>
                                        <span className="font-bold text-slate-800">{selectedTx?.receiverName || 'User'}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between text-[11px]">
                                <span className="text-slate-400 font-bold uppercase">DATE</span>
                                <span className="font-bold text-slate-800">{new Date(selectedTx?.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="border-t border-dashed border-slate-200 pt-3 mt-1">
                                <div className="text-slate-400 text-[9px] font-bold">REFERENCE ID</div>
                                <div className="text-[10px] break-all text-indigo-500 font-mono mt-1">{selectedTx?._id}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 p-3">
                        <Button block icon={<PrinterOutlined />} onClick={handlePrint} className="rounded-xl font-bold h-11">Print</Button>
                        <Button block type="primary" loading={saving} icon={<DownloadOutlined />} onClick={handleSaveImage} className="rounded-xl font-bold h-11 bg-slate-900 border-none">Save PNG</Button>
                    </div>
                </div>
            </Modal>

            <style dangerouslySetInnerHTML={{
                __html: `
                .ant-table-thead > tr > th { 
                    background: #ffffff !important; 
                    font-weight: 800 !important; 
                    font-size: 10px !important; 
                    color: #94a3b8 !important; 
                    text-transform: uppercase;
                }
                .view-btn {
                    background-color: #f0f7ff;
                    color: #2563eb;
                    border-radius: 50px;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 12px;
                    height: 28px;
                    border: 1px solid #dbeafe;
                }
            `}} />
        </div>
    );
};

export default History;