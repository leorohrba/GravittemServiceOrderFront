/**
 * breadcrumb: Exemplo de pdf
 */
import robotoBold from '@assets/fonts/Roboto-Bold.ttf'
import robotoRegular from '@assets/fonts/Roboto-Regular.ttf'
import marna from '@assets/images/companyLogo/marna.jpg'
import PdfContainer from '@components/Pdf/PdfContainer'
import PdfFooter from '@components/Pdf/PdfFooter'
import PdfHeader from '@components/Pdf/PdfHeader'
import {
  DataTableCell,
  Table,
  TableBody,
  TableCell,
  TableHeader,
} from '@david.kucsai/react-pdf-table'
import { Font, StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: robotoRegular,
    },
    {
      src: robotoBold,
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  image: {
    width: '150px',
    marginTop: '13px',
  },
  header: {
    flexDirection: 'row',
    marginBottom: '30px',
  },
  bold: {
    fontWeight: 'bold',
  },
  container: {
    fontFamily: 'Roboto',
  },
  flexRow: {
    flexDirection: 'row',
  },
  body: {
    fontSize: 11,
    flexDirection: 'row',
  },
})

const PdfExample = () => (
  <PdfContainer>
    <View style={styles.container}>
      <PdfHeader
        image={marna}
        imageStyles={styles.image}
        company="MARNA REFRIGERAÇÃO"
        reportName="Relatório de requisição de peças"
        username="joao.silva"
      />
      <View style={styles.body}>
        <View>
          <View style={styles.flexRow}>
            <Text style={styles.bold}>Solicitante</Text>
            <Text style={{ marginLeft: '20px' }}>
              261 - GUIMES OLIVEIRA DA SILVA
            </Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.bold}>Requisição</Text>
            <Text style={{ marginLeft: '20px' }}>429</Text>
          </View>
        </View>
        <View style={{ marginLeft: '20px' }}>
          <View style={styles.flexRow}>
            <Text style={styles.bold}>Período</Text>
            <Text style={{ marginLeft: '30px' }}>22/01/2019 ~ 25/01/2019</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.bold}>Observação</Text>
            <Text style={{ marginLeft: '10px', width: '200px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: '40px' }}>
        <Table
          data={[
            {
              code: 'A04856329',
              part: 'BASE QUEIMADOR SEMIRRAPIDO CPT',
              stock: 'Estoque central',
              address: 'R3 AF P6 CxA',
              requisition: '2',
              aplication: '',
              value: '10.000,00',
              documentNumber: '536 (FG)',
            },
            {
              code: '62545953',
              part: 'BASE QUEIMADOR TRIPLA CHAMA',
              stock: 'Estoque central',
              address: 'R3 AF P6 CxA',
              requisition: '2',
              aplication: '',
              value: '10.000,00',
              documentNumber: '536 (FG)',
            },
            {
              code: 'A04856329',
              part: 'BASE QUEIMADOR SEMIRRAPIDO CPT',
              stock: 'Estoque central',
              address: 'R3 AF P6 CxA',
              requisition: '2',
              aplication: '',
              value: '10.000,00',
              documentNumber: '536 (FG)',
            },
          ]}
        >
          <TableHeader textAlign="center" fontSize={10}>
            <TableCell weighting={0.15} color="white">
              Código
            </TableCell>
            <TableCell weighting={0.2}>Peça</TableCell>
            <TableCell weighting={0.2}>Estoque</TableCell>
            <TableCell weighting={0.15}>Endereço</TableCell>
            <TableCell weighting={0.05}>Req.</TableCell>
            <TableCell weighting={0.1}>Aplic.</TableCell>
            <TableCell weighting={0.1}>Valor</TableCell>
            <TableCell weighting={0.15}>N° documento</TableCell>
          </TableHeader>
          <TableBody fontSize={10} textAlign="center">
            <DataTableCell weighting={0.15} getContent={r => r.code} />
            <DataTableCell weighting={0.2} getContent={r => r.part} />
            <DataTableCell weighting={0.2} getContent={r => r.stock} />
            <DataTableCell weighting={0.15} getContent={r => r.address} />
            <DataTableCell weighting={0.05} getContent={r => r.requisition} />
            <DataTableCell weighting={0.1} getContent={r => r.aplication} />
            <DataTableCell weighting={0.1} getContent={r => r.value} />
            <DataTableCell
              weighting={0.15}
              getContent={r => r.documentNumber}
            />
          </TableBody>
        </Table>
      </View>

      <View style={{ marginTop: '40px' }}>
        <Text
          style={{ fontSize: 12, fontWeight: 'bold', marginBottom: '10px' }}
        >
          Anotações
        </Text>
        <Table
          data={[
            {
              code: ' ',
              part: ' ',
              applied: '',
              documentNumber: ' ',
              observation: ' ',
            },
            {
              code: ' ',
              part: ' ',
              applied: ' ',
              documentNumber: ' ',
              observation: ' ',
            },
            {
              code: ' ',
              part: ' ',
              applied: ' ',
              documentNumber: ' ',
              observation: ' ',
            },
            {
              code: ' ',
              part: ' ',
              applied: ' ',
              documentNumber: ' ',
              observation: ' ',
            },
            {
              code: ' ',
              part: ' ',
              applied: ' ',
              documentNumber: ' ',
              observation: ' ',
            },
          ]}
        >
          <TableHeader textAlign="center" fontSize={10}>
            <TableCell>Código</TableCell>
            <TableCell>Peça</TableCell>
            <TableCell>Aplicado</TableCell>
            <TableCell>N° documento</TableCell>
            <TableCell>Observação</TableCell>
          </TableHeader>
          <TableBody fontSize={10} textAlign="center">
            <DataTableCell getContent={r => r.code} />
            <DataTableCell getContent={r => r.part} />
            <DataTableCell getContent={r => r.applied} />
            <DataTableCell getContent={r => r.documentNumber} />
            <DataTableCell getContent={r => r.observation} />
          </TableBody>
        </Table>
      </View>

      <PdfFooter />
    </View>
  </PdfContainer>
)

export default PdfExample
