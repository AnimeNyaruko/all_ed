"use client";

import { SurveyFormData, UXRating } from "@/types/survey";
import React from "react";

interface StepProps {
  formData: Partial<SurveyFormData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<SurveyFormData>>>;
  errors: Partial<Record<keyof SurveyFormData, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof SurveyFormData, string>>>>;
}

const uxQuestions: { id: keyof SurveyFormData; left: string; right: string }[] = [
	{ id: "ux_q1", left: "Khó chịu", right: "Thích thú" },
	{ id: "ux_q2", left: "Khó hiểu", right: "Dễ hiểu" },
	{ id: "ux_q3", left: "Sáng tạo", right: "Nhàm chán" },
	{ id: "ux_q4", left: "Dễ làm quen", right: "Khó làm quen" },
	{ id: "ux_q5", left: "Hữu ích", right: "Không hữu ích" },
	{ id: "ux_q6", left: "Nhàm chán", right: "Hấp dẫn" },
	{ id: "ux_q7", left: "Không thú vị", right: "Thú vị" },
	{ id: "ux_q8", left: "Khó đoán", right: "Dễ đoán" },
	{ id: "ux_q9", left: "Tốc độ nhanh", right: "Tốc độ chậm" },
	{ id: "ux_q10", left: "Đột phá", right: "Thông thường" },
	{ id: "ux_q11", left: "Gây cản trở", right: "Hỗ trợ tốt" },
	{ id: "ux_q12", left: "Tốt", right: "Tệ" },
	{ id: "ux_q13", left: "Phức tạp", right: "Đơn giản" },
	{ id: "ux_q14", left: "Không thiện cảm", right: "Gây thiện cảm" },
	{ id: "ux_q15", left: "Thông thường", right: "Tiên tiến" },
	{ id: "ux_q16", left: "Dùng thấy khó chịu", right: "Dùng thấy dễ chịu" },
	{ id: "ux_q17", left: "An toàn", right: "Không an toàn" },
	{ id: "ux_q18", left: "Tạo động lực", right: "Làm mất hứng" },
	{ id: "ux_q19", left: "Đúng như mong đợi", right: "Không như mong đợi" },
	{ id: "ux_q20", left: "Kém hiệu quả", right: "Hiệu quả" },
	{ id: "ux_q21", left: "Rõ ràng, mạch lạc", right: "Khó hiểu, mơ hồ" },
	{ id: "ux_q22", left: "Thiếu thực tế", right: "Thiết thực, hữu dụng" },
	{ id: "ux_q23", left: "Gọn gàng", right: "Lộn xộn" },
	{ id: "ux_q24", left: "Bắt mắt", right: "Không bắt mắt" },
	{ id: "ux_q25", left: "Thân thiện, dễ gần", right: "Không thân thiện" },
	{ id: "ux_q26", left: "Truyền thống", right: "Hiện đại, có nhiều đổi mới" },
];

const UXQuestion: React.FC<{
    question: { id: keyof SurveyFormData; left: string; right: string };
    value: UXRating | undefined;
    error: string | undefined;
    onChange: (id: keyof SurveyFormData, value: UXRating) => void;
}> = ({ question, value, error, onChange }) => (
    <>
        <tr id={`field-container-${question.id}`}>
            <td className="w-1/4 text-right pr-4 py-2 text-base text-gray-700">{question.left}</td>
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <td key={num} className="text-center py-2">
                    <input
                        type="radio"
                        name={question.id}
                        value={num}
                        checked={value === num}
                        onChange={() => onChange(question.id, num as UXRating)}
                        className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
                    />
                </td>
            ))}
            <td className="w-1/4 text-left pl-4 py-2 text-base text-gray-700">{question.right}</td>
        </tr>
        {error && (
            <tr>
                <td colSpan={9} className="pt-0 pb-2 text-center text-xs text-red-600">{error}</td>
            </tr>
        )}
    </>
)

const Step3 = ({ formData, setFormData, errors, setErrors }: StepProps) => {
	const handleRatingChange = (name: keyof SurveyFormData, value: UXRating) => {
		setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900">
					Phần C: Đánh giá trải nghiệm người dùng trên website (UX)
				</h3>
				<p className="mt-1 text-base text-gray-600">
					<strong>Hướng dẫn:</strong> Vui lòng cho biết mức độ đồng ý của bạn với các phát biểu sau đây liên quan đến việc sử dụng website The AllEd. (Chọn theo thang đo). <span className="text-red-500">*</span>
				</p>
			</div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-separate" style={{borderSpacing: '0 0.5rem'}}>
                    <thead>
                        <tr>
                            <th className="w-1/4"></th>
                            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                <th key={num} className="text-center font-medium text-gray-600 w-[4ch]">{num}</th>
                            ))}
                            <th className="w-1/4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {uxQuestions.map((q, index) => (
                             <UXQuestion
                                key={index}
                                question={q}
                                value={formData[q.id] as UXRating | undefined}
                                error={errors[q.id]}
                                onChange={handleRatingChange}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
		</div>
	);
};

export default Step3; 