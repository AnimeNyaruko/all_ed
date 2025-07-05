import { SurveyFormData } from "@/types/survey";

export const effectivenessQuestions: {
	id: keyof SurveyFormData;
	text: string;
}[] = [
	{
		id: "Hiệu quả câu 1",
		text: "Việc học qua các bài tập liên môn trên website giúp tôi/học sinh hiểu sâu hơn kiến thức của từng môn học riêng lẻ.",
	},
	{
		id: "Hiệu quả câu 2",
		text: "Các bài tập liên môn trên website giúp tôi/học sinh thấy được sự kết nối giữa các môn học khác nhau.",
	},
	{
		id: "Hiệu quả câu 3",
		text: "Tôi/Học sinh có thể vận dụng kiến thức từ nhiều môn học để giải quyết các vấn đề trong bài tập liên môn trên website.",
	},
	{
		id: "Hiệu quả câu 4",
		text: "Các bài tập liên môn trên website khuyến khích tôi/học sinh suy nghĩ một cách sáng tạo và tìm ra các giải pháp mới.",
	},
	{
		id: "Hiệu quả câu 5",
		text: "Việc giải quyết các bài tập liên môn giúp tôi/học sinh phát triển kỹ năng tư duy phản biện (ví dụ: phân tích, đánh giá thông tin từ nhiều nguồn).",
	},
	{
		id: "Hiệu quả câu 6",
		text: "Tôi/Học sinh cảm thấy hứng thú và có động lực hơn khi học các chủ đề được trình bày theo cách liên môn trên website.",
	},
	{
		id: "Hiệu quả câu 7",
		text: "Website cung cấp các chủ đề/dự án liên môn đủ hấp dẫn và phù hợp với sở thích/chương trình học của tôi/học sinh.",
	},
	{
		id: "Hiệu quả câu 8",
		text: "Sau khi sử dụng các bài tập liên môn trên website, tôi/học sinh tự tin hơn trong việc áp dụng kiến thức vào các tình huống thực tế.",
	},
];

export const uxQuestions: {
	id: keyof SurveyFormData;
	left: string;
	right: string;
}[] = [
	{ id: "UX câu 1", left: "Khó chịu", right: "Thích thú" },
	{ id: "UX câu 2", left: "Khó hiểu", right: "Dễ hiểu" },
	{ id: "UX câu 3", left: "Sáng tạo", right: "Nhàm chán" },
	{ id: "UX câu 4", left: "Dễ làm quen", right: "Khó làm quen" },
	{ id: "UX câu 5", left: "Hữu ích", right: "Không hữu ích" },
	{ id: "UX câu 6", left: "Nhàm chán", right: "Hấp dẫn" },
	{ id: "UX câu 7", left: "Không thú vị", right: "Thú vị" },
	{ id: "UX câu 8", left: "Khó đoán", right: "Dễ đoán" },
	{ id: "UX câu 9", left: "Tốc độ nhanh", right: "Tốc độ chậm" },
	{ id: "UX câu 10", left: "Đột phá", right: "Thông thường" },
	{ id: "UX câu 11", left: "Gây cản trở", right: "Hỗ trợ tốt" },
	{ id: "UX câu 12", left: "Tốt", right: "Tệ" },
	{ id: "UX câu 13", left: "Phức tạp", right: "Đơn giản" },
	{ id: "UX câu 14", left: "Không thiện cảm", right: "Gây thiện cảm" },
	{ id: "UX câu 15", left: "Thông thường", right: "Tiên tiến" },
	{ id: "UX câu 16", left: "Dùng thấy khó chịu", right: "Dùng thấy dễ chịu" },
	{ id: "UX câu 17", left: "An toàn", right: "Không an toàn" },
	{ id: "UX câu 18", left: "Tạo động lực", right: "Làm mất hứng" },
	{ id: "UX câu 19", left: "Đúng như mong đợi", right: "Không như mong đợi" },
	{ id: "UX câu 20", left: "Kém hiệu quả", right: "Hiệu quả" },
	{ id: "UX câu 21", left: "Rõ ràng, mạch lạc", right: "Khó hiểu, mơ hồ" },
	{ id: "UX câu 22", left: "Thiếu thực tế", right: "Thiết thực, hữu dụng" },
	{ id: "UX câu 23", left: "Gọn gàng", right: "Lộn xộn" },
	{ id: "UX câu 24", left: "Bắt mắt", right: "Không bắt mắt" },
	{ id: "UX câu 25", left: "Thân thiện, dễ gần", right: "Không thân thiện" },
	{
		id: "UX câu 26",
		left: "Truyền thống",
		right: "Hiện đại, có nhiều đổi mới",
	},
];
