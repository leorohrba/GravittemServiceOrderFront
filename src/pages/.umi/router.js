import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/home/leo/Desktop/work/dashboard/GravittemServiceOrderFront/src/pages/.umi/LocaleWrapper.jsx';

const Router = DefaultRouter;

const routes = [
  {
    path: '/',
    component: require('../../layouts/index.jsx').default,
    routes: [
      {
        path: '/Administration/IssuedInvoiceReport',
        exact: true,
        component: require('../Administration/IssuedInvoiceReport/index.jsx')
          .default,
        breadcrumb: 'Relatório de boletos emitidos geral',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Administration/LicenseManagement',
        exact: true,
        component: require('../Administration/LicenseManagement/index.jsx')
          .default,
        breadcrumb: 'Gestão de licenças',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Administration',
        exact: true,
        component: require('../Administration/index.jsx').default,
        breadcrumb: 'Administration',
        type: 'Menu',
        hideOnPage: true,
        hide: true,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Assets/detail/:id?',
        exact: true,
        component: require('../Assets/detail/$id$.jsx').default,
        breadcrumb: 'Cadastro do ativo',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Assets',
        exact: true,
        component: require('../Assets/index.jsx').default,
        breadcrumb: 'Ativos',
        type: 'Menu',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/DashboardOS',
        exact: true,
        component: require('../DashboardOS/index.jsx').default,
        breadcrumb: 'Dashboard OS',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/DocumentGenerator/NewField',
        exact: true,
        component: require('../DocumentGenerator/NewField/index.jsx').default,
        breadcrumb: 'Novo campo',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/DocumentGenerator/NewFieldType',
        exact: true,
        component: require('../DocumentGenerator/NewFieldType/index.jsx')
          .default,
        breadcrumb: 'Novo tipo de campo',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/DocumentGenerator',
        exact: true,
        component: require('../DocumentGenerator/index.jsx').default,
        breadcrumb: 'Gerador de documento',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ImportSpreadsheet/ImportSpreadsheetScreen/content',
        exact: true,
        component: require('../ImportSpreadsheet/ImportSpreadsheetScreen/content.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ImportSpreadsheet/ImportSpreadsheetScreen',
        exact: true,
        component: require('../ImportSpreadsheet/ImportSpreadsheetScreen/index.tsx')
          .default,
        breadcrumb: 'Importar planilha',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ImportSpreadsheet',
        exact: true,
        component: require('../ImportSpreadsheet/index.tsx').default,
        breadcrumb: 'Importação de Planilha',
        type: 'Menu',
        hide: true,
        hideOnPage: true,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Log',
        exact: true,
        component: require('../Log/index.jsx').default,
        breadcrumb: 'Log',
        type: 'Menu',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/MaterialRequest/detail/:id?',
        exact: true,
        component: require('../MaterialRequest/detail/$id$.jsx').default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/MaterialRequest',
        exact: true,
        component: require('../MaterialRequest/index.jsx').default,
        breadcrumb: 'Requisição de peças',
        type: 'Menu',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/MaterialRequest/print/PrintRequest',
        exact: true,
        component: require('../MaterialRequest/print/PrintRequest.jsx').default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/MaterialRequest/print/:id?',
        exact: true,
        component: require('../MaterialRequest/print/$id$.jsx').default,
        breadcrumb: 'Impressão da Requisição',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Network/NewNetwork',
        exact: true,
        component: require('../Network/NewNetwork/index.jsx').default,
        breadcrumb: 'Nova rede',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Network',
        exact: true,
        component: require('../Network/index.jsx').default,
        breadcrumb: 'Redes',
        type: 'Menu',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Notification/DistributionList/NewDistributionList',
        exact: true,
        component: require('../Notification/DistributionList/NewDistributionList/index.jsx')
          .default,
        breadcrumb: 'Nova lista de distribuição',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Notification/DistributionList',
        exact: true,
        component: require('../Notification/DistributionList/index.jsx')
          .default,
        breadcrumb: 'Lista de distribuição',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Notification/NotificationManagement',
        exact: true,
        component: require('../Notification/NotificationManagement/index.jsx')
          .default,
        breadcrumb: 'Gestão de notificação',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Notification/NotificationType',
        exact: true,
        component: require('../Notification/NotificationType/index.jsx')
          .default,
        breadcrumb: 'Tipo de notificação',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Notification',
        exact: true,
        component: require('../Notification/index.jsx').default,
        breadcrumb: 'Notificações',
        type: 'Menu',
        hide: true,
        hideOnPage: true,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/Assets/detail/:id?',
        exact: true,
        component: require('../OccurrenceRoutine/Assets/detail/$id$.jsx')
          .default,
        breadcrumb: 'Cadastro do ativo',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/Assets',
        exact: true,
        component: require('../OccurrenceRoutine/Assets/index.jsx').default,
        breadcrumb: 'Ativos',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path:
          '/OccurrenceRoutine/AttendanceAndOccurrence/detail/EditAttendance',
        exact: true,
        component: require('../OccurrenceRoutine/AttendanceAndOccurrence/detail/EditAttendance.jsx')
          .default,
        breadcrumb: 'Editar atendimento',
        hide: true,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/AttendanceAndOccurrence/detail/:id?',
        exact: true,
        component: require('../OccurrenceRoutine/AttendanceAndOccurrence/detail/$id$.jsx')
          .default,
        breadcrumb: 'Editar atendimento',
        hide: true,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/AttendanceAndOccurrence',
        exact: true,
        component: require('../OccurrenceRoutine/AttendanceAndOccurrence/index.jsx')
          .default,
        breadcrumb: 'Atendimentos e ocorrências',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/AttendanceCategory',
        exact: true,
        component: require('../OccurrenceRoutine/AttendanceCategory/index.jsx')
          .default,
        breadcrumb: 'Categoria do atendimento',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/AttendanceChannel',
        exact: true,
        component: require('../OccurrenceRoutine/AttendanceChannel/index.jsx')
          .default,
        breadcrumb: 'Canal de atendimento',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/AttendanceClassification',
        exact: true,
        component: require('../OccurrenceRoutine/AttendanceClassification/index.jsx')
          .default,
        breadcrumb: 'Classificação do atendimento',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/AttendanceRequest',
        exact: true,
        component: require('../OccurrenceRoutine/AttendanceRequest/index.jsx')
          .default,
        breadcrumb: 'Solicitar atendimento',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/CheckInCheckOut',
        exact: true,
        component: require('../OccurrenceRoutine/CheckInCheckOut/index.jsx')
          .default,
        breadcrumb: 'Relatório de check-in e check-out',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/Dashboard',
        exact: true,
        component: require('../OccurrenceRoutine/Dashboard/index.jsx').default,
        breadcrumb: 'Dashboard',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/Dashboard/views/AttendanceView',
        exact: true,
        component: require('../OccurrenceRoutine/Dashboard/views/AttendanceView.jsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/DashboardOS',
        exact: true,
        component: require('../OccurrenceRoutine/DashboardOS/index.jsx')
          .default,
        breadcrumb: 'Dashboard OS',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/Map',
        exact: true,
        component: require('../OccurrenceRoutine/Map/index.jsx').default,
        breadcrumb: 'Mapa',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/PersonGroup/detail/:id?',
        exact: true,
        component: require('../OccurrenceRoutine/PersonGroup/detail/$id$.jsx')
          .default,
        breadcrumb: 'Novo grupo',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/PersonGroup',
        exact: true,
        component: require('../OccurrenceRoutine/PersonGroup/index.jsx')
          .default,
        breadcrumb: 'Grupo de pessoas',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/Priority',
        exact: true,
        component: require('../OccurrenceRoutine/Priority/index.jsx').default,
        breadcrumb: 'Prioridade',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine/StatusAndReason',
        exact: true,
        component: require('../OccurrenceRoutine/StatusAndReason/index.jsx')
          .default,
        breadcrumb: 'Status e motivo',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/OccurrenceRoutine',
        exact: true,
        component: require('../OccurrenceRoutine/index.jsx').default,
        breadcrumb: 'Atendimento',
        type: 'Menu',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Permissions/PermissionsCompaniesGroups',
        exact: true,
        component: require('../Permissions/PermissionsCompaniesGroups/index.jsx')
          .default,
        breadcrumb: 'Grupos de empresas',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Permissions/PermissionsGroups/NewPermissionGroup',
        exact: true,
        component: require('../Permissions/PermissionsGroups/NewPermissionGroup.jsx')
          .default,
        breadcrumb: 'Novo grupos de permissões',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Permissions/PermissionsGroups',
        exact: true,
        component: require('../Permissions/PermissionsGroups/index.jsx')
          .default,
        breadcrumb: 'Grupos de permissões',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Permissions/PermissionsSupportGroups',
        exact: true,
        component: require('../Permissions/PermissionsSupportGroups/index.jsx')
          .default,
        breadcrumb: 'Grupos de Suportes',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Permissions/Users',
        exact: true,
        component: require('../Permissions/Users/index.jsx').default,
        breadcrumb: 'Usuarios',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Permissions',
        exact: true,
        component: require('../Permissions/index.jsx').default,
        breadcrumb: 'Permissões',
        type: 'Menu',
        hide: true,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Purchase/PurchaseOrder/NewPurchaseOrder',
        exact: true,
        component: require('../Purchase/PurchaseOrder/NewPurchaseOrder/index.jsx')
          .default,
        breadcrumb: 'Novo pedido de compra',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Purchase/PurchaseOrder',
        exact: true,
        component: require('../Purchase/PurchaseOrder/index.jsx').default,
        breadcrumb: 'Pedido de compra',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Purchase/PurchaseRequest/QuotationData',
        exact: true,
        component: require('../Purchase/PurchaseRequest/QuotationData.jsx')
          .default,
        breadcrumb: 'Cotação fornecedor',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Purchase/PurchaseRequest/email/QuotationReceivedEmail',
        exact: true,
        component: require('../Purchase/PurchaseRequest/email/QuotationReceivedEmail.jsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Purchase/PurchaseRequest/email/QuotationRequestEmail',
        exact: true,
        component: require('../Purchase/PurchaseRequest/email/QuotationRequestEmail.jsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Purchase/PurchaseRequest',
        exact: true,
        component: require('../Purchase/PurchaseRequest/index.jsx').default,
        breadcrumb: 'Solicitação de compra',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Purchase/QuotationAnalysis/Detail',
        exact: true,
        component: require('../Purchase/QuotationAnalysis/Detail/index.jsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Purchase/QuotationAnalysis',
        exact: true,
        component: require('../Purchase/QuotationAnalysis/index.jsx').default,
        breadcrumb: 'Análise de cotação',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Purchase',
        exact: true,
        component: require('../Purchase/index.jsx').default,
        breadcrumb: 'Compras',
        type: 'Menu',
        hide: true,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Region/detail/RegionModal',
        exact: true,
        component: require('../Region/detail/RegionModal.jsx').default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Region/detail/:id?',
        exact: true,
        component: require('../Region/detail/$id$.jsx').default,
        breadcrumb: 'Cadastro de regiões',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Region',
        exact: true,
        component: require('../Region/index.jsx').default,
        breadcrumb: 'Regiões',
        type: 'Menu',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Schedule/Calendar/NewCalendar',
        exact: true,
        component: require('../Schedule/Calendar/NewCalendar/index.jsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Schedule/Calendar',
        exact: true,
        component: require('../Schedule/Calendar/index.jsx').default,
        breadcrumb: 'Calendário',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Schedule/Configuration',
        exact: true,
        component: require('../Schedule/Configuration/index.jsx').default,
        breadcrumb: 'Configuração de agenda',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Schedule/HoursClassification',
        exact: true,
        component: require('../Schedule/HoursClassification/index.jsx').default,
        breadcrumb: 'Classificação de horas',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Schedule',
        exact: true,
        component: require('../Schedule/index.jsx').default,
        breadcrumb: 'Agenda',
        type: 'Menu',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Schedule/interfaces',
        exact: true,
        component: require('../Schedule/interfaces/index.tsx').default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport/content',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/content.jsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/index.jsx')
          .default,
        breadcrumb: 'Importação ordem de serviço',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport/interfaces/IDataExport',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/interfaces/IDataExport.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport/interfaces/IDetailData',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/interfaces/IDetailData.ts')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport/interfaces/IDetailModalProps',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/interfaces/IDetailModalProps.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path:
          '/ServiceOrder/ServiceOrderImport/interfaces/IEnterpriseInterface',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/interfaces/IEnterpriseInterface.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport/interfaces/IRecord',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/interfaces/IRecord.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport/interfaces/ISearchOptions',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/interfaces/ISearchOptions.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path:
          '/ServiceOrder/ServiceOrderImport/interfaces/IServiceOrdersTableProps',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/interfaces/IServiceOrdersTableProps.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport/interfaces/ITableData',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/interfaces/ITableData.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport/interfaces/ITag',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/interfaces/ITag.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderImport/services',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderImport/services.ts')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/ServiceOrderParts/:id?',
        exact: true,
        component: require('../ServiceOrder/ServiceOrderParts/$id$.tsx')
          .default,
        breadcrumb: 'Peças da OS',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder',
        exact: true,
        component: require('../ServiceOrder/index.jsx').default,
        breadcrumb: 'Ordem de serviço',
        type: 'Menu',
        hide: true,
        hideOnPage: true,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/ServiceOrder/services/ServiceOrder',
        exact: true,
        component: require('../ServiceOrder/services/ServiceOrder.tsx').default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/AppointmentHours',
        exact: true,
        component: require('../Services/AppointmentHours/index.jsx').default,
        breadcrumb: 'Relatório de horas apontadas',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/AppointmentHours/service',
        exact: true,
        component: require('../Services/AppointmentHours/service.tsx').default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/Asset/NewAsset',
        exact: true,
        component: require('../Services/Asset/NewAsset/index.jsx').default,
        breadcrumb: 'Novo ativo',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/Asset',
        exact: true,
        component: require('../Services/Asset/index.jsx').default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/Modal/CRMPersonModal',
        exact: true,
        component: require('../Services/NewService/Modal/CRMPersonModal.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/Modal',
        exact: true,
        component: require('../Services/NewService/Modal/index.jsx').default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/Tabs/GeneralTab',
        exact: true,
        component: require('../Services/NewService/Tabs/GeneralTab.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/Tabs/SchedulingTab',
        exact: true,
        component: require('../Services/NewService/Tabs/SchedulingTab.jsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService',
        exact: true,
        component: require('../Services/NewService/index.jsx').default,
        breadcrumb: 'Novo serviço',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path:
          '/Services/NewService/interfaces/ClassificationServiceOrderInterface',
        exact: true,
        component: require('../Services/NewService/interfaces/ClassificationServiceOrderInterface.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/interfaces/InputOptionInterface',
        exact: true,
        component: require('../Services/NewService/interfaces/InputOptionInterface.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/interfaces/PartKitInterface',
        exact: true,
        component: require('../Services/NewService/interfaces/PartKitInterface.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/interfaces/PartKitPartInterface',
        exact: true,
        component: require('../Services/NewService/interfaces/PartKitPartInterface.tsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/interfaces/PersonAddressCRMInterface',
        exact: true,
        component: require('../Services/NewService/interfaces/PersonAddressCRMInterface.ts')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/interfaces/PersonCRMInterface',
        exact: true,
        component: require('../Services/NewService/interfaces/PersonCRMInterface.ts')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/interfaces/TechnicalInterface',
        exact: true,
        component: require('../Services/NewService/interfaces/TechnicalInterface.ts')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/NewService/utils',
        exact: true,
        component: require('../Services/NewService/utils.ts').default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/Questionnaire',
        exact: true,
        component: require('../Services/Questionnaire/index.jsx').default,
        breadcrumb: 'Questionário',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/ServiceOrderManager/Detail/Default',
        exact: true,
        component: require('../Services/ServiceOrderManager/Detail/Default/index.jsx')
          .default,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services/ServiceOrderManager',
        exact: true,
        component: require('../Services/ServiceOrderManager/index.jsx').default,
        breadcrumb: 'Ordem de serviço',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/Services',
        exact: true,
        component: require('../Services/index.jsx').default,
        breadcrumb: 'Serviços',
        type: 'Menu',
        hide: true,
        hideOnPage: true,
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        path: '/',
        exact: true,
        component: require('../index.jsx').default,
        breadcrumb: 'Rotas',
        _title: 'my-app',
        _title_default: 'my-app',
      },
      {
        component: () =>
          React.createElement(
            require('/home/leo/Desktop/work/dashboard/GravittemServiceOrderFront/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: false },
          ),
        _title: 'my-app',
        _title_default: 'my-app',
      },
    ],
    _title: 'my-app',
    _title_default: 'my-app',
  },
  {
    component: () =>
      React.createElement(
        require('/home/leo/Desktop/work/dashboard/GravittemServiceOrderFront/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: false },
      ),
    _title: 'my-app',
    _title_default: 'my-app',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
