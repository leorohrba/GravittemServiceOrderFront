import React, { useState, useEffect } from 'react'
import { Button, Spin, Select } from 'antd'
import { formatMessage } from 'umi-plugin-react/locale'
import PropTypes from 'prop-types'

const { Option } = Select

function ImportExcelStep1({
  downloadFile,
  isDownloading,
  interfaceLogTypes = null,
  setSelectedValue = null,
  selectedValue = null,
  screenType = 'standard',
}) {
  const handleChange = value => {
    const selectedOption = interfaceLogTypes?.find(
      option => option.id === value,
    )

    if (selectedOption) {
      setSelectedValue(selectedOption)
    }
  }

  return (
    <Spin spinning={isDownloading}>
      <div className="text-center">
        <h3>
          {formatMessage({
            id: 'person.modals.importExcel.downloadModelAndFill',
          })}
        </h3>
        <h3>
          {formatMessage({
            id: 'person.modals.importExcel.followInstructions',
          })}
        </h3>
        {screenType != 'standard' && (
          <h3>
            {formatMessage({
              id: 'Caso já tenha um arquivo, apenas selecione o tipo de modelo e clique em "Continuar".',
            })}
          </h3>
        )}
        {interfaceLogTypes != null && (
          <Select
            showSearch
            allowClear={true}
            disabled={false}
            optionFilterProp="children"
            placeholder="Tipo de planilha"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            value={selectedValue?.descricao}
            className="w-1/2 text-left"
            onChange={handleChange}
          >
            {interfaceLogTypes?.map(d => (
              <Option value={d.id}>{d.descricao}</Option>
            ))}
          </Select>
        )}
        <Button
          onClick={() => downloadFile()}
          className="mt-5"
          disabled={selectedValue == null && screenType != 'standard'}
        >
          <i className="fa fa-download mr-3" aria-hidden="true" />
          {formatMessage({
            id: 'person.modals.importExcel.downloadModel',
          })}
        </Button>
      </div>
    </Spin>
  )
}

ImportExcelStep1.propTypes = {
  isDownloading: PropTypes.bool,
  downloadFile: PropTypes.func,
}

export default ImportExcelStep1
