/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import React from 'react'
import router from 'umi/router'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    const { errorInfo, error } = this.state
    const { children } = this.props
    if (errorInfo) {
      // Error path
      return (
        <div className="mt-16 flex items-center flex-col">
          <h2>
            Aconteceu um erro, clique{' '}
            <a href={window.location.href}>aqui</a> para atualizar página.
          </h2>
          <h2>Caso persistir contate o suporte!</h2>
          {/*
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {error && error.toString()}
            <br />
            {errorInfo.componentStack}
          </details>
          */}
        </div>
      )
    }
    // Normally, just render children
    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any,
}
