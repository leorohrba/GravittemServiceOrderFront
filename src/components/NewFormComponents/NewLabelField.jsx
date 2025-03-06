import { Popover, Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const style = { 
                color: 'gray',
                float: 'right !important',
                paddingTop: '5px !important',
                paddingRight: '5px !important',                       
              }

export default function NewLabelField(props) {
  
  const { label, 
          info, disabled, 
		  onRefineSearch, 
		  // onNewItem, 
		  icons, 
		  form, 
		  fieldName } = props
  
  return (
  <div>
     <span>
       {label}
     </span> 
     {(info && !!form.getFieldValue(fieldName)) && (
       <Popover placement="leftBottom" content={info.content} title={info.title}>
         <i 
           className="ml-2 fa fa-info-circle ml-auto" 
           style={style}
         />
       </Popover>
     )}
     {icons && icons.filter(x => x.visible).map((d) => (
       <Tooltip title={d.title}>
         <i 
           className={`ml-2 cursor-pointer fa ${d.icon}`} 
           style={style} 
           role="button"
           onClick={() => d.onClick()}
         />
       </Tooltip>
     ))}  
     {(!disabled && onRefineSearch) && (
       <Tooltip title="Busca refinada">
         <i 
           className="ml-2 cursor-pointer fa fa-search-plus" 
           style={style} 
           role="button"
           onClick={() => onRefineSearch()}
         />
       </Tooltip>
     )}                   
     {/* (!disabled && onNewItem) && (
       <Tooltip title="Cadastrar">
         <i 
           className="ml-2 cursor-pointer fa fa-plus" 
           style={style}
           role="button"
           onClick={() => onNewItem()}
         />
       </Tooltip>
     ) */}                   
  </div>
  )
}

NewLabelField.propTypes = {
  label: PropTypes.string,
  info: PropTypes.any,
  disabled: PropTypes.bool,
  onRefineSearch: PropTypes.func,
  onNewItem: PropTypes.func,
  form: PropTypes.any,
  fieldName: PropTypes.string,
  icons: PropTypes.any,
}