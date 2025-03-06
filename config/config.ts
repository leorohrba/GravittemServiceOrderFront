// ref: http://umijs.org/config/
import webpackConfig from '../plugin'
import routes from './routes'
// const BundleAnalyzerPlugin = require('umi-webpack-bundle-analyzer').BundleAnalyzerPlugin;
// new BundleAnalyzerPlugin()
export default {
  chainWebpack: webpackConfig,
  sass: {},
  treeShaking: true,
  theme: {
    'primary-color': '#1976D2',
    'text-color': ' rgba(0, 0, 0, 0.85)',
  },
  ssr: false,
  proxy: {
    '/gravittemApi': {
      target: 'http://dev.gravittem.com.br',
      changeOrigin: true,
      pathRewrite: {
        '^/gravittemApi': '',
      },
    },
  },
  define: {
    'process.env.UMI_API_LAYOUT_GENERATOR':
      'https://services.dev.gravittem.com.br/Gravittem/GeradorLayout',
    'process.env.UMI_API_SERVICE':
      'https://services.dev.gravittem.com.br/Gravittem/servicos',
    'process.env.UMI_API_HOST_GRAVITTEM': 'https://dev.gravittem.com.br',
    'process.env.UMI_API_HOST_REGION':
      'https://services.dev.gravittem.com.br/Gravittem/Regiao',
    'process.env.UMI_API_HOST_CRM':
      'https://services.dev.gravittem.com.br/Gravittem/CRM',
    'process.env.UMI_API_HOST_PERMISSION':
      'https://services.dev.gravittem.com.br/global/permission',
    'process.env.UMI_API_HOST_HISTORY':
      'https://services.dev.gravittem.com.br/gravittem/historicos',
    'process.env.UMI_ENV': 'dev',
    'process.env.UMI_API_HOST_MATERIAL_REQUEST':
      'https://services.dev.gravittem.com.br/gravittem/request',
    'process.env.UMI_API_HOST_ATTENDANCE':
      'https://services.dev.gravittem.com.br/gravittem/atendimento',
    'process.env.UMI_API_HOST_CHECKLIST':
      'https://services.dev.gravittem.com.br/gravittem/checklist',
    'process.env.UMI_API_HOST_CONTRACT':
      'https://services.dev.gravittem.com.br/gravittem/contract',
    'process.env.UMI_API_HOST': 'https://services.dev.gravittem.com.br',
    'process.env.UMI_API_HOST_COMMENT':
      'https://services.dev.gravittem.com.br/gravittem/comentarios',
    'process.env.UMI_API_HOST_ATTACHMENT':
      'https://services.dev.gravittem.com.br/gravittem/anexos',
    'process.env.UMI_API_HOST_FINANCIAL':
      'https://services.dev.gravittem.com.br/gravittem/financeiro',
    'process.env.UMI_API_HOST_SEARCH':
      'https://services.dev.gravittem.com.br/gravittem/pesquisas',
    'process.env.UMI_API_HOST_NEW_CONTRACT':
      'https://services.dev.gravittem.com.br/gravittem/contrato',
    'process.env.UMI_API_HOST_PERSON':
      'https://services.dev.gravittem.com.br/gravittem/Pessoa',
    'process.env.UMI_API_HOST_SCHEDULE':
      'https://services.dev.gravittem.com.br/gravittem/Agenda',
    'process.env.UMI_API_HOST_NOTIFICATION':
      'https://services.dev.gravittem.com.br/gravittem/Notificacoes',
    'process.env.UMI_API_HOST_FISCAL':
      'https://services.dev.gravittem.com.br/gravittem/fiscal',
    'process.env.UMI_API_HOST_QUESTIONNAIRE':
      'https://services.dev.gravittem.com.br/gravittem/questionario',
    'process.env.UMI_API_HOST_INVOICE_MANAGEMENT': 'http://localhost:5000',
    'process.env.UMI_API_HOST_LOG':
      'https://services.dev.gravittem.com.br/Gravittem/Log',
    'process.env.UMI_API_HOST_NFSE':
      'https://services.dev.gravittem.com.br/Gravittem/NFSe',
    'process.env.UMI_API_HOST_BANKTRANSACTION':
      'https://services.dev.gravittem.com.br/Gravittem/transacaobancaria',
    'process.env.UMI_ENV_TOKEN': '',
  },
  plugins: [
    // ref: http://umijs.org/plugin/umi-plugin-react.html
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
        routes,
        // dynamicImport: {},
      },
    ],
  ],
}
