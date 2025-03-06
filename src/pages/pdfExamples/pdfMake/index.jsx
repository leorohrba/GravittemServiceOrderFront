import companyBackgroundImg from '@assets/images/print/atendePortaria/bg-min.png'
import firstChapterImg from '@assets/images/print/atendePortaria/cap-1.jpg'
import secondChapterSecondSectionImg from '@assets/images/print/atendePortaria/cap-2-secao-2.png'
import secondChapterThirdSectionFirstImg from '@assets/images/print/atendePortaria/cap-2-secao-3-1.jpg'
import secondChapterThirdSectionSecondImg from '@assets/images/print/atendePortaria/cap-2-secao-3-2.png'
import secondChapterSeventhSectionFirstSectionImg from '@assets/images/print/atendePortaria/cap-2-secao-7.jpg'
import headerFooterImgBackgroundImg from '@assets/images/print/atendePortaria/rodape-cabecalho-min.png'
import { Spin } from 'antd'
import image2base64 from 'image-to-base64'
import { useEffect, useState } from 'react'
import PdfMakeTest from './components/PdfMakeTest'

const Index = () => {
  const [
    companyBackgroundImgDataUri,
    setCompanyBackgroundImgDataUri,
  ] = useState('')
  const [
    headerFooterImgBackgroundDataUri,
    setHeaderFooterImgBackgroundDataUri,
  ] = useState('')
  const [firstChapterImgDataUri, setFirstChapterImgDataUri] = useState('')
  const [
    secondChapterSecondSectionImgDataUri,
    setSecondChapterSecondSectionImgDataUri,
  ] = useState('')
  const [
    secondChapterThirdSectionFirstImgDataUri,
    setSecondChapterThirdSectionFirstImgDataUri,
  ] = useState('')
  const [
    secondChapterThirdSectionSecondImgDataUri,
    setSecondChapterThirdSectionSecondImgDataUri,
  ] = useState('')
  const [
    secondChapterSeventhSectionFirstSectionImgDataUri,
    setSecondChapterSeventhSectionFirstSectionImgDataUri,
  ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCompanyBackgroundDataUri = async () => {
      const result = await image2base64(companyBackgroundImg)
      setCompanyBackgroundImgDataUri(`data:image/png;base64,${result}`)
    }
    const getHeaderFooterImgBackgroundDataUri = async () => {
      const result = await image2base64(headerFooterImgBackgroundImg)
      setHeaderFooterImgBackgroundDataUri(`data:image/png;base64,${result}`)
    }
    const getFirstChapterImgDataUri = async () => {
      const result = await image2base64(firstChapterImg)
      setFirstChapterImgDataUri(`data:image/png;base64,${result}`)
    }
    const getSecondChapterSecondSectionImgDataUri = async () => {
      const result = await image2base64(secondChapterSecondSectionImg)
      setSecondChapterSecondSectionImgDataUri(`data:image/png;base64,${result}`)
    }
    const getSecondChapterThirdSectionFirstImgDataUri = async () => {
      const result = await image2base64(secondChapterThirdSectionFirstImg)
      setSecondChapterThirdSectionFirstImgDataUri(
        `data:image/png;base64,${result}`,
      )
    }
    const getSecondChapterThirdSectionSecondImgDataUri = async () => {
      const result = await image2base64(secondChapterThirdSectionSecondImg)
      setSecondChapterThirdSectionSecondImgDataUri(
        `data:image/png;base64,${result}`,
      )
    }
    const getSecondChapterSeventhSectionFirstSectionImgDataUri = async () => {
      const result = await image2base64(
        secondChapterSeventhSectionFirstSectionImg,
      )
      setSecondChapterSeventhSectionFirstSectionImgDataUri(
        `data:image/png;base64,${result}`,
      )
    }

    getCompanyBackgroundDataUri()
    getHeaderFooterImgBackgroundDataUri()
    getFirstChapterImgDataUri()
    getSecondChapterSecondSectionImgDataUri()
    getSecondChapterThirdSectionFirstImgDataUri()
    getSecondChapterThirdSectionSecondImgDataUri()
    getSecondChapterSeventhSectionFirstSectionImgDataUri()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (
      companyBackgroundImgDataUri.length > 0 &&
      headerFooterImgBackgroundDataUri.length > 0 &&
      firstChapterImgDataUri.length > 0 &&
      secondChapterSecondSectionImgDataUri.length > 0 &&
      secondChapterThirdSectionFirstImgDataUri.length > 0 &&
      secondChapterThirdSectionSecondImgDataUri.length > 0 &&
      secondChapterSeventhSectionFirstSectionImgDataUri.length > 0
    ) {
      setLoading(false)
    }
  }, [
    companyBackgroundImgDataUri.length,
    firstChapterImgDataUri.length,
    headerFooterImgBackgroundDataUri.length,
    secondChapterSecondSectionImgDataUri.length,
    secondChapterSeventhSectionFirstSectionImgDataUri.length,
    secondChapterThirdSectionFirstImgDataUri.length,
    secondChapterThirdSectionSecondImgDataUri.length,
  ])
  return loading ? (
    <Spin
      size="large"
      className="relative"
      style={{ left: '50%', marginTop: '10%' }}
    />
  ) : (
    <div id="proposalReport">
      <PdfMakeTest
        {...{
          companyBackgroundImgDataUri,
          headerFooterImgBackgroundDataUri,
          firstChapterImgDataUri,
          secondChapterSecondSectionImgDataUri,
          secondChapterThirdSectionFirstImgDataUri,
          secondChapterThirdSectionSecondImgDataUri,
          secondChapterSeventhSectionFirstSectionImgDataUri,
        }}
      />
    </div>
  )
}

export default Index
