/**
 * breadcrumb: Itens similares
 */
import Button from '@components/Button'
import { apiMaterialRequest } from '@services/api'
import { handleAuthError } from '@utils'
import { message, Modal, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { SimilarItemsModalForm } from './SimilarItemsModalForm'

export const SimilarItems = props => {

  const { itemId, modalVisible, toogleModalVisible, onSelectMaterialLike, showItem } = props
  const [ item, setItem ] = useState(null)
  const [materialLike, setMaterialLike] = useState([])
  const [priceList, setPriceList] = useState([])
  const [priceListId, setPriceListId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [materialStock, setMaterialStock] = useState(null)
  
  useEffect(() => {
    if (modalVisible) {
      setMaterialStock(null)  
      setItem(null)
      setPriceList([])  
      setMaterialLike([])
      getPriceList()
    }     
  // eslint-disable-next-line react-hooks/exhaustive-deps       
  }, [modalVisible])
  
  async function getPriceList() {
    setLoading(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/PriceList`,
      })

      const { data } = response

      if (data.isOk) {
        
        let priceListIdWork = null
        if (data.priceList.length > 0)
        {
            priceListIdWork = data.priceList[0].priceListId
        }
        setPriceList(data.priceList)
        setPriceListId(priceListIdWork)
        getMaterialLike(priceListIdWork)   
      } else {
        setLoading(false)  
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      setLoading(false)  
      toogleModalVisible()
      handleAuthError(error)
    }
  }

  async function getMaterialLike(priceListIdToSearch) {
    setLoading(true)
    try {
      const response = await apiMaterialRequest({
        method: 'GET',
        url: `/api/stock/MaterialLike`,
        params: { materialId: itemId, priceListId: priceListIdToSearch, includeParent: true },
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        setItem(data.item)  
        setMaterialLike(data.materialLike)        
        
      } else {
        setLoading(false)  
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)  
      handleAuthError(error)
    }
  }
  
  const handleOk = e => {
      e && e.preventDefault()
      if (materialStock) {
         const ids = materialStock.split("#")
         onSelectMaterialLike(parseInt(ids[0],10), parseInt(ids[1], 10))
      }
      toogleModalVisible()
  }

  const handleCancel = () => {
    toogleModalVisible()
  }
  
  const onChangePriceList = (value) => {
      getMaterialLike(value)
      setPriceListId(value)
  }
  
  const onChangeMaterialStock = (value) => {
     setMaterialStock(value)
     // setMaterialStock(e.target.value)
  }

  return (
    <React.Fragment>
      <Modal
        id="modal-similar-items"
        visible={modalVisible}
        title={formatMessage({
          id: 'materialRequest.SimilarItems.similarAndSubstitute',
        })}
        centered
        width="650px"
        onCancel={handleCancel}
        footer={
          <React.Fragment>  
            <Button
              key="back"
              onClick={handleCancel}
              size="default"
              id="button-cancel-similar-items"
            >
              {formatMessage({
                id: 'cancelButton',
              })}
            </Button>
            {!!onSelectMaterialLike && (
              <Button
                key="submit"
                type="primary"
                size="default"
                loading={loading}
                onClick={(e) => handleOk(e)}
                disabled={!materialStock}
                id="button-save-similar-items"
              >
                {formatMessage({
                  id: 'continueButton',
                })}
              </Button>
            )}
          </React.Fragment> 
        }
      >
        <Spin size="large" spinning={loading}>
          <div style={{display : loading ? 'none' : 'block'}}>
            <SimilarItemsModalForm
              materialLike={materialLike}
              priceList={priceList}
              priceListId={priceListId}
              onChangePriceList={onChangePriceList}
              onChangeMaterialStock={onChangeMaterialStock}
              materialStock={materialStock}
              item={item}
              showItem={showItem}
            />
          </div>  
        </Spin>  
      </Modal>
    </React.Fragment>
  )
}

SimilarItems.propTypes = {
  itemId: PropTypes.number,
  modalVisible: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  onSelectMaterialLike: PropTypes.func,
  showItem: PropTypes.bool,
}

