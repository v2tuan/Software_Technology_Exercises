import { useEffect, useState } from 'react'
import { notification, Table } from 'antd'
import { getUserApi } from '../util/api'   // đúng path code bạn đã tạo

const UserPage = () => {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserApi()  // axios interceptor đã unwrap -> res = data
        // nếu backend trả mảng user => set thẳng; nếu trả object {EC, data} thì đổi theo
        if (Array.isArray(res)) setDataSource(res)
        else if (Array.isArray(res?.data)) setDataSource(res.data)
        else setDataSource([])
      } catch (err) {
        notification.error({
          message: 'Unauthorized',
          description: err?.message || 'Bạn chưa đăng nhập hoặc token hết hạn'
        })
      }
    }
    fetchUser()
  }, [])

  const columns = [
    { title: 'Id', dataIndex: '_id' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Role', dataIndex: 'role' }
  ]

  return (
    <div style={{ padding: 30 }}>
      <Table bordered dataSource={dataSource} columns={columns} rowKey={'_id'} />
    </div>
  )
}

export default UserPage