import NewSimpleSearch from '@components/NewSimpleSearch'
import React from 'react'
import { useLogContext } from '../context/LogContext'

export default function LogHeader() {
  const { searchOptions, setTags, tags, startSearch } = useLogContext()
  return (
    <div>
      <div className="flex justify-end">
        <NewSimpleSearch
          searchOptions={searchOptions}
          setTags={setTags}
          tags={tags}
          startSearch={startSearch}
          screenName="log_grid"
        />
      </div>
    </div>
  )
}
