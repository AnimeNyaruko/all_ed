export type Rating = 1 | 2 | 3 | 4 | 5 | '';
export type UXRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | '';

export interface SurveyFormData {
  // Step 1: Thông tin chung
  fullName: string;
  school: string;
  role: 'student' | 'teacher' | 'other' | '';
  otherRole?: string;
  grade?: 'elementary' | 'middle' | '10' | '11' | '12' | 'university' | 'other' | '';
  otherGrade?: string;
  subjectAndExperience?: string;
  usageDuration: 'new' | '1-4w' | '1-3m' | 'over-3m' | '';
  usageFrequency: 'daily' | 'few-times-week' | 'once-week' | 'rarely' | '';
  
  // Step 2: Đánh giá hiệu quả
  effectiveness_q1?: Rating;
  effectiveness_q2?: Rating;
  effectiveness_q3?: Rating;
  effectiveness_q4?: Rating;
  effectiveness_q5?: Rating;
  effectiveness_q6?: Rating;
  effectiveness_q7?: Rating;
  effectiveness_q8?: Rating;
  biggestBenefit_q9?: string;
  learningDifficulties_q10?: string;

  // Step 3: Đánh giá trải nghiệm người dùng (UX)
  ux_q1?: UXRating;
  ux_q2?: UXRating;
  ux_q3?: UXRating;
  ux_q4?: UXRating;
  ux_q5?: UXRating;
  ux_q6?: UXRating;
  ux_q7?: UXRating;
  ux_q8?: UXRating;
  ux_q9?: UXRating;
  ux_q10?: UXRating;
  ux_q11?: UXRating;
  ux_q12?: UXRating;
  ux_q13?: UXRating;
  ux_q14?: UXRating;
  ux_q15?: UXRating;
  ux_q16?: UXRating;
  ux_q17?: UXRating;
  ux_q18?: UXRating;
  ux_q19?: UXRating;
  ux_q20?: UXRating;
  ux_q21?: UXRating;
  ux_q22?: UXRating;
  ux_q23?: UXRating;
  ux_q24?: UXRating;
  ux_q25?: UXRating;
  ux_q26?: UXRating;

  // Step 4: Góp ý và Đề xuất
  newFeatureSuggestion?: string;
  recommendationLikelihood?: 'definitely-not' | 'probably-not' | 'maybe' | 'probably-yes' | 'definitely-yes' | '';
  otherFeedback?: string;
} 