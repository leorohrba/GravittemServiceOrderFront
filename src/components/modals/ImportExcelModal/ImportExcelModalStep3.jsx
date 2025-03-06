import React from 'react'
import { Spin, Form, Checkbox } from 'antd'
import PropTypes from 'prop-types'

function ImportExcelStep3({
  uploading,
  isSaving,
  isBackground,
  setIsBackground,
  isImporting = false,
}) {
  return (
    <Form layout="vertical" className="text-center">
      {!uploading ? (
        <div>
          <Checkbox
            checked={isBackground}
            onChange={e => setIsBackground(e.target.checked)}
          >
            Executar em segundo plano
          </Checkbox>
        </div>
      ) : (
        <Spin spinning={isSaving}>
          <div>
            <i
              className={`fa ${
                isImporting ? 'fa-spinner' : 'fa-check-circle'
              } fa-3x mb-2`}
              style={{
                color: '#1976D2',
                animation: isImporting ? 'spin 2s linear infinite' : 'none',
              }}
            />
            {isSaving ? (
              <h3>Arquivos estão sendo importados, aguarde...</h3>
            ) : (
              <React.Fragment>
                {isBackground ? (
                  <h3>
                    Seus dados estão sendo importados em segundo plano. Você
                    pode continuar navegando normalmente.
                  </h3>
                ) : (
                  <h3>
                    {isImporting ? 'Carregando...' : 'Importação finalizada!'}
                  </h3>
                )}
              </React.Fragment>
            )}
          </div>
        </Spin>
      )}
    </Form>
  )
}

ImportExcelStep3.propTypes = {
  uploading: PropTypes.bool,
  form: PropTypes.any,
  isSaving: PropTypes.bool,
  isBackground: PropTypes.bool,
  setIsBackground: PropTypes.func,
}

export default ImportExcelStep3
