import axiosInstance from '@/axiosClient';
import { CreateUserFormAPIResponse, Role, UserData } from '@/types/APIResponses/UsersAPI';
import {useRouter} from 'next/router';
import { useEffect, useState } from 'react';
import { produce } from 'immer';
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
const { Header, Sider, Content } = Layout;

const { Title, Text } = Typography;
const { Option } = Select;

export default function Advertisement() {
  const router = useRouter();
  const {id} = router.query;
  const [userData, setUserData] = useState<UserData | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  const handleSave = async () => {
    try {
      const json = {"body": {"data": userData}};
      const response = await axiosInstance.post('/account/create', json);
      if(response.status === 200){
        message.success('Changes saved successfully');
        router.push('/user/'+ response.data.body.data.id);
        setIsEditable(false);
      }
    } catch (error) {
      message.error('Failed to save changes');
    }
  };
  
  useEffect(() => {
    const fetchUserForm = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get<CreateUserFormAPIResponse>('/account/form');
          const userData = response.data.body.data;
          setUserData(userData);
        } 
        catch (error) {
          message.error('Failed to fetch advertisement form');
        } 
        finally {
          setLoading(false);
        }
    };
    fetchUserForm();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading partner data..." />
      </div>
    );
  }

  // Render the edit mode using Form with horizontal layout
  const renderEditMode = () => {
    if (!userData) return null;
    
    return (
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
       
        <Form.Item label="First Name">
          <Input
            value={userData.firstName.values}
            onChange={(e) => 
              setUserData((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.firstName.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input
            value={userData.lastName.values}
            onChange={(e) => 
              setUserData((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.lastName.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="Email">
          <Input
            value={userData.email.values}
            onChange={(e) => 
              setUserData((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.email.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="UserName">
          <Input
            value={userData.userName.values}
            onChange={(e) => 
              setUserData((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.userName.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input
            value={userData.description.values}
            onChange={(e) => 
              setUserData((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.description.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="User Roles">
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select user roles"
                    value={userData.userRoles.values?.map(role => role?.name).filter((val): val is string => val !== undefined)}
                    onChange={(selectedValues) => {
                      const finalValues = selectedValues.map(selectedName => 
                        userData.userRoles.options.data.find(option => option?.name === selectedName)
                      );
                      setUserData((prevData) =>
                        produce(prevData, (draft) => {
                          if(draft) {
                            draft.userRoles.values = finalValues.filter((value): value is Role => value !== undefined);
                          }
                        })
                      );
                    }}
                  >
                    {userData.userRoles.options.data.map((option, index) => (
                      <Option key={index} value={option?.name}>
                        {option?.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>  
      </Form>
    );
  };

  return (
          <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={2}>Partner Information</Title>
                  <Button 
                    type="primary" 
                    icon={isEditable ? <SaveOutlined /> : <EditOutlined />}
                    onClick={handleSave}
                  >
                    {'Save'}
                  </Button>
                </div>
              }
            >
              {userData ? (
                renderEditMode()
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text type="secondary">No partner data available</Text>
                </div>
              )}
            </Card>
          </div>
  );
}