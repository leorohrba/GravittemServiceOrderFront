import React, { Fragment, useEffect } from 'react'
import { permissionsAtom, toRenderAtom } from '@atoms/screenAtoms'
import { useAtom } from 'jotai'
import SuspenseGravittem from '@components/gravittemComponents/SuspenseGravittem'
import { getPermissions } from '@utils'

function ScreenComponent({ children }) {
  const [toRender] = useAtom(toRenderAtom)

  const [userPermissions, setUserPermissions] = useAtom(permissionsAtom)

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  useEffect(() => {
    setPermissions()
  }, [])

  return (
    <Fragment>
      {toRender && <SuspenseGravittem>{children}</SuspenseGravittem>}
    </Fragment>
  )
}

export default ScreenComponent
