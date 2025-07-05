export type Rating = 1 | 2 | 3 | 4 | 5 | "";
export type UXRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | "";

type ValidRating = 1 | 2 | 3 | 4 | 5;
type ValidUXRating = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type FormattedResponse = {
	text: string;
	value: ValidRating | ValidUXRating;
};

export interface SurveyFormData {
	// Step 1: Thông tin chung
	"Họ và Tên": string;
	Trường: string;
	"Vai trò": "Học sinh" | "Giáo viên" | "Khác" | "";
	"Vai trò khác"?: string;
	"Khối lớp"?:
		| "Tiểu học"
		| "THCS"
		| "Lớp 10"
		| "Lớp 11"
		| "Lớp 12"
		| "Đại học"
		| "Khác"
		| "";
	"Khối lớp khác"?: string;
	"Môn học và kinh nghiệm"?: string;
	"Thời gian sử dụng":
		| "Mới sử dụng (Dưới 1 tuần)"
		| "1-4 tuần"
		| "1-3 tháng"
		| "Trên 3 tháng"
		| "";
	"Tần suất sử dụng":
		| "Hàng ngày"
		| "Vài lần một tuần"
		| "Một lần một tuần"
		| "Hiếm khi"
		| "";

	// Step 2: Đánh giá hiệu quả
	"Hiệu quả câu 1"?: Rating | FormattedResponse;
	"Hiệu quả câu 2"?: Rating | FormattedResponse;
	"Hiệu quả câu 3"?: Rating | FormattedResponse;
	"Hiệu quả câu 4"?: Rating | FormattedResponse;
	"Hiệu quả câu 5"?: Rating | FormattedResponse;
	"Hiệu quả câu 6"?: Rating | FormattedResponse;
	"Hiệu quả câu 7"?: Rating | FormattedResponse;
	"Hiệu quả câu 8"?: Rating | FormattedResponse;
	"Lợi ích lớn nhất"?: string;
	"Khó khăn khi học"?: string;

	// Step 3: Đánh giá trải nghiệm người dùng (UX)
	"UX câu 1"?: UXRating | FormattedResponse;
	"UX câu 2"?: UXRating | FormattedResponse;
	"UX câu 3"?: UXRating | FormattedResponse;
	"UX câu 4"?: UXRating | FormattedResponse;
	"UX câu 5"?: UXRating | FormattedResponse;
	"UX câu 6"?: UXRating | FormattedResponse;
	"UX câu 7"?: UXRating | FormattedResponse;
	"UX câu 8"?: UXRating | FormattedResponse;
	"UX câu 9"?: UXRating | FormattedResponse;
	"UX câu 10"?: UXRating | FormattedResponse;
	"UX câu 11"?: UXRating | FormattedResponse;
	"UX câu 12"?: UXRating | FormattedResponse;
	"UX câu 13"?: UXRating | FormattedResponse;
	"UX câu 14"?: UXRating | FormattedResponse;
	"UX câu 15"?: UXRating | FormattedResponse;
	"UX câu 16"?: UXRating | FormattedResponse;
	"UX câu 17"?: UXRating | FormattedResponse;
	"UX câu 18"?: UXRating | FormattedResponse;
	"UX câu 19"?: UXRating | FormattedResponse;
	"UX câu 20"?: UXRating | FormattedResponse;
	"UX câu 21"?: UXRating | FormattedResponse;
	"UX câu 22"?: UXRating | FormattedResponse;
	"UX câu 23"?: UXRating | FormattedResponse;
	"UX câu 24"?: UXRating | FormattedResponse;
	"UX câu 25"?: UXRating | FormattedResponse;
	"UX câu 26"?: UXRating | FormattedResponse;

	// Step 4: Góp ý và Đề xuất
	"Đề xuất tính năng mới"?: string;
	"Khả năng giới thiệu"?:
		| "Chắc chắn không"
		| "Có lẽ không"
		| "Có thể"
		| "Có lẽ có"
		| "Chắc chắn có"
		| "";
	"Góp ý khác"?: string;
}
