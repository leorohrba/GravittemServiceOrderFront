import gravittemFaviconImg from '@assets/images/favicon/gravittem1.jpg'
import { apiAttachment, apiMaterialRequest } from '@services/api'
import { getImgToBase64, handleAuthError } from '@utils'
import { message, Row, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import PdfMakeConfig from './components/pdfMakeConfig'

const PrintRequest = ({ requestNewId, onClose }) => {
  const [companyLogoDataUri, setCompanyLogoDataUri] = useState('')
  const [gravittemFaviconImgDataUri, setGravittemFaviconImgDataUri] = useState(
    '',
  )
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState(null)
  const [loginInformation, setLoginInformation] = useState(null)

  useEffect(() => {
    const getGravittemFaviconImgDataUri = async () => {
      const result = await getImgToBase64(gravittemFaviconImg)
      setGravittemFaviconImgDataUri(result)
    }

    getData()
    getGravittemFaviconImgDataUri()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      companyLogoDataUri.length > 0 &&
      gravittemFaviconImgDataUri.length > 0 &&
      loginInformation !== null &&
      requests !== null
    ) {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    companyLogoDataUri.length,
    gravittemFaviconImgDataUri.length,
    requests,
    loginInformation,
  ])

  async function getLogo(ownerId) {
    if (ownerId) {
      try {
        const response = await apiAttachment({
          method: 'GET',
          url: `/api/anexo/logo`,
          params: { ownerId, tipo: 2 },
        })
        const { data } = response
        setCompanyLogoDataUri(`data:image/png;base64,${data}`)
      } catch (error) {
        getCompanyImgDataUri(
          require(`@assets/images/companyLogo/emptyLogo.png`),
        )
      }
    }
  }

  const getCompanyImgDataUri = async companyLogo => {
    const result = await getImgToBase64(companyLogo)
    setCompanyLogoDataUri(result)
  }

  async function getData() {
    setLoading(true)

    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/RequestPrint`,
        params: { requestNewId },
      })

      const { data } = response

      if (data.isOk) {
        setRequests(data.request)
        setLoginInformation(data.loginInformation)
        getLogo(data.loginInformation?.ownerId)
      } else {
        message.error(data.message)
        onClose()
      }
    } catch (error) {
      handleAuthError(error)
      onClose()
    }
  }

  return loading ? (
    <Spin
      size="large"
      className="relative"
      style={{ left: '50%', marginTop: '10%' }}
    />
  ) : (
    <div className="container">
      <Row className="mb-5" align="middle">
        <span
          style={{
            color: '#1976D2',
            cursor: 'pointer',
          }}
          onClick={e => onClose(e)}
          role="button"
        >
          Requisição
        </span>
        <i className="mx-3 fa fa-angle-right" />
        Impressão da requisição
      </Row>
      <div id="requestReport" className="mt-5">
        <PdfMakeConfig
          {...{
            companyLogoDataUri,
            gravittemFaviconImgDataUri,
            loginInformation,
            requests,
          }}
        />
      </div>
    </div>
  )
}

PrintRequest.propTypes = {
  requestNewId: PropTypes.object,
  onClose: PropTypes.func,
}

export default PrintRequest
