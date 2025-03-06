/**
 * breadcrumb: Nova lista de distribuição
 */
import Breadcrumb from '@components/Breadcrumb'
import { Form, message } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import NewDistributionListCards from './components/NewDistributionListCards'
import NewDistributionListFooter from './components/NewDistributionListFooter'
import NewDistributionListForm from './components/NewDistributionListForm'
import { NewDistributionListDataProvider } from './context/NewDistributionList'

export default function NewDistributionList() {
  const [form] = Form.useForm()

  function handleSave() {
    form.validateFields().then(values => {
      message.success(
        formatMessage({
          id: 'successSave',
        }),
      )
      form.resetFields()
    })
  }

  return (
    <div className="container">
      <Breadcrumb />
      <NewDistributionListDataProvider>
        <NewDistributionListForm {...{ form }} />
        <NewDistributionListCards />
        <NewDistributionListFooter {...{ handleSave }} />
      </NewDistributionListDataProvider>
    </div>
  )
}
