import { DesktopOutlined, EditOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SaveOutlined } from '@ant-design/icons';
import { 
    Button,
    Layout, 
    Menu, 
    theme, 
    MenuProps
  } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useEffect, useState } from 'react';
import MyHeader from './MyHeader';
import React from 'react';
import { HomeAPIData, HomeAPIResponse } from '@/types/APIResponses/HomeApi';
import axiosInstance from '@/axiosClient';
import {useStore} from '@/GlobalState';
import { useRouter } from 'next/router';

const MyLayout = ({ children }: { children: React.ReactNode }) => {
    // Move all state declarations inside the component function
    const [collapsed, setCollapsed] = useState(true);
    const [items, setData] = useState<MenuProps['items']>([]);
    const [selectedMenu, setSelectedMenu] = useState<string|null>(null);
    const [menuList, setMenuList] = useState<any>();
    const router = useRouter();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    
    const handleMenuClick = (e: any) => {
        console.log('Clicked menu item:', e.key);
        setSelectedMenu(e.key);

        if (menuList) {
            for (const key in menuList) {
              menuList[key].forEach((item1: { id: number , name: string}) => {
              if (item1.id.toString() === e.key) {
                console.log('Label:', item1.name);
                router.push('/' + item1.name.toLowerCase());
              }
            });
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            if (useStore.getState().menu.length > 0) {
              setData(useStore.getState().menu);
            }
            else{
            console.log("going to fetch left menu data");
            const response = await axiosInstance.get<HomeAPIResponse>('/home');
            const res : HomeAPIData  =  response.data.response;
            const menu: any[] = [];
            let i = 101;
            for (const key in res.listData) {
              const menuItem = {
                key: i + '',
                icon: <DesktopOutlined />,
                label: key,
                children: res.listData[key].map((x) => ({
                  key: x.id,
                  label: x.name,
                })),
              };
              i++;
              menu.push(menuItem);
            }
            useStore.getState().setMenu(menu);
            setData(menu);
            setMenuList(res.listData);
        }
          } catch (err) {
            console.error(err);
            setError('Failed to fetch data');
          }
        };
    
        fetchData();
      }, []);
    return(
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed}
                style={{ 
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 10
                }}
            >
                <Button
                type="text"
                icon={
                    collapsed ? (
                    <MenuUnfoldOutlined style={{ fontSize: '25px' }} />
                    ) : (
                    <MenuFoldOutlined style={{ fontSize: '25px' }} />
                    )
                }
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 80,
                    height: 75,
                    color: 'white',
                }}
                />
                <Menu theme="dark" mode="inline" items={items} onClick={handleMenuClick}/>
            </Sider>
            <Layout style={{ 
                marginLeft: collapsed ? 80 : 200,
                transition: 'all 0.2s'
            }}>
                <Header 
            style={{ 
                padding: 0, 
                background: colorBgContainer,
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
            >
            <MyHeader />
                </Header>
                <Content
                    style={{
                    margin: '24px 16px',
                    overflow: 'auto',
                    height: 'calc(100vh - 64px)', // 64px is the header height
                    background: colorBgContainer,
                    padding: '0',
                }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default MyLayout;

function setError(arg0: string) {
    console.log('Error==> '+arg0);
}
