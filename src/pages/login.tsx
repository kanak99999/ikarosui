import { Form, Input, Button, Card, Typography, message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './login.module.css';

const { Title } = Typography;

export default function LoginPage() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();

    const onFinish = async (values: any) => {
        try {
            const data = {
                username: values.username,
                password: values.password,
                email: '',
                clientId: values.clientId
            };
            const response = await axios.post(apiBaseUrl + '/auth/generateToken', data);
            localStorage.setItem("iToken", response.data.accessToken);
            router.push('/');
        } catch (err) {
            message.error('Invalid credentials');
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.loginCard}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Welcome Back
                </Title>
                <Form
                    name="login"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Client ID"
                        name="clientId"
                        rules={[{ required: true, message: 'Please input your Client ID!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
