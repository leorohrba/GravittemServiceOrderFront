/* eslint-disable jsx-a11y/anchor-is-valid */
import Logo from '@assets/icons/logo-gravittem.svg'
import { Button } from 'antd'
import React from 'react'

export default function QuotationRequestEmail({
  cotacao = '001',
  empresa = 'Teste',
}) {
  const fontColor = '#696969'
  return (
    <center style={{ backgroundColor: '#eeeeee' }} className="p-6 min-h-screen">
      <img src={Logo} alt="Logo Gravittem" />
      <div className="mx-48 my-10 p-10 bg-white">
        <h1 className="font-bold">Pedido de cotação {cotacao}</h1>
        <h3 className="my-8" style={{ color: fontColor }}>
          A empresa <b>{empresa}</b> recebeu um pedido de cotação. Clique no
          botão abaixo para acessar o formulário de cotação e preencha com seus
          melhores valores.
        </h3>
        <Button type="primary" size="large">
          ACESSAR COTAÇÃO
        </Button>
      </div>
      <div style={{ color: fontColor }}>
        <p>© 1999-2020 Softin Sistemas®, Todos os Direitos Reservados.</p>
        <p>Rua Iririú, 847 - Saguaçu, Joinville, SC - 89221-515</p>
        <a href="https://softin.com.br/contato/">Entre em contato</a> •{' '}
        <a href="https://softin.com.br/gravittem/">Produtos Gravíttem</a> •{' '}
        <a href="https://blog.softin.com.br/posts/">Blog</a>
      </div>
    </center>
  )
}
