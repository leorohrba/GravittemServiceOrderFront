import { axiosType } from '@utils/generics'

interface IScreenConfig {
  readonly apiHost: typeof axiosType
  readonly screenName: string
}

function useScreenConfig() {
  const [screenConfig, setScreenConfig] = <IScreenConfig[]>{}

  console.log(screenConfig)

  return { screenConfig, setScreenConfig }
}

export default useScreenConfig
