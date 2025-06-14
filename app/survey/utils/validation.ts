import { SurveyFormData } from "@/types/survey";

export const validateStep1 = (formData: Partial<SurveyFormData>) => {
  const errors: Partial<Record<keyof SurveyFormData, string>> = {};

  if (!formData.fullName?.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  }
  if (!formData.school?.trim()) {
    errors.school = "Vui lòng nhập tên trường.";
  }
  if (!formData.role) {
    errors.role = "Vui lòng chọn vai trò của bạn.";
  } else if (formData.role === 'other' && !formData.otherRole?.trim()) {
    errors.otherRole = "Vui lòng ghi rõ vai trò của bạn.";
  }

  if (formData.role === 'student') {
    if (!formData.grade) {
      errors.grade = "Vui lòng chọn khối lớp.";
    } else if (formData.grade === 'other' && !formData.otherGrade?.trim()) {
      errors.otherGrade = "Vui lòng ghi rõ khối lớp của bạn.";
    }
  }

  if (!formData.usageDuration) {
    errors.usageDuration = "Vui lòng chọn thời gian sử dụng.";
  }
  if (!formData.usageFrequency) {
    errors.usageFrequency = "Vui lòng chọn tần suất sử dụng.";
  }

  return errors;
};

export const validateStep2 = (formData: Partial<SurveyFormData>) => {
	const errors: Partial<Record<keyof SurveyFormData, string>> = {};
	const questionsToValidate: (keyof SurveyFormData)[] = [
		'effectiveness_q1',
		'effectiveness_q2',
		'effectiveness_q3',
		'effectiveness_q4',
		'effectiveness_q5',
		'effectiveness_q6',
		'effectiveness_q7',
		'effectiveness_q8',
	];

	questionsToValidate.forEach(q => {
		if (!formData[q]) {
			errors[q] = "Vui lòng chọn một mức độ."
		}
	});

	return errors;
}

export const validateStep3 = (formData: Partial<SurveyFormData>) => {
	const errors: Partial<Record<keyof SurveyFormData, string>> = {};
	const questionsToValidate: (keyof SurveyFormData)[] = [
		'ux_q1', 'ux_q2', 'ux_q3', 'ux_q4', 'ux_q5', 'ux_q6', 'ux_q7', 
		'ux_q8', 'ux_q9', 'ux_q10', 'ux_q11', 'ux_q12', 'ux_q13', 'ux_q14',
		'ux_q15', 'ux_q16', 'ux_q17', 'ux_q18', 'ux_q19', 'ux_q20', 'ux_q21',
		'ux_q22', 'ux_q23', 'ux_q24', 'ux_q25', 'ux_q26'
	];

	questionsToValidate.forEach(q => {
		if (!formData[q]) {
			errors[q] = "Vui lòng đưa ra lựa chọn cho câu hỏi này."
		}
	});

	return errors;
}

export const validateStep4 = (formData: Partial<SurveyFormData>) => {
	const errors: Partial<Record<keyof SurveyFormData, string>> = {};
	if (!formData.recommendationLikelihood) {
		errors.recommendationLikelihood = "Vui lòng cho biết bạn có sẵn lòng giới thiệu The AllEd không.";
	}
	return errors;
} 