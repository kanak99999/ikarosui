import axiosInstance from '@/axiosClient';
import { CreateUserFormAPIResponse, UserData } from '@/types/APIResponses/UsersAPI';
import {useRouter} from 'next/router';
import { useEffect, useState } from 'react';
import { produce } from 'immer';
import { GetManagerOptionsAPIResponse, GetReviewerOptionsAPIResponse, ManagerOptions, ReviewerOptions } from '@/types/APIResponses/Common';
import { 
  Button, 
  Card, 
  DatePicker, 
  Form, 
  Input, 
  Select, 
  Space, 
  Typography, 
  Spin, 
  Descriptions, 
  message,
  Layout,
  theme, 
  MenuProps
} from 'antd';
import { EditOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
const { Header, Sider, Content } = Layout;

const { Title, Text } = Typography;
const { Option } = Select;

export default function Partner() {
  const router = useRouter();
  const {id} = router.query;
  const [userData, setUser] = useState<UserData | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [managerOptions, setManagerOptions] = useState<ManagerOptions>([]);
  const [reviewerOptions, setReviewerOptions] = useState<ReviewerOptions>([]);
  const [loading, setLoading] = useState(true);
  const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

  const handleSave = async () => {
    try {
    //   const json = {"body": {"data": partnerData}};
    //   const response = await axiosInstance.post('/partner/edit', json);
    //   if(response.status === 200){
    //     message.success('Changes saved successfully');
    //     setIsEditable(false);
    //   }
    } catch (error) {
      message.error('Failed to save changes');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await axiosInstance.get<CreateUserFormAPIResponse>('/account/show/' + id);
          const userData = response.data.body.data;
          setUser(userData);
        } catch (error) {
          message.error('Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading user data..." />
      </div>
    );
  }

  // Render the view mode using Descriptions
  const renderViewMode = () => {
    if (!userData) return null;
    
    return (
      <Descriptions 
        bordered 
        column={1} 
        labelStyle={{ 
          fontWeight: 'bold',
          width: '200px', 
          backgroundColor: '#fafafa',
          padding: '12px 24px'
        }}
        contentStyle={{
          padding: '12px 24px'
        }}
      >
        <Descriptions.Item label="First Name">{userData.firstName.values}</Descriptions.Item>
        <Descriptions.Item label="Last Name">{userData.lastName.values}</Descriptions.Item>
        <Descriptions.Item label="Email">{userData.email.values}</Descriptions.Item>
        <Descriptions.Item label="UserName">{userData.userName.values}</Descriptions.Item>
        <Descriptions.Item label="Description">{userData.description.values}</Descriptions.Item>
        <Descriptions.Item label="User Roles">
          <Space direction="vertical">
            {userData.userRoles.values.map((role, index) => (
              <Text key={index}>
                {role?.name}
              </Text>
            ))}
          </Space>
        </Descriptions.Item>
      </Descriptions>
    );
  };


  return (
          <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={2}>User Information</Title>
                </div>
              }
            >
              {userData ? (
                 renderViewMode()
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text type="secondary">No user data available</Text>
                </div>
              )}
            </Card>
          </div>
  );
}