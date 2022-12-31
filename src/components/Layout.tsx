import { CheckCircleOutlined, DotChartOutlined } from '@ant-design/icons';
import { Avatar, Layout as L, Menu, theme, Typography } from 'antd';
import { useRouter } from 'next/router';
import logo from 'src/assets/react.svg';
import Image from 'next/image';

const { Header, Content, Sider } = L;
type Props = {
  children?: React.ReactNode;
};
export default function Layout(props: Props) {
  const router = useRouter();
  const {
    token: { colorWhite },
  } = theme.useToken();
  return (
    <L style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div
          style={{
            height: 32,
            margin: 16,
            gap: 8,
            display: 'flex',
          }}
          onClick={() => router.push('/')}
        >
          <Image src={logo} alt="Logo" width={40} height={40} />
          <Typography.Text style={{ fontSize: 24, color: '#fff' }}>Mangoo</Typography.Text>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={[
            { key: '1', label: 'My Tasks', icon: <CheckCircleOutlined />, onClick: () => router.push('/tasks') },
            { key: '2', label: 'Reporting', icon: <DotChartOutlined />, onClick: () => router.push('/reports') },
            {
              type: 'group',
              label: <Typography.Text style={{ color: colorWhite }}>Workspace</Typography.Text>,
              children: [
                { key: 'c1', label: 'Mission to the moon' },
                { key: 'c3', label: 'Save the earth' },
              ],
            },
          ]}
        />
      </Sider>
      <L className="site-layout">
        <Header style={{ display: 'flex', justifyContent: 'flex-end', paddingInline: 20 }}>
          <div>
            <Avatar size="large" style={{ background: '#7265e6' }}>
              HN
            </Avatar>
          </div>
        </Header>
        <Content style={{ padding: 24, margin: 0, overflow: 'auto' }}>{props.children}</Content>
      </L>
    </L>
  );
}
