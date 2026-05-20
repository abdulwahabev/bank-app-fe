import { Layout, Menu, Typography } from 'antd';
import { DashboardOutlined, TransactionOutlined, SendOutlined, HistoryOutlined, CreditCardOutlined, LogoutOutlined, SafetyCertificateOutlined, IdcardOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {

    const { user, handleLogout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    // 1. Common Items
    const commonItems = [
        { key: user?.role === 'admin' ? '/admin' : '/dashboard', icon: <DashboardOutlined />, label: 'Overview' },
    ];

    // 2. Admin Specific Items
    const adminItems = [
        { key: '/admin/global-transaction', icon: <TransactionOutlined />, label: <Link to="/admin/global-transaction">Global Transactions</Link> },
        { key: '/admin/verification', icon: <IdcardOutlined />, label: <Link to="/admin/verification">KYC Verifications</Link> },
        { key: '/admin/bank-report', icon: <FileTextOutlined />, label: <Link to="/admin/bank-report">Bank Reports</Link> },
        { key: '/admin/security-limit', icon: <SafetyCertificateOutlined />, label: <Link to="/admin/security-limit">Security & Limits</Link> },
        { key: '/admin/manage-user', icon: <TeamOutlined />, label: <Link to="/admin/manage-user">Manage User</Link> },

    ];

    // 3. User Specific Items
    const userItems = [
        { key: '/dashboard/transfer', icon: <SendOutlined />, label: <Link to="/dashboard/transfer">Transfer</Link> },
        { key: '/dashboard/history', icon: <HistoryOutlined />, label: <Link to="/dashboard/history">History</Link> },
        { key: '/dashboard/cards', icon: <CreditCardOutlined />, label: <Link to="/dashboard/cards">My Cards</Link> },
    ];

    const menuItems = [
        ...commonItems,
        ...(user?.role === 'admin' ? adminItems : userItems),
        { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, className: 'mt-20' }
    ];

    const handleMenuClick = (item) => {
        if (item.key === 'logout') { handleLogout(); }
        else { navigate(item.key); }
    };

    return (

        <Sider theme="light" breakpoint="lg" collapsedWidth="0" width={260} className="border-r border-slate-100 sticky top-0 h-screen">

            <div className="p-8 mb-4 flex items-center gap-3" >

                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Link to="/">  <span className="text-white font-black text-xl">{user?.role === 'admin' ? 'A' : 'U'}</span></Link>
                </div>

                <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-900 leading-none">
                        Digital Bank
                    </span>
                    <Text type="secondary" className="text-[10px] uppercase font-bold tracking-widest">{user?.role}</Text>
                </div>
            </div>

            <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} onClick={handleMenuClick} className="border-none px-4 font-bold" />

        </Sider>

    );
};

export default Sidebar;