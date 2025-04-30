import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();

		// Lấy dữ liệu từ FormData
		const time = formData.get("time");
		const deBai = formData.get("de_bai");
		const cauHoiString = formData.get("cau_hoi");

		// Kiểm tra dữ liệu có tồn tại không
		if (time === null || deBai === null || cauHoiString === null) {
			return NextResponse.json(
				{ success: false, error: "Missing form data." },
				{ status: 400 },
			);
		}

		// Parse chuỗi JSON của câu hỏi và câu trả lời
		let cauHoiData: Record<string, string> = {};
		try {
			cauHoiData = JSON.parse(cauHoiString as string);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_e) {
			return NextResponse.json(
				{ success: false, error: "Invalid JSON format for cau_hoi." },
				{ status: 400 },
			);
		}

		// Khai báo các biến riêng theo yêu cầu (bạn sẽ xử lý sau)
		const extractedTime: string = time as string;
		const extractedDeBai: string = deBai as string;
		const extractedCauHoi: Record<string, string> = cauHoiData;

		console.log("Received Time:", extractedTime);
		console.log("Received De Bai:", extractedDeBai);
		console.log("Received Cau Hoi:", extractedCauHoi);

		// Xử lý dữ liệu ở đây (ví dụ: lưu vào cơ sở dữ liệu)
		// ... (logic xử lý của bạn sẽ được thêm vào đây)

		// Trả về phản hồi thành công
		return NextResponse.json({
			success: true,
			message: "Answers submitted successfully.",
			receivedData: {
				time: extractedTime,
				de_bai: extractedDeBai,
				cau_hoi: extractedCauHoi,
			},
		});
	} catch (error) {
		console.error("Error in /api/nopbai:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
