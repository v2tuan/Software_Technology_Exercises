import { CrownOutlined } from '@ant-design/icons'
import { Result } from 'antd'

const HomePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <Result
        icon={<CrownOutlined />}
        title="JSON Web Token (React/Node.js)"
        subTitle="Demo login + gọi API bảo vệ bằng JWT"
      />
    </div>
  )
}

export default HomePage