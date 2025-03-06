import { getLocaleCurrency } from '@utils'
import React from 'react'
import { formatMessage, formatNumber } from 'umi-plugin-react/locale'
import PropTypes from 'prop-types'

export default function ServiceOrderPartsFooter({ data }) {
  return (
    <div
      className="mt-5"
      style={{
        textAlign: 'end',
      }}
    >
      {data.find(
        x => !(x.actStatusCode === 'CANC' || x.actStatusCode === 'UTLZ'),
      ) && (
        <h4>
          {formatMessage({
            id: 'serviceOrder.serviceOrderParts.totalForecast',
          })}
          :{' '}
          {formatNumber(
            data
              .filter(
                x => x.actStatusCode !== 'CANC' && x.actStatusCode !== 'ESTD',
              )
              .reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.totalValue,
                0,
              ) || 0,
            {
              style: 'currency',
              currency: getLocaleCurrency(),
            },
          )}
        </h4>
      )}
      <h3>
        Total Consumidor :{' '}
        {formatNumber(
          data
            .filter(
              x => x.actStatusCode === 'UTLZ' && x.receiptBy === 'Consumer',
            )
            .reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.totalValue,
              0,
            ) || 0,
          {
            style: 'currency',
            currency: getLocaleCurrency(),
          },
        )}
      </h3>
    </div>
  )
}

ServiceOrderPartsFooter.propTypes = {
  data: PropTypes.array,
}
