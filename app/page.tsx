import { ClientPage } from './ClientPage'
import { getStaticResumeData } from '@/lib/resume-types'

export default function Home() {
  const data = getStaticResumeData()

  return <ClientPage data={data} />
}
