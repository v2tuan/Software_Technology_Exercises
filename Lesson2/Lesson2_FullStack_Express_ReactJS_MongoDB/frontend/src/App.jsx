import { Outlet } from 'react-router-dom';
import Header from './components/layout/header.jsx';
import { useContext, useEffect } from 'react';
import AuthContext from './components/context/auth.context';
import { Spin } from 'antd';
import { getAccountApi } from './util/api'; // API trả về info user nếu có token

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        // Backend của bạn có /v1/api/account trả về req.user
        const res = await getAccountApi(); // kỳ vọng { email, name } hoặc { user:{...} }
        const user = res?.user ?? res;

        if (user?.email) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: user.email || '',
              name: user.name || ''
            }
          });
        }
      } catch (_) {
        console.log('Fetch account error or no token' + _);
        // 401 đã được axios interceptor xử lý (redirect /login) nếu bạn bật
      } finally {
        setAppLoading(false);
      }
    };

    fetchAccount();
  }, [setAuth, setAppLoading]);

  if (appLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default App;