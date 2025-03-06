import { useEffect, useState } from 'react'
import { getPermissions } from '@utils'

function useUserPermissions() {
  const [userPermissions, setUserPermissions] = useState([])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  useEffect(() => {
    setPermissions()
  }, [])

  return { userPermissions }
}

export default useUserPermissions
