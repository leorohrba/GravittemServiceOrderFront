import React from "react"
import NewSimpleSearch from '@components/NewSimpleSearch'
import { Button, Form, DatePicker, Row, Col, Spin, Menu, Dropdown } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { AppointmentHoursContext } from "../context/AppointmentHoursContext";
import { notNullUndefined } from "@utils/generics";

const { RangePicker } = DatePicker

export default function AppointmentHoursHeader() {
    const {
        tableData,
        searchOptions, 
        loadingSearchOptions, 
        getReport,
        handleExportExcel,
        tags, 
        setTags,
        loadingExport,
        loadingTable
    } = AppointmentHoursContext()

    const rules = [{
        required: true,
        message: formatMessage({
            id: 'requiredFieldMessage',
          }),
    }]
    
    const exportMenu = () => (
        <Menu>
          <Menu.Item key={1} onClick={handleExportExcel}>
            Excel
          </Menu.Item>
        </Menu>
    )

    const disableExport = tableData?.length == 0 || !notNullUndefined(tableData) || loadingExport || loadingTable
    
    const exportDropdown = (
        <Dropdown 
            overlay={exportMenu} 
            disabled={disableExport}
        >
            <Button loading={loadingExport || loadingTable} className="iconButton ml-auto">
                <i className="fa fa-download fa-lg mr-3" />
                Exportar
            </Button>
        </Dropdown>
    )

    return (
        <div>
            <Form id="reportForm" layout="vertical" onFinish={(values) => getReport(values)}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Data apontamento" name="appointmentPeriod" rules={rules}>
                            <RangePicker
                                className="w-full"
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Spin spinning={loadingSearchOptions}>
                            <Form.Item label="Pesquise por" className="ml-4">
                                <NewSimpleSearch 
                                    searchOptions={searchOptions}
                                    setTags={setTags}
                                    tags={tags}
                                    hideSaveSearch
                                    getSelectLabel
                                    selectOptionsWidth={240}
                                    searchBoxWidth={400}
                                    hideSearchButton
                                />
                            </Form.Item>
                        </Spin>
                    </Col>
                </Row>
                <Row>
                    <Button 
                        type="primary" 
                        className="mt-1"
                        form="reportForm"
                        htmlType="submit"
                    >
                        Gerar relatório
                    </Button>
                    {exportDropdown}
                </Row>
            </Form>
        </div>
    )
}