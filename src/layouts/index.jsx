/* eslint-disable */
import '@ant-design/compatible/assets/index.css'
import { message, notification, ConfigProvider } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import ptBR from 'antd/es/locale/pt_BR';
import moment from 'moment';
import 'moment/locale/pt';


function BasicLayout({ children }) {
  message.config({
    top: 30,
    maxCount: 3,
    duration: 3,
  })
  notification.config({
    placement: 'bottomRight',
    bottom: 50,
    duration: 10,
  })
  return (
     <ConfigProvider locale={ptBR}>
    <div>
      {process.env.UMI_ENV === 'qa' ||
      process.env.UMI_ENV === 'sat' ||
      process.env.UMI_ENV === 'master' ? (
        <ErrorBoundary>{children}</ErrorBoundary>
      ) : (
        children
      )}
    </div>
            </ConfigProvider>
  )
}

BasicLayout.propTypes = {
  children: PropTypes.node,
}

export default BasicLayout
