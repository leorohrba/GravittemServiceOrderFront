/**
 * breadcrumb: Novo grupo
 */
import { Form } from '@ant-design/compatible'
import { apiAttendance } from '@services/api'
import {
  fieldsValidationToast,
  getPermissions,
  handleAuthError,
  hasPermission,
  showApiMessages,
} from '@utils'
import { message, Row, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import NewGroupFooter from './components/NewGroupFooter'
import NewGroupForm from './components/NewGroupForm'
import NewGroupFormTree from './components/NewGroupFormTree'

function NewGroup({ form, match }) {
  const [personGroupId] = useState(match.params.id ? match.params.id : null)
  const [alertMessages, setAlertMessages] = useState([])
  const [collaboratorIds, setCollaboratorIds] = useState([])
  const [collaboratorData, setCollaboratorData] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingPersonGroup, setLoadingPersonGroup] = useState(true)
  const [loadingCollaborators, setLoadingCollaborators] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setPermissions()
    if (personGroupId) {
      getPersonGroup()
    } else {
      getCollaborators()
      setLoadingPersonGroup(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  useEffect(() => {
    form.resetFields(['description', 'status'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    form.resetFields(['collaboratorIds'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaboratorData, collaboratorIds])

  useEffect(() => {
    if (!loadingPersonGroup && !loadingCollaborators) {
      setLoading(false)
    }
  }, [loadingPersonGroup, loadingCollaborators])

  async function getPersonGroup() {
    setLoadingPersonGroup(true)
    setCollaboratorIds([])
    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/BuscaGrupoColaborador`,
        data: { id: [personGroupId], trazerColaboradores: true },
      })
      setLoadingPersonGroup(false)
      const { data } = response
      if (data.isOk && data.grupoColaborador.length > 0) {
        const personGroup = data.grupoColaborador[0]
        setEditData(personGroup)
        setCollaboratorIds(
          personGroup.colaboradores.map(record => record.idColaborador),
        )
        getCollaborators(
          personGroup.colaboradores.map(record => ({
            key: record.idColaborador,
            name: record.nomeColaborador,
          })),
        )
      } else if (data.isOk && data.grupoColaborador.length === 0) {
        message.error('Grupo de colaborador não encontrado!')
        handleCancel()
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingPersonGroup(false)
      handleAuthError(error)
    }
  }

  async function getCollaborators(collaborators) {
    setLoadingCollaborators(true)
    setCollaboratorData([])
    try {
      const response = await apiAttendance({
        method: 'GET',
        url: `/api/Pessoa`,
        params: { isCollaborator: true },
      })
      setLoadingCollaborators(false)
      const { data } = response
      if (data.isOk) {
        const source = data.pessoa.map(record => ({
          key: record.idColaborador,
          name: record.nome,
        }))
        if (collaborators) {
          collaborators.map(record => {
            if (!source.find(x => x.key === record.key)) {
              source.push(record)
            }
            return true
          })
        }
        setCollaboratorData(source)
      } else {
        showApiMessages(data)
      }
    } catch (error) {
      setLoadingCollaborators(false)
      handleAuthError(error)
    }
  }

  function handleCancel() {
    router.push(`/OccurrenceRoutine/PersonGroup`)
  }

  function handleSave() {
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        savePersonGroup()
      }
    })
  }

  async function savePersonGroup() {
    setIsSaving(true)
    setLoading(true)

    const ids = form.getFieldValue('collaboratorIds')
    const body = {
      id: personGroupId || null,
      descricao: form.getFieldValue('description'),
      status: form.getFieldValue('status'),
      colaboradores: ids.map(idColaborador => ({ idColaborador })),
    }

    try {
      const response = await apiAttendance({
        method: 'POST',
        url: `/api/GrupoColaborador`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        handleCancel()
      } else {
        setAlertMessages(data.notificacoes)
        showApiMessages(data)
      }
    } catch (error) {
      setIsSaving(false)
      setLoading(false)
      handleAuthError(error)
    }
  }

  return (
    <div className="container">
      <Row className="mb-4">
        <span
          className="mr-2"
          style={{ color: '#1976D2', cursor: 'pointer' }}
          onClick={e => handleCancel(e)}
          role="button"
        >
          Grupo de colaboradores
        </span>
        <i className="fa fa-angle-right" />
        <span className="ml-2">
          {!personGroupId
            ? 'Novo grupo'
            : hasPermission(userPermissions, 'Alter')
            ? 'Editar grupo'
            : 'Consultar grupo'}
        </span>
      </Row>

      <Spin spinning={loading} size="large">
        <NewGroupForm
          form={form}
          userPermissions={userPermissions}
          alertMessages={alertMessages}
          editData={editData}
        />
        <NewGroupFormTree
          form={form}
          collaboratorData={collaboratorData}
          initialCollaboratorIds={collaboratorIds}
          disabled={!hasPermission(userPermissions, 'Alter')}
        />
        <NewGroupFooter
          handleSave={handleSave}
          handleCancel={handleCancel}
          isSaving={isSaving}
          userPermissions={userPermissions}
        />
      </Spin>
    </div>
  )
}

NewGroup.propTypes = {
  form: PropTypes.any,
  match: PropTypes.any,
}

const WrappedNewGroup = Form.create()(NewGroup)
export default WrappedNewGroup
