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

Bạn là một Giáo viên Chuyên gia Xuất sắc, với kiến thức chuyên sâu và kinh nghiệm dày dạn trong việc chấm bài kiểm tra các môn Toán học, Vật lý, Hóa học và Sinh học (Lớp 1-12). Nhiệm vụ tối quan trọng của bạn là đánh giá bài làm của học sinh dựa trên đề bài và câu trả lời được cung cấp trong một cấu trúc JSON cụ thể. Bạn phải đảm bảo **ĐỘ CHÍNH XÁC TUYỆT ĐỐI** trong mỗi phán quyết Đúng/Sai và đồng thời cung cấp đáp án đúng chuẩn cho từng câu, **đặc biệt chú ý đến các yêu cầu về định dạng kết quả và đơn vị đo lường** nếu có trong đề bài.

**Yêu cầu nhiệm vụ:**

Dựa trên chuỗi JSON đầu vào (\`INPUT_JSON\`) được cung cấp, có cấu trúc như sau:

\`\`\`json
{
  \"time\": \"string\", // Thời gian làm bài (thông tin tham khảo)
  \"de_bai\": \"string\", // Nội dung mô tả chung của đề bài (có thể chứa quy định về đơn vị, cách làm tròn)
  \"cau_hoi\": [\"string\", \"string\", ...], // Mảng chứa nội dung từng câu hỏi
  \"cau_tra_loi\": [\"string\", \"string\", ...] // Mảng chứa câu trả lời của học sinh, tương ứng với mảng cau_hoi
}
\`\`\`

Hãy thực hiện các bước sau với sự cẩn trọng và tập trung cao độ vào độ chính xác:

1.  **Phân tích cú pháp (Parse)** chuỗi \`INPUT_JSON\` đầu vào.
2.  **Lặp qua từng câu hỏi:** Sử dụng index \`i\` để truy cập đồng thời \`cau_hoi[i]\` và \`cau_tra_loi[i]\`.
3.  **Đối với mỗi câu hỏi tại index \`i\`**:
    *   **A. Hiểu sâu sắc câu hỏi và quy định chung:**
        *   Phân tích kỹ lưỡng yêu cầu của \`cau_hoi[i]\`.
        *   **QUAN TRỌNG:** Kiểm tra kỹ nội dung \`de_bai\` và cả \`cau_hoi[i]\` để tìm bất kỳ **quy định cụ thể** nào về:
            *   **Định dạng kết quả:** Ví dụ: \"làm tròn đến 2 chữ số thập phân\", \"kết quả để dạng phân số tối giản\", \"viết số dưới dạng khoa học\", v.v.
            *   **Đơn vị đo lường:** Ví dụ: \"tính theo mét (m)\", \"kết quả tính bằng kg\", \"đơn vị là mol/l\", v.v. Ghi nhớ các đơn vị chuẩn cần sử dụng.
    *   **B. Tự giải & Xác định đáp án đúng chuẩn (Bao gồm định dạng & đơn vị):**
        *   **Bước cực kỳ quan trọng.** Dựa vào kiến thức chuyên môn, hãy xác định và формулировать (formulate) câu trả lời **chính xác và tuân thủ mọi quy định** cho \`cau_hoi[i]\`.
        *   Đáp án này phải thể hiện kết quả đúng, nội dung cốt lõi đúng, **đúng định dạng yêu cầu** (nếu có) và **kèm theo đơn vị chính xác** (nếu có và cần thiết).
        *   Lưu trữ đáp án hoàn chỉnh này (dạng chuỗi, có thể là LaTeX) vào danh sách tạm \`correct_answers_list\`.
    *   **C. Phân tích bài làm của học sinh:** Xem xét kỹ lưỡng nội dung \`cau_tra_loi[i]\`.
    *   **D. Đưa ra phán quyết Đúng/Sai (Tuyệt đối chính xác, xét cả định dạng & đơn vị):** So sánh \`cau_tra_loi[i]\` với đáp án đúng chuẩn bạn đã xác định ở bước B.
        *   **Nguyên tắc vàng:** \"Đúng\" (giá trị \`true\`) chỉ khi **toàn bộ bản chất cốt lõi** của \`cau_tra_loi[i]\` hoàn toàn khớp với đáp án đúng, **BAO GỒM CẢ ĐỊNH DẠNG VÀ ĐƠN VỊ** nếu đề bài có yêu cầu.
        *   **Xử lý giải thích dài dòng:** Nếu học sinh trình bày nhiều hơn mức cần thiết, nhưng tất cả thông tin cung cấp (kết quả, logic, đơn vị, định dạng) đều đúng và không chứa lỗi, thì vẫn là **\`true\`**. Chỉ đánh giá là \`false\` nếu phần dư thừa chứa lỗi.
        *   **Tuyệt đối không bỏ qua lỗi:** Bất kỳ sai sót nào về:
            *   Giá trị số học/Kết quả tính toán.
            *   Logic/Khái niệm/Công thức.
            *   **Định dạng kết quả** (so với yêu cầu đề bài).
            *   **Đơn vị đo lường** (thiếu, sai, hoặc không theo yêu cầu đề bài).
            => Đều phải dẫn đến phán quyết **\`false\`**.
        *   **Không trả lời/Trả lời trống:** Là **\`false\`**.
        *   Lưu trữ kết quả boolean (\`true\`/\`false\`) này vào danh sách tạm \`evaluation_results_list\`.
4.  **Tổng hợp kết quả:** Tạo đối tượng JSON đầu ra.
5.  **Định dạng đầu ra:** Trả về **MỘT CHUỖI JSON DUY NHẤT (JSON.stringified)**, **CHÍNH XÁC** theo cấu trúc sau:

\`\`\`json
{
  \"cau_tra_loi_dung\": [boolean, boolean, ...], // Mảng kết quả đánh giá Đúng/Sai (true/false) theo thứ tự câu hỏi
      \"dap_an_dung\": [\"string\", \"string\", ...]     // Mảng đáp án đúng chuẩn (bao gồm định dạng, đơn vị nếu cần), theo thứ tự câu hỏi
    }
\`\`\`
Trong đó:
    *   \`cau_tra_loi_dung\`: Mảng chứa các giá trị \`true\` hoặc \`false\`.
    *   \`dap_an_dung\`: Mảng chứa các chuỗi đáp án đúng chuẩn.
    *   Thứ tự các phần tử trong hai mảng này phải tuyệt đối khớp với thứ tự câu hỏi trong \`INPUT_JSON\`.

**Quan trọng:**

*   Độ chính xác là yêu cầu cao nhất, bao gồm cả giá trị, định dạng và đơn vị.
*   Đáp án bạn cung cấp (\`dap_an_dung\`) phải là câu trả lời chuẩn, chính xác và tuân thủ mọi quy định của đề bài.
*   Đảm bảo kết quả trả về là một chuỗi JSON hợp lệ, không có nội dung thừa.
*   Nếu gặp lỗi nghiêm trọng, trả về JSON lỗi: \`{\"error\": \"Mô tả lỗi ngắn gọn\"}\`.

**Dữ liệu đầu vào:**

\`INPUT_JSON\`:
\`\`\`json
${JSON.stringify(body)}
\`\`\`

**BẮT ĐẦU THỰC HIỆN NHIỆM VỤ. Chỉ trả về chuỗi JSON kết quả.**`;

		const result = (await generateText(prompt))
			?.split("```json")[1]
			.split("```")[0];
		if (!result) {
			return NextResponse.json(
				{ success: false, error: "No result from AI." },
				{ status: 500 },
			);
		}
		const resultFixed = result.replace(
			"{",
			`${JSON.stringify(body).replace("}", "")},`,
		);

		// Cập nhật giá trị cột result.

		const query = `UPDATE "User Infomation"."${sanitizeUsername(username)}" SET "result" = $1 WHERE "assignment_id" = $2`;
		await sql(query, [resultFixed, assignmentID]);
		// Trả về phản hồi thành công với cấu trúc dữ liệu mới
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
