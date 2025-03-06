import useScreenConfig from '@models/useScreenConfig'

export function useGetScreenConfig(props) {
  const { apiHost, screenName } = props

  const { setScreenConfig } = useScreenConfig()

  return setScreenConfig({ apiHost, screenName })
}
