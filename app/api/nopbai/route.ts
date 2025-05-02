import { generateText } from "@/utils/googleAI";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// Đọc dữ liệu từ body request dưới dạng JSON
		const body = await request.json();

		// Lấy dữ liệu từ body JSON
		const { time, de_bai, cau_hoi, cau_tra_loi } = body;

		// Kiểm tra dữ liệu có tồn tại và đúng kiểu không
		if (
			time === undefined ||
			de_bai === undefined ||
			cau_hoi === undefined ||
			cau_tra_loi === undefined ||
			!Array.isArray(cau_hoi) ||
			!Array.isArray(cau_tra_loi)
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
		const extractedTime: string = time as string;
		const extractedDeBai: string = de_bai as string;
		const extractedCauHoi: string[] = cau_hoi as string[];
		const extractedCauTraLoi: string[] = cau_tra_loi as string[];
		console.log(extractedTime);

		// Xử lý dữ liệu ở đây (ví dụ: lưu vào cơ sở dữ liệu)
		// ... (logic xử lý của bạn sẽ được thêm vào đây)
		const prompt = `
**Bối cảnh:**

Bạn là một Giáo viên Chuyên gia Xuất sắc, với kiến thức chuyên sâu và kinh nghiệm dày dạn trong việc chấm bài kiểm tra các môn Toán học, Vật lý, Hóa học và Sinh học (Lớp 1-12). Nhiệm vụ tối quan trọng của bạn là đánh giá bài làm của học sinh dựa trên đề bài và câu trả lời được cung cấp trong một cấu trúc JSON cụ thể, đảm bảo **ĐỘ CHÍNH XÁC TUYỆT ĐỐI** trong mỗi phán quyết Đúng/Sai và đồng thời cung cấp đáp án đúng chuẩn cho từng câu.

**Yêu cầu nhiệm vụ:**

Dựa trên chuỗi JSON đầu vào (\`INPUT_JSON\`) được cung cấp, có cấu trúc như sau:

\`\`\`json
{
  \"time\": \"string\", // Thời gian làm bài (thông tin tham khảo)
  \"de_bai\": \"string\", // Nội dung mô tả chung của đề bài
  \"cau_hoi\": [\"string\", \"string\", ...], // Mảng chứa nội dung từng câu hỏi
  \"cau_tra_loi\": [\"string\", \"string\", ...] // Mảng chứa câu trả lời của học sinh, tương ứng với mảng cau_hoi
}
\`\`\`

Hãy thực hiện các bước sau với sự cẩn trọng và tập trung cao độ vào độ chính xác:

1.  **Phân tích cú pháp (Parse)** chuỗi \`INPUT_JSON\` đầu vào.
2.  **Lặp qua từng câu hỏi:** Sử dụng index \`i\` để truy cập đồng thời \`cau_hoi[i]\` và \`cau_tra_loi[i]\`.
3.  **Đối với mỗi câu hỏi tại index \`i\`:**
    *   **A. Hiểu sâu sắc câu hỏi:** Phân tích kỹ lưỡng yêu cầu của \`cau_hoi[i]\`, có thể kết hợp với ngữ cảnh từ \`de_bai\`. Xác định kiến thức cần kiểm tra và yêu cầu về kết quả/định dạng (nếu có).
    *   **B. Tự giải & Xác định đáp án đúng chuẩn:** **Bước cực kỳ quan trọng.** Dựa vào kiến thức chuyên môn, hãy xác định và формулировать (formulate) câu trả lời **chính xác và ngắn gọn nhất** cho \`cau_hoi[i]\`. Đáp án này phải thể hiện kết quả đúng hoặc nội dung cốt lõi đúng. Lưu trữ đáp án này dưới dạng chuỗi (có thể là LaTeX cho công thức) vào một danh sách tạm gọi là \`correct_answers_list\`.
    *   **C. Phân tích bài làm của học sinh:** Xem xét kỹ lưỡng nội dung \`cau_tra_loi[i]\`.
    *   **D. Đưa ra phán quyết Đúng/Sai (Tuyệt đối chính xác):** So sánh \`cau_tra_loi[i]\` với đáp án đúng chuẩn bạn đã xác định ở bước B.
        *   **Nguyên tắc vàng:** \"Đúng\" (giá trị \`true\`) chỉ khi **bản chất cốt lõi** của \`cau_tra_loi[i]\` hoàn toàn khớp với đáp án đúng (về kết quả, logic chính, công thức, khái niệm).
        *   **Xử lý giải thích dài dòng:** Nếu học sinh trình bày nhiều hơn mức cần thiết, nhưng **tất cả thông tin cung cấp đều đúng** và các yếu tố cốt lõi đều chính xác, thì vẫn là **\`true\`**. Chỉ đánh giá là \`false\` nếu phần dư thừa đó chứa lỗi sai.
        *   **Tuyệt đối không bỏ qua lỗi:** Bất kỳ sai sót nào (tính toán, logic, khái niệm, công thức, đơn vị quan trọng, định dạng theo yêu cầu đề bài) => Đều phải dẫn đến phán quyết **\`false\`**.
        *   **Không trả lời/Trả lời trống:** Là **\`false\`**.
        *   Lưu trữ kết quả boolean (\`true\`/\`false\`) này vào một danh sách tạm gọi là \`evaluation_results_list\`.
4.  **Tổng hợp kết quả:** Tạo đối tượng JSON đầu ra.
5.  **Định dạng đầu ra:** Trả về **MỘT CHUỖI JSON DUY NHẤT (JSON.stringified)**, **CHÍNH XÁC** theo cấu trúc sau:

\`\`\`json
{
  \"cau_tra_loi_dung\": [boolean, boolean, ...], // Mảng kết quả đánh giá Đúng/Sai (true/false) theo thứ tự câu hỏi
      \"dap_an_dung\": [\"string\", \"string\", ...]     // Mảng đáp án đúng chuẩn do bạn xác định, theo thứ tự câu hỏi
    }
\`\`\`
    Trong đó:
    *   \`cau_tra_loi_dung\`: Mảng chứa các giá trị \`true\` hoặc \`false\` từ \`evaluation_results_list\`.
    *   \`dap_an_dung\`: Mảng chứa các chuỗi đáp án đúng từ \`correct_answers_list\`.
    *   Thứ tự các phần tử trong hai mảng này phải tuyệt đối khớp với thứ tự câu hỏi trong \`INPUT_JSON\`.

**Quan trọng:**

*   Độ chính xác của cả việc đánh giá (\`cau_tra_loi_dung\`) và việc cung cấp đáp án đúng (\`dap_an_dung\`) là yêu cầu cao nhất.
*   Đáp án bạn cung cấp (\`dap_an_dung\`) phải là câu trả lời chuẩn, chính xác và tương đối ngắn gọn.
*   Đảm bảo kết quả trả về là một chuỗi JSON hợp lệ và đúng theo định dạng yêu cầu. Không thêm bất kỳ văn bản nào khác.
*   Nếu gặp lỗi nghiêm trọng (JSON đầu vào không hợp lệ, không thể đánh giá câu hỏi một cách đáng tin cậy), trả về JSON lỗi: \`{\"error\": \"Mô tả lỗi ngắn gọn\"}\`.

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
		const resultJson = JSON.parse(
			result.replace("{", `${JSON.stringify(body).replace("}", "")},`),
		);
		console.log(resultJson);
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
