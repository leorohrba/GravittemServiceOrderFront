/**
 * breadcrumb: Exemplo de pdf
 */
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginBottom: '30px',
  },
})

const PdfExample = ({ image, imageStyles, company, reportName, username }) => (
  <React.Fragment>
    <View style={styles.header}>
      <Image src={image} style={imageStyles} cache />
      <View style={{ marginTop: '12px', marginLeft: '20px' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{company}</Text>
        <Text style={{ marginTop: '5px', fontSize: 14 }}>{reportName}</Text>
      </View>
      <View
        style={{
          marginTop: '25px',
          fontSize: 8,
          alignItems: 'flex-end',
          marginLeft: '60px',
        }}
      >
        <Text
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} / ${totalPages}`
          }
          fixed
        />
        <Text style={{ marginTop: '5px' }}>
          {username} - {`${moment().format('L')} ${moment().format('LTS')}`}
        </Text>
      </View>
    </View>
  </React.Fragment>
)

PdfExample.propTypes = {
  company: PropTypes.string,
  image: PropTypes.node,
  imageStyles: PropTypes.object,
  reportName: PropTypes.string,
  username: PropTypes.string,
}

export default PdfExample
