/**
 * breadcrumb: Exemplo de pdf
 */
import gravittemFavicon from '@assets/images/favicon/gravittem.png'
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    fontSize: 10,
    top: '94vh',
    color: 'grey',
    flexDirection: 'row',
  },
})

const PdfFooter = () => (
  <React.Fragment>
    <View style={styles.footer} fixed>
      <Image
        cache
        src={gravittemFavicon}
        style={{ width: '20px', position: 'absolute', left: 10, bottom: -2 }}
      />
      <Text style={{ marginLeft: '80px' }}>
        A mais ampla solução colaborativa de serviços
      </Text>
      <View style={{ marginLeft: '100px' }}>
        <Text>www.gravittem.com | (47) 3437-3312</Text>
      </View>
    </View>
  </React.Fragment>
)

export default PdfFooter
