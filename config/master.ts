// ref: https://umijs.org/config/
import webpackConfig from '../plugin'

export default {
  chainWebpack: webpackConfig,
  treeShaking: true,
  theme: {
    'primary-color': '#1976D2',
    'text-color': ' rgba(0, 0, 0, 0.85)',
  },
  define: {
    'process.env.UMI_API_HOST_REGION':
      'https://services.gravittem.com/Gravittem/Regiao',
    'process.env.UMI_API_HOST_CRM':
      'https://services.gravittem.com/Gravittem/CRM',
    'process.env.UMI_API_HOST_PERMISSION':
      'https://services.gravittem.com/global/permission',
    'process.env.UMI_ENV': 'master',
    'process.env.UMI_API_HOST_MATERIAL_REQUEST':
      'https://services.gravittem.com/gravittem/request',
    'process.env.UMI_API_HOST_ATTENDANCE':
      'https://services.gravittem.com/Gravittem/Atendimento',
    'process.env.UMI_API_HOST_CHECKLIST':
      'https://services.gravittem.com/gravittem/checklist',
    'process.env.UMI_API_HOST_CONTRACT':
      'https://services.gravittem.com/gravittem/contract',
    'process.env.UMI_API_HOST': 'http://localhost:5000',
    'process.env.UMI_API_HOST_COMMENT':
      'https://services.gravittem.com/gravittem/comentarios',
    'process.env.UMI_API_HOST_ATTACHMENT':
      'https://services.gravittem.com/gravittem/anexos',
    'process.env.UMI_API_HOST_FINANCIAL':
      'https://services.gravittem.com/gravittem/financeiro',
    'process.env.UMI_API_HOST_QUESTIONNAIRE':
      'https://services.gravittem.com/gravittem/questionario',
    'process.env.UMI_API_HOST_SEARCH':
      'https://services.gravittem.com/gravittem/pesquisas',
    'process.env.UMI_API_HOST_PERSON':
      'https://services.gravittem.com/gravittem/Pessoa',
    'process.env.UMI_API_HOST_SCHEDULE':
      'https://services.gravittem.com/gravittem/Agenda',
    'process.env.UMI_API_HOST_NOTIFICATION':
      'https://services.gravittem.com/gravittem/Notificacoes',
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
          exclude: [/tabs\//, /modals\//, /components\//],
        },
        // dynamicImport: {},
      },
    ],
  ],
}
