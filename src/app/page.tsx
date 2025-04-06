"use client";

import React, { useState, useEffect, JSX } from 'react';
import MyHeader from '../components/MyHeader';
import {
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, theme } from 'antd';
import IkarosContent from '../components/IkarosContent';
import axiosInstance from '../axiosClient';
import { HomeAPIResponse, HomeAPIData} from '@/types/APIResponses/HomeApi';
import { redirect } from 'next/navigation';
const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  /*
  const [collapsed, setCollapsed] = useState(true);
  const [items, setData] = useState<MenuProps['items']>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string|null>(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
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
        setData(menu);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);
  const handleClick: MenuProps['onClick'] = (e) => {
    console.log('Clicked menu item:', e.key);
    setSelectedMenu(e.key);
  };
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
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
        <Menu theme="dark" mode="inline" items={items} onClick={handleClick}/>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <MyHeader />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {error && selectedMenu==null ? <div>Error: {error}</div> : <IkarosContent listId={selectedMenu} />}
        </Content>
      </Layout>
    </Layout>
  );*/
  redirect('/home');
};

export default App;
