import constate from "constate";
import { useState, useEffect } from "react";
import { getExportExcel } from "../service";
import { ITags } from "@Interfaces/TagsInterface";
import { Moment } from "moment";
import { notNullUndefined } from "@utils/generics";
import { getServiceUtils } from "@utils/services";
import { apiCRM, apiService } from "@services/api";
import { IOwner } from "@Interfaces/OwnerInterface";
import { ISearchOptions } from "@Interfaces/SearchOptionsInterface";

function UseAppointmentHours() {
    const [tableData, setTableData] = useState<any[]>()
    const [searchOptions, setSearchOptions] = useState<ISearchOptions>()
    const [loadingSearchOptions, setLoadingSearchOptions] = useState<boolean>(true)
    const [tags, setTags] = useState<ITags[]>([])
    const [loadingTable, setLoadingTable] = useState<boolean>(false)
    const [loadingExport, setLoadingExport] = useState<boolean>(false)
    const [reportParams, setReportParams] = useState<any>({})
    const [owner, setOwner] = useState<IOwner>(null)

    useEffect(() => {
        getServiceUtils(`/api/BuscarHorasApontadasView/Campos`, setSearchOptions, setLoadingSearchOptions, apiService)
        getServiceUtils(`/api/CRM/Owner`, setOwner, null, apiCRM)
    }, [])

    const getTagsFields = () => {
        const tagParams = {}

        const getField = (tag: any) => {
            return tag.fieldType === "rangeDate" ? tag.searchFieldValue.map((date: Moment) => date.format("DD-MM-YYYY")).join("|") : tag.searchFieldValue
        }

        tags.forEach(tag => tagParams[tag.fieldValue] =
            notNullUndefined(tagParams[tag.fieldValue]) 
            ? tagParams[tag.fieldValue] + `|${getField(tag)}` 
            : getField(tag)
        )

        return tagParams
    }

    const getPeriod = (periodArray: Moment[]) => {
        return `${periodArray[0].format("DD-MM-YYYY 00:00:00")}|${periodArray[1].format("DD-MM-YYYY 23:59:59")}`
    }

    const getReport = (values: {appointmentPeriod: Moment[]}) => {
        const params = {
            periodoApontamento: getPeriod(values.appointmentPeriod),
            empresaId: owner?.ownerId,
            ...getTagsFields()
        }
        setReportParams(params)
        getServiceUtils(`/api/BuscarHorasApontadasView`, setTableData, setLoadingTable, apiService, null, params)
    }

    const handleExportExcel = () => {
        getExportExcel(reportParams, setLoadingExport)
    }

    return {
        tableData, 
        setTableData,
        searchOptions, 
        loadingSearchOptions,
        getReport,
        handleExportExcel,
        loadingTable,
        tags, 
        setTags,
        loadingExport
    }
}

const [AppointmentHoursProvider, AppointmentHoursContext] = constate(UseAppointmentHours)

export {AppointmentHoursProvider, AppointmentHoursContext}