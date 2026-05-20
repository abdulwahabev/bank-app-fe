import { Result, Card } from 'antd';
import { HourglassOutlined } from '@ant-design/icons';

const Pending = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="shadow-lg rounded-2xl">
            <Result
                icon={<HourglassOutlined className="text-orange-400 animate-pulse" />}
                title="Account Approval Pending"
                subTitle="The Admin is currently reviewing your documents. Once approved, you will receive your Account Number."
            />
        </Card>
    </div>
);

export default Pending;