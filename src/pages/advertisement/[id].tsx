import axiosInstance from '@/axiosClient';
import { Field, ShowAdvertisementAPIResponse, AdvertisementData, mediaContent } from '@/types/APIResponses/AdvertisementAPI';
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
  MenuProps,
  Dropdown
} from 'antd';
import { EditOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SaveOutlined } from '@ant-design/icons';
import { WorkFlowAPIResponse, WorkFlowData, WorkFlowState } from '@/types/APIResponses/WorkFlowAPI';
import { request } from 'http';
import { Action } from '@/types/APIResponses/EntityListDataAPI';
const { Header, Sider, Content } = Layout;

const { Title, Text } = Typography;
const { Option } = Select;

export default function Advertisement() {
  const router = useRouter();
  const {id} = router.query;
  const [advertisementData, setAdvertisement] = useState<AdvertisementData | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isEditable, setIsEditable] = useState(false);
  const [managerOptions, setManagerOptions] = useState<ManagerOptions>([]);
  const [reviewerOptions, setReviewerOptions] = useState<ReviewerOptions>([]);
  const [workFlowData, setWorkFlowData] = useState<WorkFlowData | null>(null);
  const [workflowMenuProps, setWorkflowMenuProps] = useState<MenuProps>({});
  const [loading, setLoading] = useState(true);
  const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  const toggleEditMode = async () => {
    try {
      const response = await axiosInstance.get<ShowAdvertisementAPIResponse>('/partner/form');
      const responseObject = response.data.body.data;
      const ReviewerAPIResponse = await axiosInstance.get<GetReviewerOptionsAPIResponse>('/options/managers?entityTypeId=12&clientId=1');
      setReviewerOptions(ReviewerAPIResponse.data.response);
      const ManagerAPIResponse = await axiosInstance.get<GetManagerOptionsAPIResponse>('/options/managers?entityTypeId=12&clientId=1');
      setManagerOptions(ManagerAPIResponse.data.response);
      setIsEditable(prevState => !prevState);
    } catch (error) {
      message.error('Failed to load edit options');
    }
  };

  const handleSave = async () => {
    try {
      const json = {"body": {"data": advertisementData}};
      const response = await axiosInstance.post('/advertisement/edit', json);
      if(response.status === 200){
        message.success('Changes saved successfully');
        setIsEditable(false);
      }
    } catch (error) {
      message.error('Failed to save changes');
    }
  };
  const getFileType = (file:File) => {
    return file.type.startsWith("image/") ? "Image" : file.type.startsWith("video/") ? "Video" : "unknown;";
  };
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files)
    {
        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("multipartFile", files[i]);
            formData.append("extention", files[i].name.split('.').pop() as string);
            formData.append("clientId","1");

            const response = await axiosInstance.postForm('/file/upload', formData);
            if(response.status !== 200){
                message.error('Failed to upload file');
                return;
            }
            console.log("upload response key : " + response.data.key);
            const  mc:mediaContent = {
                "extension": files[i].name.split('.').pop() as string,
                "name": files[i].name,
                "mediaType": getFileType(files[i]),
                "key": response.data.key
            };
            setAdvertisement((prevData) =>
                produce(prevData, (draft) => {
                    if(draft) {
                        draft.mediaContents.values.push(mc);
                    }
                }));
        }

    }
  };
  const handleRemoveFile = (fileName:string) => {
    setAdvertisement((prevData) =>
        produce(prevData, (draft) => {
            if(draft) {
                draft.mediaContents.values = draft.mediaContents.values.filter((mc) => mc.name !== fileName);
            }
        }));
  };
  const updateWorkflowAction = async (action: WorkFlowState) => {
    setWorkFlowData(produce(draft => {
        if (draft) {
            draft.action = action;
        }
    }));
    
    const requestObject: WorkFlowData = {
        action: action,
        currentState: workFlowData?.currentState ?? action,
        actionList: workFlowData?.actionList ?? []
    };
    try{
    const response = await axiosInstance.post(`/workflow/action/12/${id}`, requestObject);
    } catch (error) {}
    finally{
    router.reload();
    }
}
  useEffect(() => {
    const fetchAdvertisement = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await axiosInstance.get<ShowAdvertisementAPIResponse>('/advertisement/show/' + id);
          const advertisementData = response.data.body.data;
          setAdvertisement(advertisementData);
          const workflowResponse = await axiosInstance.get<WorkFlowAPIResponse>('/workflow/action/12/' + id);
          setWorkFlowData(workflowResponse.data.response);
        } 
        catch (error) {
          message.error('Failed to fetch advertisement data');
        } 
        finally {
          setLoading(false);
        }
      }
    };
    fetchAdvertisement();
  }, [id]);

  useEffect(() => { 
    if (workFlowData) {
        const menuItems = workFlowData.actionList.map(action => ({
            key: action.id,
            label: action.name,
            onClick: () => updateWorkflowAction(action) 
        }));
        setWorkflowMenuProps({items: menuItems});
    }
  }, [workFlowData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading partner data..." />
      </div>
    );
  }

  // Render the view mode using Descriptions
  const renderViewMode = () => {
    if (!advertisementData) return null;
    
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
        <Descriptions.Item label="ID">{advertisementData.id.values}</Descriptions.Item>
        <Descriptions.Item label="Entity Type ID">{advertisementData.entityTypeId.values}</Descriptions.Item>
        <Descriptions.Item label="Short Code ID">{advertisementData.shortCodeId.values}</Descriptions.Item>
        <Descriptions.Item label="Name">{advertisementData.name.values}</Descriptions.Item>
        <Descriptions.Item label="Description">{advertisementData.description.values}</Descriptions.Item>
        <Descriptions.Item label="Manager">
          <Space direction="vertical">
            {advertisementData.manager.values.map((manager, index) => (
              <Text key={index}>{manager?.name}</Text>
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Reviewer">
          <Space direction="vertical">
            {advertisementData.reviewer.values.map((reviewer, index) => (
              <Text key={index}>{reviewer?.name}</Text>
            ))}
          </Space>
        </Descriptions.Item>
        
        <Descriptions.Item label="Advertisement Type">{advertisementData.advertisementType.values}</Descriptions.Item>
        <Descriptions.Item label= "Media Contents">
            <Space direction='horizontal'>
                {advertisementData.mediaContents.values.map((mediaContent, index)=>(
                    <Text key={index}>{mediaContent.name}</Text>
                ))}
            </Space>
        </Descriptions.Item>        
      </Descriptions>
    );
  };

  // Render the edit mode using Form with horizontal layout
  const renderEditMode = () => {
    if (!advertisementData) return null;
    
    return (
      <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
       
        <Form.Item label="ID">
          <Input
            value={advertisementData.id.values}
            onChange={(e) => 
              setAdvertisement((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.id.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="Entity Type ID">
          <Input
            value={advertisementData.entityTypeId.values}
            onChange={(e) => 
              setAdvertisement((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.entityTypeId.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="Short Code ID">
          <Input
            value={advertisementData.shortCodeId.values}
            onChange={(e) => 
              setAdvertisement((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.shortCodeId.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="Name">
          <Input
            value={advertisementData.name.values}
            onChange={(e) => 
              setAdvertisement((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.name.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input
            value={advertisementData.description.values}
            onChange={(e) => 
              setAdvertisement((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.description.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="Manager">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select managers"
            value={advertisementData.manager.values.map(manager => manager?.name).filter((val): val is string => val !== undefined)}
            onChange={(selectedValues) => {
              const finalValues = selectedValues.map(selectedName => 
                managerOptions.find(option => option?.name === selectedName)
              );
              setAdvertisement((prevData) =>
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
        <Form.Item label="Reviewer">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select reviewers"
            value={advertisementData.reviewer.values.map(reviewer => reviewer?.name).filter((val): val is string => val !== undefined)}
            onChange={(selectedValues) => {
              const finalValues = selectedValues.map(selectedName => 
                reviewerOptions.find(option => option?.name === selectedName)
              );
              setAdvertisement((prevData) =>
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
        <Form.Item label="Advertisement Type">
          <Input
            value={advertisementData.advertisementType.values}
            onChange={(e) => 
              setAdvertisement((prevData) =>
                produce(prevData, (draft) => {
                  if(draft) {
                    draft.advertisementType.values = e.target.value;
                  }
                })
              )
            }
          />
        </Form.Item>
        <Form.Item label="Media Contents">
        <div>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleUploadFile}
      />
      <div className="file-list">
        {advertisementData.mediaContents.values.length > 0 && (
          <ul>
            {advertisementData.mediaContents.values.map((file, index) => (
              <li key={index} className="file-item">
                <span>{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(file.name)}
                  style={{
                    marginLeft: "10px",
                    background: "transparent",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
        </Form.Item>       
      </Form>
    );
  };

  return (
          <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={2}>Advertisement </Title>
                  <Button 
                    type="primary" 
                    icon={isEditable ? <SaveOutlined /> : <EditOutlined />}
                    onClick={isEditable ? handleSave : toggleEditMode}
                  >
                    {isEditable ? 'Save' : 'Edit'}
                  </Button>
                  <div>
                    <Dropdown.Button menu={workflowMenuProps}>
                        {workFlowData?.currentState.name}
                    </Dropdown.Button>
                  </div>
                </div>
              }
            >
              {advertisementData ? (
                isEditable ? renderEditMode() : renderViewMode()
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text type="secondary">No Advertisement data available</Text>
                </div>
              )}
            </Card>
          </div>
  );
}