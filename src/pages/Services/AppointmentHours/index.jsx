/**
 * breadcrumb: Relatório de horas apontadas
 */

import React from "react";
import { AppointmentHoursProvider } from "./context/AppointmentHoursContext";
import AppointmentHoursHeader from "./components/AppointmentHoursHeader";
import AppointmentHoursTable from "./components/AppointmentHoursTable";

function AppointmentHours() {
    return (
        <AppointmentHoursProvider>
            <div className="container">
                <AppointmentHoursHeader />
                <AppointmentHoursTable />
            </div>
        </AppointmentHoursProvider>   
    )
}

export default AppointmentHours