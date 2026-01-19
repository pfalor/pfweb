import {
  personalInfo,
  credentials,
  stats,
  experience,
  metrics,
  expertise,
  education,
} from './data'

export interface ResumeData {
  personalInfo: typeof personalInfo
  credentials: typeof credentials
  stats: typeof stats
  experience: typeof experience
  metrics: typeof metrics
  expertise: typeof expertise
  education: typeof education
}

export function getStaticResumeData(): ResumeData {
  return {
    personalInfo,
    credentials,
    stats,
    experience,
    metrics,
    expertise,
    education,
  }
}
