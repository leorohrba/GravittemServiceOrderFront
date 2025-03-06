import { Icon as LegacyIcon } from '@ant-design/compatible'
import PropTypes from 'prop-types'
import React from 'react'

export default function SmallTableFieldDescription({
  color,
  fontSize,
  icon,
  label,
  theme,
  fontStyle,
  textDecoration,
  className,
}) {
  return (
    <div className={className}>
      {icon && (
        <LegacyIcon
          theme={theme}
          type={icon}
          className="mr-1"
          style={{ color, fontSize }}
        />
      )}
      <small style={{ color, fontStyle, textDecoration }}>{label}</small>
    </div>
  )
}

SmallTableFieldDescription.propTypes = {
  color: PropTypes.any,
  fontSize: PropTypes.any,
  fontStyle: PropTypes.any,
  icon: PropTypes.any,
  label: PropTypes.any,
  textDecoration: PropTypes.any,
  theme: PropTypes.any,
}
