import WhatsappSurveyForm from '@/components/WhatsappSurveyForm'
import { ToastProvider, ToastContainer } from '@/components/Toast'

export const metadata = {
  title: 'Foundation Survey | Honlly Isaac Jokema Foundation',
  description: 'Share your feedback and thoughts about our foundation',
}

export default function SurveyPage() {
  return (
    <ToastProvider>
      <WhatsappSurveyForm />
      <ToastContainer />
    </ToastProvider>
  )
}
