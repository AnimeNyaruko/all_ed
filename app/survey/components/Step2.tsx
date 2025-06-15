"use client";

import { SurveyFormData, Rating } from "@/types/survey";
import React from "react";

interface StepProps {
  formData: Partial<SurveyFormData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<SurveyFormData>>>;
  errors: Partial<Record<keyof SurveyFormData, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof SurveyFormData, string>>>>;
}

const ratingLabels = [
	{ value: 5, label: '5 - Hoàn toàn đồng ý' },
	{ value: 4, label: '4 - Đồng ý' },
	{ value: 3, label: '3 - Bình thường' },
	{ value: 2, label: '2 - Không đồng ý' },
	{ value: 1, label: '1 - Hoàn toàn không đồng ý' },
];

const questions: { id: keyof SurveyFormData, text: string }[] = [
    { id: 'effectiveness_q1', text: 'Việc học qua các bài tập liên môn trên website giúp tôi/học sinh hiểu sâu hơn kiến thức của từng môn học riêng lẻ.' },
    { id: 'effectiveness_q2', text: 'Các bài tập liên môn trên website giúp tôi/học sinh thấy được sự kết nối giữa các môn học khác nhau.' },
    { id: 'effectiveness_q3', text: 'Tôi/Học sinh có thể vận dụng kiến thức từ nhiều môn học để giải quyết các vấn đề trong bài tập liên môn trên website.' },
    { id: 'effectiveness_q4', text: 'Các bài tập liên môn trên website khuyến khích tôi/học sinh suy nghĩ một cách sáng tạo và tìm ra các giải pháp mới.' },
    { id: 'effectiveness_q5', text: 'Việc giải quyết các bài tập liên môn giúp tôi/học sinh phát triển kỹ năng tư duy phản biện (ví dụ: phân tích, đánh giá thông tin từ nhiều nguồn).' },
    { id: 'effectiveness_q6', text: 'Tôi/Học sinh cảm thấy hứng thú và có động lực hơn khi học các chủ đề được trình bày theo cách liên môn trên website.' },
    { id: 'effectiveness_q7', text: 'Website cung cấp các chủ đề/dự án liên môn đủ hấp dẫn và phù hợp với sở thích/chương trình học của tôi/học sinh.' },
    { id: 'effectiveness_q8', text: 'Sau khi sử dụng các bài tập liên môn trên website, tôi/học sinh tự tin hơn trong việc áp dụng kiến thức vào các tình huống thực tế.' }
];

const RatingQuestion: React.FC<{
    question: { id: keyof SurveyFormData, text: string };
    value: Rating | undefined;
    error: string | undefined;
    onChange: (id: keyof SurveyFormData, value: Rating) => void;
}> = ({ question, value, error, onChange }) => (
    <div className="py-4 border-b border-gray-200" id={`field-container-${question.id}`}>
        <label className="block text-base font-semibold text-gray-700">
            {question.text} <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 flex flex-col space-y-1">
            {ratingLabels.map(item => (
                <label key={item.value} className="flex items-center p-2 -ml-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                        id={`${question.id}-${item.value}`}
                        name={question.id}
                        type="radio"
                        value={item.value}
                        checked={value === item.value}
                        onChange={() => onChange(question.id, item.value as Rating)}
                        className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 block text-base text-gray-700">
                        {item.label}
                    </span>
                </label>
            ))}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);


const Step2 = ({ formData, setFormData, errors, setErrors }: StepProps) => {
	const handleRatingChange = (name: keyof SurveyFormData, value: Rating) => {
		setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
	};
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900">
					Phần B: Đánh giá hiệu quả của việc học tập thông qua các bài tập
					liên môn trên website
				</h3>
				<p className="mt-1 text-base text-gray-600">
					<strong>Hướng dẫn:</strong> Vui lòng cho biết mức độ đồng ý của bạn với các phát biểu
					sau đây liên quan đến việc sử dụng các bài tập liên môn trên website
					The AllEd.
				</p>
			</div>

            <div className="space-y-2">
                {questions.map((q, index) => (
                    <RatingQuestion
                        key={index}
                        question={{...q, text: `${index + 1}. ${q.text}`}}
                        value={formData[q.id] as Rating | undefined}
                        error={errors[q.id]}
                        onChange={handleRatingChange}
                    />
                ))}
            </div>
            
            <div className="pt-4" id="field-container-biggestBenefit_q9">
                <label htmlFor="biggestBenefit_q9" className="block text-base font-semibold text-gray-700">
                    9. Câu hỏi mở: Theo bạn, lợi ích lớn nhất của việc học tập qua các bài tập liên môn trên website này là gì?
                </label>
                <textarea
                    id="biggestBenefit_q9"
                    name="biggestBenefit_q9"
                    rows={4}
                    value={formData.biggestBenefit_q9 || ''}
                    onChange={handleTextChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                />
            </div>

            <div id="field-container-learningDifficulties_q10">
                <label htmlFor="learningDifficulties_q10" className="block text-base font-semibold text-gray-700">
                    10. Câu hỏi mở: Bạn có gặp khó khăn gì khi học hoặc tạo các bài tập liên môn trên website không? Nếu có, vui lòng chia sẻ.
                </label>
                <textarea
                    id="learningDifficulties_q10"
                    name="learningDifficulties_q10"
                    rows={4}
                    value={formData.learningDifficulties_q10 || ''}
                    onChange={handleTextChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                />
            </div>
		</div>
	);
};

export default Step2; 