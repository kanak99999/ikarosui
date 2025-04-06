import axiosInstance from '@/axiosClient';
import { Field, ShowScreensAPIResponse, ScreenData } from '@/types/APIResponses/ScreensApi';
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

export default function Screen() {
  const router = useRouter();
  const {id} = router.query;
  const [screenData, setScreenData] = useState<ScreenData | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isEditable, setIsEditable] = useState(false);
  const [managerOptions, setManagerOptions] = useState<ManagerOptions>([]);
  const [reviewerOptions, setReviewerOptions] = useState<ReviewerOptions>([]);
  const [loading, setLoading] = useState(true);
  const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  const toggleEditMode = async () => {
    try {
      const response = await axiosInstance.get<ShowScreensAPIResponse>('/screen/form');
      const responseObject = response.data.body.data;
    //   setScreenData(prevData => {
    //     if (prevData) {
    //       return {
    //         ...prevData,
    //         userRoles: {
    //           ...prevData.userRoles,
    //           options: responseObject.userRoles.options
    //         }
    //       };
    //     }
    //     return partnerData;
    //   });

      const ReviewerAPIResponse = await axiosInstance.get<GetReviewerOptionsAPIResponse>('/options/managers?entityTypeId=9');
      setReviewerOptions(ReviewerAPIResponse.data.response);
      const ManagerAPIResponse = await axiosInstance.get<GetManagerOptionsAPIResponse>('/options/managers?entityTypeId=9');
      setManagerOptions(ManagerAPIResponse.data.response);
      setIsEditable(prevState => !prevState);
    } catch (error) {
      message.error('Failed to load edit options');
    }
  };

  const handleSave = async () => {
    try {
      const json = {"body": {"data": screenData}};
      const response = await axiosInstance.post('/screen/edit', json);
      if(response.status === 200){
        message.success('Changes saved successfully');
        setIsEditable(false);
      }
    } catch (error) {
      message.error('Failed to save changes');
    }
  };

  useEffect(() => {
    const fetchPartner = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await axiosInstance.get<ShowScreensAPIResponse>('/screen/show/' + id);
          const screenData = response.data.body.data;
          setScreenData(screenData);
        } catch (error) {
          message.error('Failed to fetch partner data');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPartner();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading partner data..." />
      </div>
    );
  }

  // Render the view mode using Descriptions
  const renderViewMode = () => {
    if (!screenData) return null;
    
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
        <Descriptions.Item label="Name">{screenData.name.values}</Descriptions.Item>
        <Descriptions.Item label="Established Date">{screenData.establishedDate.values}</Descriptions.Item>
        <Descriptions.Item label="Manager">
          <Space direction="vertical">
            {screenData.manager.values.map((manager, index) => (
              <Text key={index}>{manager?.name}</Text>
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Business Class">{partnerData.businessClass.values}</Descriptions.Item>
        <Descriptions.Item label="Reviewer">
          <Space direction="vertical">
            {partnerData.reviewer.values.map((reviewer, index) => (
              <Text key={index}>{reviewer?.name}</Text>
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Short Code ID">{screenData.shortCodeId.values}</Descriptions.Item>
        <Descriptions.Item label="Industry Type">{screenData.industryType.values}</Descriptions.Item>
        <Descriptions.Item label="Business Category">{screenData.businessCategory.values}</Descriptions.Item>
        <Descriptions.Item label="Average Selling Price">{screenData.averageSellingPrice.values}</Descriptions.Item>
        <Descriptions.Item label="Alias">{screenData.alias.values}</Descriptions.Item>
        <Descriptions.Item label="Location">{screenData.location.values}</Descriptions.Item>
        <Descriptions.Item label="Entity Type ID">{screenData.entityTypeId.values}</Descriptions.Item>
        <Descriptions.Item label="ID">{screenData.id.values}</Descriptions.Item>
        <Descriptions.Item label="Email">{screenData.email.values}</Descriptions.Item>
      </Descriptions>
    );
  };

  // Render the edit mode using Form with horizontal layout
  const renderEditMode = () => {
    if (!partnerData) return null;
    
    return (
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="Name">
          <Input
            value={partnerData.name.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.name.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="Established Date">
          <DatePicker
            value={partnerData.establishedDate.values && typeof partnerData.establishedDate.values === 'string' 
              ? dayjs(partnerData.establishedDate.values) 
              : null}
            onChange={(date, dateString) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.establishedDate.values = dateString;
                  }
                })
              )
            }
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Manager">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select managers"
            value={partnerData.manager.values.map(manager => manager?.name).filter((val): val is string => val !== undefined)}
            onChange={(selectedValues) => {
              const finalValues = selectedValues.map(selectedName => 
                managerOptions.find(option => option?.name === selectedName)
              );
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.manager.values = finalValues;
                  }
                })
              );
            }}
          >
            {managerOptions.map((option, index) => (
              <Option key={index} value={option?.name}>
                {option?.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Business Class">
          <Input
            value={partnerData.businessClass.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.businessClass.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="Reviewer">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select reviewers"
            value={partnerData.reviewer.values.map(reviewer => reviewer?.name).filter((val): val is string => val !== undefined)}
            onChange={(selectedValues) => {
              const finalValues = selectedValues.map(selectedName => 
                reviewerOptions.find(option => option?.name === selectedName)
              );
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.reviewer.values = finalValues;
                  }
                })
              );
            }}
          >
            {reviewerOptions.map((option, index) => (
              <Option key={index} value={option?.name}>
                {option?.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Continue with the rest of your form items */}
        <Form.Item label="Short Code ID">
          <Input
            value={partnerData.shortCodeId.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.shortCodeId.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="Industry Type">
          <Input
            value={partnerData.industryType.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.industryType.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="Business Category">
          <Input
            value={partnerData.businessCategory.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.businessCategory.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="Average Selling Price">
          <Input
            value={partnerData.averageSellingPrice.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.averageSellingPrice.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="Alias">
          <Input
            value={partnerData.alias.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.alias.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="Location">
          <Input
            value={partnerData.location.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.location.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="Entity Type ID">
          <Input
            value={partnerData.entityTypeId.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.entityTypeId.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="ID">
          <Input
            value={partnerData.id.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.id.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>

        <Form.Item label="Email">
          <Input
            type="email"
            value={partnerData.email.values}
            onChange={(e) => 
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.email.values = e.target.value;
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
            value={partnerData.userRoles.values.map(role => role?.name).filter((val): val is string => val !== undefined)}
            onChange={(selectedValues) => {
              const finalValues = selectedValues.map(selectedName => 
                partnerData.userRoles.options.data.find(option => option?.name === selectedName)
              );
              setPartner((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.userRoles.values = finalValues;
                  }
                })
              );
            }}
          >
            {partnerData.userRoles.options.data.map((option, index) => (
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
                    onClick={isEditable ? handleSave : toggleEditMode}
                  >
                    {isEditable ? 'Save' : 'Edit'}
                  </Button>
                </div>
              }
            >
              {partnerData ? (
                isEditable ? renderEditMode() : renderViewMode()
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text type="secondary">No partner data available</Text>
                </div>
              )}
            </Card>
          </div>
  );
}