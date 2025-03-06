// ref: https://umijs.org/config/
import webpackConfig from '../plugin'
const servicesInitial =
  process.env.UMI_DEPLOY_ENV === 'dev'
    ? 'services.dev'
    : process.env.UMI_DEPLOY_ENV === 'ccbr-dev'
    ? 'services.ccbr.dev'
    : process.env.UMI_DEPLOY_ENV === 'qa'
    ? 'services.qa'
    : process.env.UMI_DEPLOY_ENV === 'sat'
    ? 'services.sat'
    : process.env.UMI_DEPLOY_ENV === 'diversos'
    ? 'services.diversos'
    : process.env.UMI_DEPLOY_ENV === 'master'
    ? 'services'
    : 'services.dev'

const servicesEnd =
  process.env.UMI_DEPLOY_ENV === 'master'
    ? '.gravittem.com'
    : '.gravittem.com.br'

const gravittemHostInitial =
  process.env.UMI_DEPLOY_ENV === 'dev'
    ? 'dev'
    : process.env.UMI_DEPLOY_ENV === 'ccbr-dev'
    ? 'ccbr.dev'
    : process.env.UMI_DEPLOY_ENV === 'qa'
    ? 'qa'
    : process.env.UMI_DEPLOY_ENV === 'sat'
    ? 'sat'
    : process.env.UMI_DEPLOY_ENV === 'diversos'
    ? 'diversos'
    : process.env.UMI_DEPLOY_ENV === 'master'
    ? 'app'
    : 'dev'

const excludeRoutes = [
  /tabs\//,
  /modals\//,
  /components\//,
  /context\//,
  /utils\//,
  /enums/,
]

const modulesRoutes = [
  /ComponentTest/,
  /Contract\//,
  /Notification\//,
  /financial\//,
  /Licensing\//,
  /MaterialRequest\//,
  /modalsExamples\//,
  /Network\//,
  /OccurrenceRoutine\//,
  /pdfExamples\//,
  /Permissions\//,
  /Registration\//,
  /Schedule\//,
  /Purchase\//,
  /Person\//,
  /Region\//,
  /ServiceOrder\//,
]

const UMI_EXCLUDE_ROUTE = process.env.UMI_EXCLUDE_ROUTE || 'none'

const checkModulesRoutesToExclude =
  UMI_EXCLUDE_ROUTE !== 'none' &&
  modulesRoutes.filter(
    moduleRoute =>
      !String(moduleRoute).includes(UMI_EXCLUDE_ROUTE) &&
      excludeRoutes.push(moduleRoute),
  )

export default {
  chainWebpack: webpackConfig,
  treeShaking: true,
  theme: {
    'primary-color': '#1976D2',
    'text-color': ' rgba(0, 0, 0, 0.85)',
  },
  define: {
    'process.env.UMI_API_HOST_GRAVITTEM': `https://${gravittemHostInitial}${servicesEnd}`,
    'process.env.UMI_API_HOST_HISTORY': `https://${servicesInitial}${servicesEnd}/gravittem/historicos`,
    'process.env.UMI_API_HOST_REGION': `https://${servicesInitial}${servicesEnd}/Gravittem/Regiao`,
    'process.env.UMI_API_HOST_CRM': `https://${servicesInitial}${servicesEnd}/Gravittem/CRM`,
    'process.env.UMI_API_HOST_PERMISSION': `https://${servicesInitial}${servicesEnd}/global/permission`,
    'process.env.UMI_ENV': process.env.UMI_DEPLOY_ENV,
    'process.env.UMI_API_HOST_MATERIAL_REQUEST': `https://${servicesInitial}${servicesEnd}/gravittem/request`,
    'process.env.UMI_API_HOST_ATTENDANCE': `https://${servicesInitial}${servicesEnd}/Gravittem/Atendimento`,
    'process.env.UMI_API_HOST_CHECKLIST': `https://${servicesInitial}${servicesEnd}/gravittem/checklist`,
    'process.env.UMI_API_HOST_CONTRACT': `https://${servicesInitial}${servicesEnd}/gravittem/contract`,
    'process.env.UMI_API_HOST': `http://localhost:5000`,
    'process.env.UMI_API_HOST_COMMENT': `https://${servicesInitial}${servicesEnd}/gravittem/comentarios`,
    'process.env.UMI_API_HOST_ATTACHMENT': `https://${servicesInitial}${servicesEnd}/gravittem/anexos`,
    'process.env.UMI_API_HOST_FINANCIAL': `https://${servicesInitial}${servicesEnd}/gravittem/financeiro`,
    'process.env.UMI_API_HOST_SEARCH': `https://${servicesInitial}${servicesEnd}/gravittem/pesquisas`,
    'process.env.UMI_API_HOST_NEW_CONTRACT': `https://${servicesInitial}${servicesEnd}/gravittem/contrato`,
    'process.env.UMI_API_HOST_QUESTIONNAIRE': `https://${servicesInitial}${servicesEnd}/gravittem/questionario`,
    'process.env.UMI_API_HOST_PERSON': `https://${servicesInitial}${servicesEnd}/gravittem/Pessoa`,
    'process.env.UMI_API_HOST_SCHEDULE': `https://${servicesInitial}${servicesEnd}/gravittem/Agenda`,
    'process.env.UMI_API_HOST_NOTIFICATION': `https://${servicesInitial}${servicesEnd}/gravittem/Notificacoes`,
    'process.env.UMI_API_LAYOUT_GENERATOR': `https://${servicesInitial}${servicesEnd}/Gravittem/GeradorLayout`,
    'process.env.UMI_API_HOST_FISCAL': `https://${servicesInitial}${servicesEnd}/Gravittem/fiscal`,
    'process.env.UMI_API_HOST_LOG': `https://${servicesInitial}${servicesEnd}/Gravittem/log`,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        title: 'my-app',
        dll: true,
        locale: {
          enable: true,
          default: 'pt-BR',
        },
        routes: {
          exclude: excludeRoutes,
        },
        // dynamicImport: {},
      },
    ],
  ],
}
