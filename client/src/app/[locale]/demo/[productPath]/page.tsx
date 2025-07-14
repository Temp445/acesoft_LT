'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { InlineWidget } from 'react-calendly'
import axios from 'axios'
import Commonbar from '@/components/Commonbar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const apiUrl = process.env.NEXT_PUBLIC_API_URL
const baseCalendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL

export default function BookDemo() {
  const { productPath } = useParams()
  const [calendlyUrl, setCalendlyUrl] = useState('')

  useEffect(() => {
    const fetchProductCalendlyUrl = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/product/v1/${productPath}`)
        if (res?.data?.calendlyUrl) {
          setCalendlyUrl(res.data.calendlyUrl)
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setCalendlyUrl(baseCalendlyUrl || '')
        } else {
          throw err
        }
      }
    }

    if (productPath) {
      fetchProductCalendlyUrl()
    }
  }, [productPath])

  const widgetUrl = calendlyUrl || baseCalendlyUrl || ''

  return (
    <div>
      <Commonbar />
      <Header />
      <h1 className="mt-10 text-xl md:text-2xl font-bold md:font-extrabold text-center text-shadow-lg/20">
        Book A Free Demo Now!
      </h1>
      <div className="w-full h-screen">
        <InlineWidget url={widgetUrl} styles={{ height: '100%', width: '100%' }} />
      </div>

      <Footer />
    </div>
  )
}
