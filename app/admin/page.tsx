import { AdminAuth } from './components/AdminAuth'
import { ResumeEditor } from './components/ResumeEditor'
import { getStaticResumeData } from '@/lib/resume-types'

export default function AdminPage() {
  const initialData = getStaticResumeData()

  return (
    <AdminAuth>
      <ResumeEditor initialData={initialData} />
    </AdminAuth>
  )
}
