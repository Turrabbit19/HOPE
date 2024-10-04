import { Layout } from 'antd'
import React from 'react'
import HeaderStudent from './header'
import AsideStudent from './aside'
import ContentStudent from './content'

const LayoutStudent = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderStudent />
      <Layout>
        <AsideStudent />
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <ContentStudent />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default LayoutStudent