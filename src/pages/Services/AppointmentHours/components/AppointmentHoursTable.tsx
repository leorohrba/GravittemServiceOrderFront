import React from "react"
import { Tabs } from "antd"
import DefaultTable from "@components/DefaultTable"
import { AppointmentHoursContext } from "../context/AppointmentHoursContext"
import { appointmentHoursColumns } from "../utils/columns/AppointmentHoursColumns"

const { TabPane } = Tabs

export default function AppointmentHoursTable() {
    const {
        tableData,
        loadingTable,
        loadingExport
    } = AppointmentHoursContext()

    return (
        <div className="mt-8">
            {/* AJUSTAR QUANDO RECEBER TASK DO GRID */}
            {/* <Tabs defaultActiveKey="1">
                <TabPane key="1" tab="Data de apontamento">
                    <div>Data de apontamento</div>
                </TabPane>
                <TabPane key="2" tab="Ordem de serviço">
                    <div>Ordem de serviço</div>
                </TabPane>
                <TabPane key="3" tab="Cliente">
                    <div>Cliente</div>
                </TabPane>
            </Tabs> */}
            <DefaultTable 
                columns={appointmentHoursColumns}
                loading={loadingTable || loadingExport}
                dataSource={Array.isArray(tableData) ? tableData : []}
                sticky
            />
        </div>
    )
}