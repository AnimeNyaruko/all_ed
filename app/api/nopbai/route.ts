import { generateText } from "@/utils/googleAI";
import { NextRequest, NextResponse } from "next/server";
import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";

export async function POST(request: NextRequest) {
	try {
		// Đọc dữ liệu từ body request dưới dạng JSON
		const body = await request.json();

		// Lấy dữ liệu từ body JSON
		const { time, de_bai, cau_hoi, cau_tra_loi, username, assignmentID } = body;

		// Kiểm tra dữ liệu có tồn tại và đúng kiểu không
		if (
			time === undefined ||
			de_bai === undefined ||
			cau_hoi === undefined ||
			cau_tra_loi === undefined ||
			!Array.isArray(cau_hoi) ||
			!Array.isArray(cau_tra_loi) ||
			!username ||
			!assignmentID
		) {
			return NextResponse.json(
				{ success: false, error: "Missing or invalid data in request body." },
				{ status: 400 },
			);
		}

		// Kiểm tra mảng câu hỏi và câu trả lời có cùng độ dài không
		if (cau_hoi.length !== cau_tra_loi.length) {
			return NextResponse.json(
				{
					success: false,
					error: "Question and answer arrays must have the same length.",
				},
				{ status: 400 },
			);
		}

		// Khai báo các biến riêng theo yêu cầu (bạn sẽ xử lý sau)

		// Xử lý dữ liệu ở đây (ví dụ: lưu vào cơ sở dữ liệu)
		// ... (logic xử lý của bạn sẽ được thêm vào đây)
		const prompt = `
**Bối cảnh:**

Bạn là một Giáo viên Chuyên gia Xuất sắc, với kiến thức chuyên sâu về Toán, Lý, Hóa, Sinh (Lớp 1-12).
Nhiệm vụ: Đánh giá bài làm của học sinh dựa trên JSON đầu vào, đảm bảo **ĐỘ CHÍNH XÁC TUYỆT ĐỐI** và cung cấp **CHỈ KẾT QUẢ CUỐI CÙNG** đúng chuẩn, tuân thủ định dạng & đơn vị.

**Yêu cầu nhiệm vụ:**

Dựa trên \`INPUT_JSON\` sau:
\`\`\`json
${JSON.stringify(body)}
\`\`\`

Thực hiện các bước sau:

1.  **Phân tích \`INPUT_JSON\`**.
2.  **Lặp qua từng câu hỏi** (sử dụng index \`i\` cho \`cau_hoi[i]\` và \`cau_tra_loi[i]\`).
3.  **Đối với mỗi câu hỏi \`i\`:**
    *   **A. Phân tích Câu hỏi & Quy định:**
        *   Hiểu rõ yêu cầu \`cau_hoi[i]\`.
        *   **QUAN TRỌNG:** Kiểm tra \`de_bai\` và \`cau_hoi[i]\` để tìm quy định về:
            *   **Định dạng kết quả:** (Ví dụ: làm tròn, phân số tối giản, dạng khoa học).
            *   **Đơn vị đo lường:** (Ví dụ: m, kg, mol/l, %). Ghi nhớ đơn vị yêu cầu.
    *   **B. Xác định CHỈ KẾT QUẢ CUỐI CÙNG (Bao gồm Định dạng & Đơn vị):**
        *   **CỰC KỲ QUAN TRỌNG:** Dựa vào chuyên môn, xác định **CHỈ KẾT QUẢ CUỐI CÙNG** cho \`cau_hoi[i]\`.
        *   Kết quả này phải chính xác, tuân thủ quy định về **định dạng** và **đơn vị** (nếu có).
        *   **KHÔNG** bao gồm các bước giải, lời giải thích, lý luận.
        *   Lưu **chỉ kết quả cuối cùng** này vào danh sách tạm \`correct_answers_list\`.
    *   **C. Phân tích Bài làm Học sinh:** Xem xét kỹ \`cau_tra_loi[i]\`.
    *   **D. Đánh giá Đúng/Sai (Tuyệt đối chính xác):** So sánh \`cau_tra_loi[i]\` với kết quả đúng ở bước B.
        *   **Nguyên tắc:** \`true\` chỉ khi **toàn bộ cốt lõi** của \`cau_tra_loi[i]\` khớp kết quả đúng, **BAO GỒM CẢ ĐỊNH DẠNG VÀ ĐƠN VỊ** (nếu yêu cầu).
        *   **Giải thích dài:** Nếu thừa nhưng đúng và không lỗi -> Vẫn \`true\`. Nếu phần thừa có lỗi -> \`false\`.
        *   **Lỗi -> \`false\`:** Bất kỳ sai sót nào về giá trị, logic, định dạng, đơn vị.
        *   **Không trả lời/Trống -> \`false\`**.
        *   Lưu kết quả boolean (\`true\`/\`false\`) vào \`evaluation_results_list\`.
4.  **Tổng hợp kết quả.**
5.  **Định dạng đầu ra:** Trả về **MỘT CHUỖI JSON DUY NHẤT**, **TUYỆT ĐỐI HỢP LỆ** theo cấu trúc:

\`\`\`json
{
  \"cau_tra_loi_dung\": [boolean, boolean, ...],
  \"dap_an_dung\": [\"string\", \"string\", ...]
}
\`\`\`
    Trong đó:
    *   \`cau_tra_loi_dung\`: Mảng boolean \`true\`/\`false\`.
    *   \`dap_an_dung\`:
        *   **NỘI DUNG:** Mỗi chuỗi **CHỈ ĐƯỢC PHÉP** chứa **KẾT QUẢ CUỐI CÙNG**, tuân thủ định dạng và đơn vị. **TUYỆT ĐỐI KHÔNG** chứa bước giải, giải thích, lý luận.
        *   **Xử lý Ký tự Đặc biệt và Đơn vị:**
            *   **LaTeX:** **PHẢI** bao quanh **TOÀN BỘ** các biểu thức toán học, công thức hóa học, hoặc ký hiệu có chứa cú pháp LaTeX (như \`\\rightarrow\`, \`\\frac\`, \`_\`, \`^\`, \`{\`) bằng một cặp dấu đô la (\`$ ... $\`). Điều này áp dụng cho cả kết quả cuối cùng nếu nó chứa các ký hiệu này.
                *   *Ví dụ Phương trình hóa học:* \`$2Na + 2HCl \\rightarrow 2NaCl + H_2$\`
                *   *Ví dụ Ký hiệu hóa học/vật lý:* \`$m_{Na} = 92/37$ g\`, \`$v_{tb} = 10$ m/s\`
                *   *Ví dụ Công thức toán:* \`$V = \\frac{4}{3}\\pi r^3$\`
                *   *Lưu ý về Phần trăm (%):*
                    *   Nếu chỉ hiển thị một giá trị phần trăm đơn giản, hãy viết trực tiếp: \`24.86%\`.
                    *   Nếu sử dụng ký hiệu phức tạp hơn như \`%m\` với chỉ số dưới (ví dụ \`%m_{Na}\`), hãy bao toàn bộ ký hiệu đó trong dấu đô la và sử dụng lệnh \`\\%\` của LaTeX để hiển thị ký hiệu phần trăm: \`$\\%m_{Na} = 24.86\\%$\`.
            *   **ESCAPE BACKSLASH (\`\\\\\`) TRONG JSON:** **QUAN TRỌNG:** Bên trong chuỗi JSON, mọi backslash (\`\\\`) trong lệnh LaTeX **PHẢI** được escape thành (\`\\\\\`). Ví dụ: \`\\rightarrow\` -> \`\\\\rightarrow\`, \`\\frac{a}{b}\` -> \`\\\\frac{a}{b}\`, \`\\%\` -> \`\\\\%\`.
            *   **XỬ LÝ XUỐNG DÒNG (\`\\n\`) TRONG JSON:** **KHÁC BIỆT QUAN TRỌNG:** Không giống như backslash trong LaTeX, ký tự xuống dòng **KHÔNG ĐƯỢC ESCAPE**. Để tạo một dòng mới trong chuỗi JSON kết quả, hãy sử dụng **ký tự xuống dòng thực tế (literal newline character)**, KHÔNG phải chuỗi ký tự \`\\\\n\`. Trình phân tích JSON sẽ hiểu đúng ký tự xuống dòng thực tế này.
            *   **Đơn vị Chuẩn (Ngoài % đã nêu trên):** Viết **NGAY SAU** giá trị số, **KHÔNG** dùng dấu phân cách đặc biệt. Ví dụ: \`100°C\`, \`9.8m/s^2\`. **TUYỆT ĐỐI KHÔNG** tạo khối tùy chỉnh.
        *   **QUẢN LÝ XUỐNG DÒNG (Cách sử dụng ký tự xuống dòng thực tế):**
            *   **Xuống dòng thông thường (Enter):** Chỉ sử dụng một **ký tự xuống dòng thực tế** để tách các phần riêng biệt của kết quả cuối cùng nếu thực sự cần thiết và logic (ví dụ: liệt kê nhiều phương trình hoặc kết quả).
            *   **Xuống dòng đặc biệt với mũi tên (2x Enter):** Nếu cần dùng mũi tên ở đầu dòng kết quả, hãy sử dụng **hai ký tự xuống dòng thực tế** liên tiếp trước đó.
            *   **Tránh xuống dòng tùy tiện:** Giữ kết quả liền mạch nếu không có lý do rõ ràng để ngắt dòng.
    *   Thứ tự các phần tử trong mảng phải khớp với thứ tự câu hỏi.

**Quan trọng:**

*   Độ chính xác là trên hết.
*   Kết quả \`dap_an_dung\` phải là kết quả cuối cùng, đúng chuẩn, đúng định dạng/đơn vị.
*   Đảm bảo chuỗi JSON trả về hợp lệ, không có nội dung thừa.
*   Nếu lỗi nghiêm trọng, trả về JSON lỗi: \`{\"error\": \"Mô tả lỗi\"}\`.

**BẮT ĐẦU. Chỉ trả về chuỗi JSON kết quả.**`;

		const aiResponseString = (await generateText(prompt))
			?.split("```json")[1]
			.split("```")[0];
		console.log();
		if (!aiResponseString) {
			return NextResponse.json(
				{ success: false, error: "No result from AI." },
				{ status: 500 },
			);
		}

		let aiResult: { cau_tra_loi_dung: boolean[]; dap_an_dung: string[] };
		try {
			// <<< BƯỚC 1: Parse kết quả từ AI
			aiResult = JSON.parse(aiResponseString);
		} catch (parseError) {
			console.error("Error parsing AI response:", parseError);
			console.error("AI response string:", aiResponseString);
			return NextResponse.json(
				{ success: false, error: "Failed to parse AI response." },
				{ status: 500 },
			);
		}

		// <<< BƯỚC 2: Tạo đối tượng kết quả cuối cùng
		const finalResultObject = {
			time: time,
			de_bai: de_bai,
			cau_hoi: cau_hoi,
			cau_tra_loi: cau_tra_loi,
			cau_tra_loi_dung: aiResult.cau_tra_loi_dung,
			dap_an_dung: aiResult.dap_an_dung,
		};

		// <<< BƯỚC 3: Chuyển đổi thành chuỗi JSON hợp lệ
		const finalJsonString = JSON.stringify(finalResultObject);

		// <<< BƯỚC 4: Cập nhật giá trị cột result bằng chuỗi JSON mới
		const query = `UPDATE "User Infomation"."${sanitizeUsername(username)}" SET "result" = $1 WHERE "assignment_id" = $2`;
		await sql(query, [finalJsonString, assignmentID]); // <<< Sử dụng finalJsonString

		// Trả về phản hồi thành công
		return NextResponse.json({
			success: true,
			message: "Answers submitted successfully.",
		});
	} catch (error) {
		console.error("Error in /api/nopbai:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
