import { NextResponse } from "next/server";
import sql from "@/utils/database";

export async function GET() {
	try {
		await sql`CREATE SCHEMA IF NOT EXISTS survey`;

		await sql`
      CREATE TABLE IF NOT EXISTS survey.survey (
        "id" SERIAL PRIMARY KEY,
        "Họ và Tên" TEXT,
        "Trường" TEXT,
        "Vai trò" TEXT,
        "Thời gian sử dụng" TEXT,
        "Tần suất sử dụng" TEXT,
        "Hiệu quả câu 1" JSONB,
        "Hiệu quả câu 2" JSONB,
        "Hiệu quả câu 3" JSONB,
        "Hiệu quả câu 4" JSONB,
        "Hiệu quả câu 5" JSONB,
        "Hiệu quả câu 6" JSONB,
        "Hiệu quả câu 7" JSONB,
        "Hiệu quả câu 8" JSONB,
        "Lợi ích lớn nhất" TEXT,
        "Khó khăn khi học" TEXT,
        "UX câu 1" JSONB,
        "UX câu 2" JSONB,
        "UX câu 3" JSONB,
        "UX câu 4" JSONB,
        "UX câu 5" JSONB,
        "UX câu 6" JSONB,
        "UX câu 7" JSONB,
        "UX câu 8" JSONB,
        "UX câu 9" JSONB,
        "UX câu 10" JSONB,
        "UX câu 11" JSONB,
        "UX câu 12" JSONB,
        "UX câu 13" JSONB,
        "UX câu 14" JSONB,
        "UX câu 15" JSONB,
        "UX câu 16" JSONB,
        "UX câu 17" JSONB,
        "UX câu 18" JSONB,
        "UX câu 19" JSONB,
        "UX câu 20" JSONB,
        "UX câu 21" JSONB,
        "UX câu 22" JSONB,
        "UX câu 23" JSONB,
        "UX câu 24" JSONB,
        "UX câu 25" JSONB,
        "UX câu 26" JSONB,
        "Khả năng giới thiệu" TEXT,
        "Khối lớp" TEXT,
        "Đề xuất tính năng mới" TEXT,
        "Góp ý khác" TEXT
      )
    `;

		const sampleData = {
			"Họ và Tên": "sdfg",
			Trường: "sdfg",
			"Vai trò": "Học sinh",
			"Thời gian sử dụng": "Mới sử dụng (Dưới 1 tuần)",
			"Tần suất sử dụng": "Hàng ngày",
			"Hiệu quả câu 1": {
				text: "Việc học qua các bài tập liên môn trên website giúp tôi/học sinh hiểu sâu hơn kiến thức của từng môn học riêng lẻ.",
				value: 5,
			},
			"Hiệu quả câu 2": {
				text: "Các bài tập liên môn trên website giúp tôi/học sinh thấy được sự kết nối giữa các môn học khác nhau.",
				value: 5,
			},
			"Hiệu quả câu 3": {
				text: "Tôi/Học sinh có thể vận dụng kiến thức từ nhiều môn học để giải quyết các vấn đề trong bài tập liên môn trên website.",
				value: 5,
			},
			"Hiệu quả câu 4": {
				text: "Các bài tập liên môn trên website khuyến khích tôi/học sinh suy nghĩ một cách sáng tạo và tìm ra các giải pháp mới.",
				value: 5,
			},
			"Hiệu quả câu 5": {
				text: "Việc giải quyết các bài tập liên môn giúp tôi/học sinh phát triển kỹ năng tư duy phản biện (ví dụ: phân tích, đánh giá thông tin từ nhiều nguồn).",
				value: 5,
			},
			"Hiệu quả câu 6": {
				text: "Tôi/Học sinh cảm thấy hứng thú và có động lực hơn khi học các chủ đề được trình bày theo cách liên môn trên website.",
				value: 5,
			},
			"Hiệu quả câu 7": {
				text: "Website cung cấp các chủ đề/dự án liên môn đủ hấp dẫn và phù hợp với sở thích/chương trình học của tôi/học sinh.",
				value: 5,
			},
			"Hiệu quả câu 8": {
				text: "Sau khi sử dụng các bài tập liên môn trên website, tôi/học sinh tự tin hơn trong việc áp dụng kiến thức vào các tình huống thực tế.",
				value: 5,
			},
			"Lợi ích lớn nhất": " dgfsdgf",
			"Khó khăn khi học": "sdfgsdfgds",
			"UX câu 1": { text: "Khó chịu - Thích thú", value: 1 },
			"UX câu 2": { text: "Khó hiểu - Dễ hiểu", value: 1 },
			"UX câu 3": { text: "Sáng tạo - Nhàm chán", value: 1 },
			"UX câu 4": { text: "Dễ làm quen - Khó làm quen", value: 1 },
			"UX câu 5": { text: "Hữu ích - Không hữu ích", value: 1 },
			"UX câu 6": { text: "Nhàm chán - Hấp dẫn", value: 1 },
			"UX câu 7": { text: "Không thú vị - Thú vị", value: 1 },
			"UX câu 8": { text: "Khó đoán - Dễ đoán", value: 1 },
			"UX câu 9": { text: "Tốc độ nhanh - Tốc độ chậm", value: 1 },
			"UX câu 10": { text: "Đột phá - Thông thường", value: 1 },
			"UX câu 11": { text: "Gây cản trở - Hỗ trợ tốt", value: 1 },
			"UX câu 12": { text: "Tốt - Tệ", value: 7 },
			"UX câu 13": { text: "Phức tạp - Đơn giản", value: 1 },
			"UX câu 14": { text: "Không thiện cảm - Gây thiện cảm", value: 1 },
			"UX câu 15": { text: "Thông thường - Tiên tiến", value: 1 },
			"UX câu 16": { text: "Dùng thấy khó chịu - Dùng thấy dễ chịu", value: 1 },
			"UX câu 17": { text: "An toàn - Không an toàn", value: 1 },
			"UX câu 18": { text: "Tạo động lực - Làm mất hứng", value: 1 },
			"UX câu 19": { text: "Đúng như mong đợi - Không như mong đợi", value: 1 },
			"UX câu 20": { text: "Kém hiệu quả - Hiệu quả", value: 1 },
			"UX câu 21": { text: "Rõ ràng, mạch lạc - Khó hiểu, mơ hồ", value: 1 },
			"UX câu 22": { text: "Thiếu thực tế - Thiết thực, hữu dụng", value: 1 },
			"UX câu 23": { text: "Gọn gàng - Lộn xộn", value: 1 },
			"UX câu 24": { text: "Bắt mắt - Không bắt mắt", value: 1 },
			"UX câu 25": { text: "Thân thiện, dễ gần - Không thân thiện", value: 1 },
			"UX câu 26": {
				text: "Truyền thống - Hiện đại, có nhiều đổi mới",
				value: 1,
			},
			"Khả năng giới thiệu": "Chắc chắn không",
			"Khối lớp": "Tiểu học",
			"Đề xuất tính năng mới": "asfasdfsdf",
			"Góp ý khác": "asdfafd",
		};

		await sql`
			INSERT INTO survey.survey (
				"Họ và Tên", "Trường", "Vai trò", "Thời gian sử dụng", "Tần suất sử dụng",
				"Hiệu quả câu 1", "Hiệu quả câu 2", "Hiệu quả câu 3", "Hiệu quả câu 4", "Hiệu quả câu 5",
				"Hiệu quả câu 6", "Hiệu quả câu 7", "Hiệu quả câu 8",
				"Lợi ích lớn nhất", "Khó khăn khi học",
				"UX câu 1", "UX câu 2", "UX câu 3", "UX câu 4", "UX câu 5",
				"UX câu 6", "UX câu 7", "UX câu 8", "UX câu 9", "UX câu 10",
				"UX câu 11", "UX câu 12", "UX câu 13", "UX câu 14", "UX câu 15",
				"UX câu 16", "UX câu 17", "UX câu 18", "UX câu 19", "UX câu 20",
				"UX câu 21", "UX câu 22", "UX câu 23", "UX câu 24", "UX câu 25", "UX câu 26",
				"Khả năng giới thiệu", "Khối lớp", "Đề xuất tính năng mới", "Góp ý khác"
			) VALUES (
				${sampleData["Họ và Tên"]}, ${sampleData["Trường"]}, ${sampleData["Vai trò"]},
				${sampleData["Thời gian sử dụng"]}, ${sampleData["Tần suất sử dụng"]},
				${JSON.stringify(sampleData["Hiệu quả câu 1"])},
				${JSON.stringify(sampleData["Hiệu quả câu 2"])},
				${JSON.stringify(sampleData["Hiệu quả câu 3"])},
				${JSON.stringify(sampleData["Hiệu quả câu 4"])},
				${JSON.stringify(sampleData["Hiệu quả câu 5"])},
				${JSON.stringify(sampleData["Hiệu quả câu 6"])},
				${JSON.stringify(sampleData["Hiệu quả câu 7"])},
				${JSON.stringify(sampleData["Hiệu quả câu 8"])},
				${sampleData["Lợi ích lớn nhất"]}, ${sampleData["Khó khăn khi học"]},
				${JSON.stringify(sampleData["UX câu 1"])},
				${JSON.stringify(sampleData["UX câu 2"])},
				${JSON.stringify(sampleData["UX câu 3"])},
				${JSON.stringify(sampleData["UX câu 4"])},
				${JSON.stringify(sampleData["UX câu 5"])},
				${JSON.stringify(sampleData["UX câu 6"])},
				${JSON.stringify(sampleData["UX câu 7"])},
				${JSON.stringify(sampleData["UX câu 8"])},
				${JSON.stringify(sampleData["UX câu 9"])},
				${JSON.stringify(sampleData["UX câu 10"])},
				${JSON.stringify(sampleData["UX câu 11"])},
				${JSON.stringify(sampleData["UX câu 12"])},
				${JSON.stringify(sampleData["UX câu 13"])},
				${JSON.stringify(sampleData["UX câu 14"])},
				${JSON.stringify(sampleData["UX câu 15"])},
				${JSON.stringify(sampleData["UX câu 16"])},
				${JSON.stringify(sampleData["UX câu 17"])},
				${JSON.stringify(sampleData["UX câu 18"])},
				${JSON.stringify(sampleData["UX câu 19"])},
				${JSON.stringify(sampleData["UX câu 20"])},
				${JSON.stringify(sampleData["UX câu 21"])},
				${JSON.stringify(sampleData["UX câu 22"])},
				${JSON.stringify(sampleData["UX câu 23"])},
				${JSON.stringify(sampleData["UX câu 24"])},
				${JSON.stringify(sampleData["UX câu 25"])},
				${JSON.stringify(sampleData["UX câu 26"])},
				${sampleData["Khả năng giới thiệu"]}, ${sampleData["Khối lớp"]},
				${sampleData["Đề xuất tính năng mới"]}, ${sampleData["Góp ý khác"]}
			)
    `;

		return NextResponse.json({
			success: true,
			message: "Schema, table created and data inserted successfully.",
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "An error occurred.",
				error: (error as Error).message,
			},
			{ status: 500 },
		);
	}
}
