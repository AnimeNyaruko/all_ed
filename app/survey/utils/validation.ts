import { SurveyFormData } from "@/types/survey";

export const validateStep1 = (formData: Partial<SurveyFormData>) => {
	const errors: Partial<Record<keyof SurveyFormData, string>> = {};

	if (!formData["Họ và Tên"]?.trim()) {
		errors["Họ và Tên"] = "Vui lòng nhập họ và tên.";
	}
	if (!formData["Trường"]?.trim()) {
		errors["Trường"] = "Vui lòng nhập tên trường.";
	}
	if (!formData["Vai trò"]) {
		errors["Vai trò"] = "Vui lòng chọn vai trò của bạn.";
	} else if (
		formData["Vai trò"] === "Khác" &&
		!formData["Vai trò khác"]?.trim()
	) {
		errors["Vai trò khác"] = "Vui lòng ghi rõ vai trò của bạn.";
	}

	if (formData["Vai trò"] === "Học sinh") {
		if (!formData["Khối lớp"]) {
			errors["Khối lớp"] = "Vui lòng chọn khối lớp.";
		} else if (
			formData["Khối lớp"] === "Khác" &&
			!formData["Khối lớp khác"]?.trim()
		) {
			errors["Khối lớp khác"] = "Vui lòng ghi rõ khối lớp của bạn.";
		}
	}

	if (!formData["Thời gian sử dụng"]) {
		errors["Thời gian sử dụng"] = "Vui lòng chọn thời gian sử dụng.";
	}
	if (!formData["Tần suất sử dụng"]) {
		errors["Tần suất sử dụng"] = "Vui lòng chọn tần suất sử dụng.";
	}

	return errors;
};

export const validateStep2 = (formData: Partial<SurveyFormData>) => {
	const errors: Partial<Record<keyof SurveyFormData, string>> = {};
	const questionsToValidate: (keyof SurveyFormData)[] = [
		"Hiệu quả câu 1",
		"Hiệu quả câu 2",
		"Hiệu quả câu 3",
		"Hiệu quả câu 4",
		"Hiệu quả câu 5",
		"Hiệu quả câu 6",
		"Hiệu quả câu 7",
		"Hiệu quả câu 8",
	];

	questionsToValidate.forEach((q) => {
		if (!formData[q]) {
			errors[q] = "Vui lòng chọn một mức độ.";
		}
	});

	return errors;
};

export const validateStep3 = (formData: Partial<SurveyFormData>) => {
	const errors: Partial<Record<keyof SurveyFormData, string>> = {};
	const questionsToValidate: (keyof SurveyFormData)[] = [
		"UX câu 1",
		"UX câu 2",
		"UX câu 3",
		"UX câu 4",
		"UX câu 5",
		"UX câu 6",
		"UX câu 7",
		"UX câu 8",
		"UX câu 9",
		"UX câu 10",
		"UX câu 11",
		"UX câu 12",
		"UX câu 13",
		"UX câu 14",
		"UX câu 15",
		"UX câu 16",
		"UX câu 17",
		"UX câu 18",
		"UX câu 19",
		"UX câu 20",
		"UX câu 21",
		"UX câu 22",
		"UX câu 23",
		"UX câu 24",
		"UX câu 25",
		"UX câu 26",
	];

	questionsToValidate.forEach((q) => {
		if (!formData[q]) {
			errors[q] = "Vui lòng đưa ra lựa chọn cho câu hỏi này.";
		}
	});

	return errors;
};

export const validateStep4 = (formData: Partial<SurveyFormData>) => {
	const errors: Partial<Record<keyof SurveyFormData, string>> = {};
	if (!formData["Khả năng giới thiệu"]) {
		errors["Khả năng giới thiệu"] =
			"Vui lòng cho biết bạn có sẵn lòng giới thiệu The AllEd không.";
	}
	return errors;
};
