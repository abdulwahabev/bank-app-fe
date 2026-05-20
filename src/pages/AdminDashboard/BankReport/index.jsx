import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Typography, message, Spin, Avatar, Statistic, Row, Col, Table, Input, Modal, Tag, Space, Divider } from 'antd';
import {
    PrinterOutlined,
    TeamOutlined,
    FileTextOutlined,
    SearchOutlined,
    ArrowLeftOutlined,
    BankOutlined,
    DollarOutlined,
    UserOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import api from '@/config/api';
import { downloadCSV } from '../../../utils/csvExport';

const { Text, Title } = Typography;

const BankReport = () => {
    const [data, setData] = useState({ users: [], transactions: [] });
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('menu'); // menu, all-users, details, statements
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userTransactions, setUserTransactions] = useState([]);
    const [fetchingTransactions, setFetchingTransactions] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [usersRes, transRes] = await Promise.all([
                api.get('/admin/all-users'),
                api.get('/admin/all-transactions')
            ]);
            setData({
                users: Array.isArray(usersRes.data) ? usersRes.data : [],
                transactions: Array.isArray(transRes.data) ? transRes.data : []
            });
        } catch (err) {
            message.error("Data sync failed!");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserTransactions = async (userId) => {
        setFetchingTransactions(true);
        try {
            const res = await api.get(`/admin/user-transactions/${userId}`);
            setUserTransactions(res.data);
        } catch (err) {
            message.error("Failed to fetch statement");
        } finally {
            setFetchingTransactions(false);
        }
    };

    const handleDownloadCSV = () => {
        const preparedData = userTransactions.map(tx => ({
            Date: new Date(tx.createdAt).toLocaleString(),
            Description: tx.description,
            Type: tx.type,
            Amount: tx.amount,
            BalanceAfter: tx.receiverBalance || tx.senderBalance,
            Status: tx.status,
            TransactionID: tx.transactionId
        }));
        downloadCSV(preparedData, `Statement_${selectedUser?.fullName}_${selectedUser?.accountNumber}`);
    };

    const handlePrint = () => {
        const content = document.getElementById('printable-statement').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Bank Statement - ${selectedUser?.fullName}</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                        @media print { .no-print { display: none; } }
                        body { padding: 40px; }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const filteredUsers = data.users.filter(u =>
        u.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        u.accountNumber?.includes(searchText) ||
        u.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-white">
            <Spin size="large" />
            <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest">Initialising Secure Data Stream...</Text>
        </div>
    );

    // --- MAIN MENU VIEW ---
    if (view === 'menu') {
        return (
            <div className="p-8 bg-[#f8fafc] min-h-screen">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter m-0 uppercase">Bank Reports & Ledger</h1>
                    <p className="text-slate-500 text-lg">Centralized management for all banking records and statements</p>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={8}>
                        <Card
                            hoverable
                            className="h-full rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative"
                            onClick={() => setView('all-users')}
                        >
                            <PrinterOutlined className="absolute -right-4 -bottom-4 text-9xl opacity-10" />
                            <div className="p-4">
                                <Avatar size={64} icon={<PrinterOutlined />} className="bg-white/20 mb-6 border-none" />
                                <h2 className="text-2xl font-black m-0 uppercase">Print All Accounts</h2>
                                <p className="mt-2 text-blue-100 opacity-80">Generate a comprehensive list of all registered bank accounts with balances.</p>
                                <Button ghost size="large" className="mt-6 rounded-xl border-white/30 font-bold uppercase">Open Print View</Button>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card
                            hoverable
                            className="h-full rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white overflow-hidden relative"
                            onClick={() => setView('details')}
                        >
                            <TeamOutlined className="absolute -right-4 -bottom-4 text-9xl text-slate-50" />
                            <div className="p-4">
                                <Avatar size={64} icon={<TeamOutlined />} className="bg-slate-900 mb-6 border-none" />
                                <h2 className="text-2xl font-black text-slate-800 m-0 uppercase">Account Details</h2>
                                <p className="mt-2 text-slate-400">View detailed information including phone, email, and verification status of users.</p>
                                <Button type="primary" size="large" className="mt-6 rounded-xl bg-slate-900 border-none font-bold uppercase">View All Details</Button>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card
                            hoverable
                            className="h-full rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white overflow-hidden relative"
                            onClick={() => setView('statements')}
                        >
                            <FileTextOutlined className="absolute -right-4 -bottom-4 text-9xl text-blue-50" />
                            <div className="p-4">
                                <Avatar size={64} icon={<FileTextOutlined />} className="bg-blue-500 mb-6 border-none" />
                                <h2 className="text-2xl font-black text-slate-800 m-0 uppercase">User Statements</h2>
                                <p className="mt-2 text-slate-400">Generate and print professional transaction statements for individual customers.</p>
                                <Button type="primary" size="large" className="mt-6 rounded-xl bg-blue-500 border-none font-bold uppercase">Generate Statements</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <div className="mt-12">
                    <Divider titlePlacement="left" className="border-slate-200">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Live Statistics
                        </span>
                    </Divider>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12} lg={6}>
                            <Statistic title="Total Users" value={data.users.length} prefix={<TeamOutlined />} className="bg-white p-6 rounded-3xl shadow-sm" />
                        </Col>
                        <Col xs={24} md={12} lg={6}>
                            <Statistic title="Total Liquidity" value={data.users.reduce((acc, u) => acc + (u.balance || 0), 0)} precision={2} prefix={<BankOutlined />} className="bg-white p-6 rounded-3xl shadow-sm" />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

    // --- SHARED BACK BUTTON ---
    const BackButton = () => (
        <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => { setView('menu'); setSearchText(''); }}
            className="mb-6 rounded-xl border-none bg-white shadow-sm font-bold uppercase"
        >
            Back to Menu
        </Button>
    );

    // --- PRINT ALL USERS VIEW ---
    if (view === 'all-users') {
        return (
            <div className="p-8 bg-[#f8fafc] min-h-screen printable-content">
                <BackButton />
                <div className="flex justify-between items-center mb-8 no-print">
                    <Title level={2} className="m-0 font-black uppercase">All User Accounts Ledger</Title>
                    <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint} size="large" className="rounded-xl bg-blue-600 border-none font-bold">PRINT LEDGER</Button>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100">
                    <Table
                        dataSource={data.users}
                        // Ye line add karein: record._id (MongoDB) ya record.id jo bhi unique field ho
                        rowKey={(record) => record._id || record.id || record.email}
                        pagination={false}
                        className="print-table"
                        columns={[
                            {
                                title: 'Full Name',
                                dataIndex: 'fullName',
                                key: 'fullName',
                                render: text => <span className="font-bold text-slate-800">{text}</span>
                            },
                            {
                                title: 'Account Number',
                                dataIndex: 'accountNumber',
                                key: 'accountNumber',
                                render: text => <span className="font-mono bg-slate-50 px-2 py-1 rounded text-blue-600 font-bold">{text || 'PENDING'}</span>
                            },
                            { title: 'Email Address', dataIndex: 'email', key: 'email' },
                            {
                                title: 'Balance',
                                dataIndex: 'balance',
                                key: 'balance',
                                align: 'right',
                                render: val => <span className="font-bold text-green-600">Rs. {Number(val).toLocaleString()}</span>
                            },
                            {
                                title: 'Status',
                                dataIndex: 'status',
                                key: 'status',
                                render: s => <Tag color={s === 'active' ? 'green' : 'orange'} className="rounded-full border-none px-3 font-bold uppercase">{s}</Tag>
                            }
                        ]}
                    />
                </div>
            </div>
        );
    }

    // --- ACCOUNT DETAILS VIEW ---
    if (view === 'details') {
        return (
            <div className="p-8 bg-[#f8fafc] min-h-screen">
                <BackButton />
                <div className="mb-8">
                    <Title level={2} className="m-0 font-black uppercase">Detailed Account Management</Title>
                    <Input
                        placeholder="Search by name, account number or email..."
                        prefix={<SearchOutlined />}
                        className="mt-4 h-12 rounded-2xl border-none shadow-sm"
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    dataSource={filteredUsers}
                    rowKey="_id"
                    className="bg-white rounded-3xl overflow-hidden shadow-sm"
                    columns={[
                        {
                            title: 'User', dataIndex: 'fullName', key: 'user', render: (text, record) => (
                                <div className="flex items-center gap-3">
                                    <Avatar className="bg-blue-100 text-blue-600 font-bold">{text[0]}</Avatar>
                                    <div>
                                        <div className="font-bold text-slate-800 leading-none">{text}</div>
                                        <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">ID: {record._id.slice(-6)}</div>
                                    </div>
                                </div>
                            )
                        },
                        {
                            title: 'Contact info', key: 'contact', render: (_, record) => (
                                <div>
                                    <div className="text-xs font-medium text-slate-600">{record.email}</div>
                                    <div className="text-xs text-slate-400">{record.phone}</div>
                                </div>
                            )
                        },
                        { title: 'A/C Number', dataIndex: 'accountNumber', key: 'account', render: text => <Text copyable className="font-mono font-bold text-blue-600">{text || 'N/A'}</Text> },
                        {
                            title: 'Balance',
                            dataIndex: 'balance',
                            key: 'balance',
                            align: 'right',
                            render: val => (
                                <Statistic
                                    value={val}
                                    precision={2}
                                    // Purana valueStyle ab styles.content ban gaya hai
                                    styles={{
                                        content: {
                                            fontSize: '14px',
                                            fontWeight: '900',
                                            color: '#059669'
                                        }
                                    }}
                                    prefix="Rs."
                                />
                            )
                        }, { title: 'Joined', dataIndex: 'createdAt', key: 'joined', render: date => <span className="text-xs text-slate-500 font-medium">{new Date(date).toLocaleDateString()}</span> }
                    ]}
                />
            </div>
        );
    }

    // --- STATEMENTS VIEW ---
    if (view === 'statements') {
        return (
            <div className="p-8 bg-[#f8fafc] min-h-screen">
                <BackButton />
                <div className="mb-8">
                    <Title level={2} className="m-0 font-black uppercase">Generate Customer Statements</Title>
                    <Input
                        placeholder="Search user to generate statement..."
                        prefix={<SearchOutlined />}
                        className="mt-4 h-12 rounded-2xl border-none shadow-sm"
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>

                <Row gutter={[16, 16]}>
                    {filteredUsers.map(user => (
                        <Col xs={24} md={12} lg={8} key={user._id}>
                            <Card className="rounded-3xl border-none shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Avatar size={48} className="bg-slate-50 text-slate-800 border border-slate-100 font-bold"><UserOutlined /></Avatar>
                                        <div>
                                            <h4 className="m-0 font-black text-slate-800 uppercase tracking-tight">{user.fullName}</h4>
                                            <p className="m-0 text-slate-400 font-mono text-xs">{user.accountNumber || 'NO ACCOUNT'}</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<FileTextOutlined />}
                                        className="bg-blue-600 border-none flex items-center justify-center h-10 w-10 shadow-lg shadow-blue-100"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            fetchUserTransactions(user._id);
                                        }}
                                    />
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* STATEMENT MODAL */}
                <Modal
                    open={!!selectedUser} // 'visible' ki jagah 'open' zyada behtar hai
                    onCancel={() => { setSelectedUser(null); setUserTransactions([]); }}
                    footer={null}
                    width={800}
                    // 'bodyStyle' ko 'styles.body' mein tabdeel kar diya
                    styles={{
                        body: { padding: 0 }
                    }}
                    className="statement-modal"
                    closeIcon={<div className="bg-slate-100 p-2 rounded-full"><ArrowLeftOutlined /></div>}
                >
                    {selectedUser && (
                        <div className="p-10 bg-white" id="printable-statement">
                            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                                <div>
                                    <h1 className="text-3xl font-black m-0 tracking-tighter uppercase flex items-center gap-2">
                                        <BankOutlined className="text-blue-600" /> DBANK STATEMENT
                                    </h1>
                                    <p className="text-slate-400 font-bold text-xs mt-1 uppercase">Official Financial Document</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="m-0 font-black uppercase text-slate-800">Generated On</h3>
                                    <p className="m-0 text-slate-500 font-bold">{new Date().toLocaleString()}</p>
                                </div>
                            </div>

                            <Row gutter={40} className="mb-10">
                                <Col span={12}>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Account Holder</p>
                                    <h2 className="m-0 font-black text-slate-900 uppercase text-xl leading-tight">{selectedUser.fullName}</h2>
                                    <p className="text-slate-600 font-medium mt-1">{selectedUser.email}</p>
                                    <p className="text-slate-600 font-medium">{selectedUser.phone}</p>
                                </Col>
                                <Col span={12} className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Account Information</p>
                                    <h2 className="m-0 font-black text-blue-600 font-mono text-xl">{selectedUser.accountNumber}</h2>
                                    <div className="mt-4 bg-slate-900 text-white p-4 rounded-2xl inline-block text-left min-w-[200px]">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase m-0">Current Balance</p>
                                        <h2 className="text-white font-black m-0 text-2xl">Rs. {selectedUser.balance?.toLocaleString()}</h2>
                                    </div>
                                </Col>
                            </Row>

                            <h4 className="uppercase font-black text-slate-800 mb-4 tracking-tight flex items-center gap-2">
                                {/* 'orientation' ko 'titlePlacement' se badal diya gaya hai */}
                                <Divider titlePlacement="left" className="m-0">Transaction Activity</Divider>
                            </h4>

                            {fetchingTransactions ? (
                                <div className="p-20 text-center"><Spin /></div>
                            ) : (
                                <Table
                                    dataSource={userTransactions}
                                    pagination={false}
                                    rowKey="_id"
                                    columns={[
                                        { title: 'Date', dataIndex: 'createdAt', key: 'date', render: d => new Date(d).toLocaleDateString() },
                                        {
                                            title: 'Description', key: 'desc', render: (_, record) => (
                                                <div>
                                                    <div className="font-bold text-slate-800">{record.description}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-bold">{record.transactionId}</div>
                                                </div>
                                            )
                                        },
                                        { title: 'Type', dataIndex: 'type', key: 'type', render: t => <Tag className="rounded-full border-none px-3 font-bold uppercase text-[9px]">{t}</Tag> },
                                        {
                                            title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right', render: (amt, record) => {
                                                const isOut = record.sender?._id === selectedUser._id || record.sender === selectedUser._id;
                                                return <span className={`font-black ${isOut ? 'text-red-500' : 'text-green-600'}`}>{isOut ? '-' : '+'} Rs. {amt.toLocaleString()}</span>
                                            }
                                        }
                                    ]}
                                />
                            )}

                            <div className="mt-12 border-t border-slate-100 pt-8 flex justify-end items-center gap-4 no-print">
                                <Text className="text-slate-400 italic flex-1">This is a system generated statement and does not require a physical signature.</Text>
                                <Button type="default" size="large" icon={<DownloadOutlined />} className="font-bold rounded-xl h-12" onClick={handleDownloadCSV}>DOWNLOAD CSV</Button>
                                <Button type="primary" size="large" icon={<PrinterOutlined />} className="bg-slate-900 border-none font-bold rounded-xl h-12 px-8" onClick={handlePrint}>PRINT STATEMENT</Button>
                            </div>

                            <style>{`
                                @media print {
                                    .no-print { display: none !important; }
                                    body { background: white !important; }
                                    .ant-modal { margin: 0 !important; top: 0 !important; width: 100% !important; max-width: 100% !important; }
                                    .ant-modal-content { box-shadow: none !important; border: none !important; }
                                    .ant-table { border: 1px solid #f0f0f0 !important; }
                                    .printable-content { padding: 0 !important; }
                                    .ant-card { box-shadow: none !important; border: 1px solid #f0f0f0 !important; }
                                }
                            `}</style>
                        </div>
                    )}
                </Modal>
            </div>
        );
    }

    return null;
};

export default BankReport;