import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/utils/googleAI";
import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";
export async function POST(request: NextRequest) {
	const { _class, subject, prompt, level, quantity, username, assignmentId } =
		await request.json();
	console.log(_class, subject, prompt, level);
	const fixedPrompt = _class.reduce(
		(prev: string, curr: string, index: number) => {
			return `${prev}Set ${index + 1}: Class: ${curr} - Subject: ${subject[index]} - Level: ${level[index]} - Prompt: ${prompt[index]}\n`;
		},
		"",
	);
	const systemInstruction = `**Thông tin đầu vào:**

1.  **Danh sách các Set yêu cầu kiến thức:**
    *   Bạn sẽ nhận được một khối văn bản chứa từ 1 đến 5 dòng, mỗi dòng đại diện cho một \"Set\" yêu cầu kiến thức.
    *   Mỗi dòng Set sẽ có định dạng **CHÍNH XÁC** như sau:
        \`\`\`
        Set [Số thứ tự]: Class: [Lớp] - Subject: [Môn học] - Level: [Mức độ 1-8] - Prompt: [Mô tả kiến thức cần ôn tập/ứng dụng]
        \`\`\`
    *   Trong đó:
        *   \`[Số thứ tự]\`: Là số thứ tự của Set (1, 2, 3...).
        *   \`[Lớp]\`: Lớp học (ví dụ: 9, 10, 11, 12).
        *   \`[Môn học]\`: Tên môn học (ví dụ: Toán, Lý, Hóa, Sinh).
        *   \`[Mức độ 1-8]\`: Mức độ phức tạp (1-2: Nhận biết, 3-4: Thông hiểu, 5-6: Vận dụng, 7-8: Vận dụng cao).
        *   \`[Mô tả kiến thức cần ôn tập/ứng dụng]\` (trong trường \`Prompt:\` của mỗi Set): Đây là phần mô tả **nội dung học thuật cụ thể** mà câu hỏi liên quan đến Set đó cần phải khai thác.
    *   **Ví dụ về khối văn bản đầu vào:**
        \`\`\`
        Set 1: Class: 10 - Subject: Hóa - Level: 4 - Prompt: Tính toán nồng độ mol của dung dịch sau khi pha loãng
        Set 2: Class: 10 - Subject: Toán - Level: 5 - Prompt: Phương trình đường thẳng trong mặt phẳng Oxy, tính khoảng cách từ điểm đến đường thẳng
        Set 3: Class: 10 - Subject: Vật Lý - Level: 6 - Prompt: Chuyển động ném ngang: tính thời gian rơi, tầm bay xa
        \`\`\`
    *   **Dữ liệu thực tế sẽ được thay thế vào placeholder sau (đây sẽ là một khối text nhiều dòng):**
        \`<danh_sach_sets_text>\`

2.  **Số lượng câu hỏi con tối đa:**
    *   Tổng số lượng câu hỏi con (a, b, c, ...) trong bài tập được tạo ra phải ngẫu nhiên nhưng **không được vượt quá** con số này.
    *   **Dữ liệu thực tế sẽ được thay thế vào placeholder sau:**
        \`<so_cau_hoi_toi_da>\`

**Yêu cầu đối với bài tập được tạo:**

1.  **Phân tích đầu vào:** Phân tích chính xác thông tin từ **TẤT CẢ** các dòng Set được cung cấp trong \`<danh_sach_sets_text>\`.
2.  **Tích hợp kiến thức:**
    *   Bài tập phải được thiết kế để **tích hợp một cách tự nhiên và logic** các kiến thức từ **TẤT CẢ** các \"set\" đã phân tích được.
    *   **Ưu tiên hàng đầu là đảm bảo kiến thức từ MỌI set đầu vào đều được tích hợp hoặc kiểm tra một cách có ý nghĩa** trong bài tập cuối cùng, ngay cả khi cần sử dụng đến số lượng câu hỏi con tối đa cho phép.
3.  **Cấu trúc:** Bài tập phải bao gồm MỘT phần đề bài chung (context) và một số câu hỏi con (a, b, c, ...).
4.  **Nội dung đề bài chung:**
    *   Phải xây dựng một tình huống/kịch bản thực tế, logic, mạch lạc và hấp dẫn thành một khối văn bản liền mạch.
    *   **TUYỆT ĐỐI KHÔNG sử dụng các tiêu đề phụ** như 'Tình huống:', 'Bối cảnh:', 'Dữ kiện:', 'Cho biết:', 'Quy ước:', 'Hệ trục tọa độ:' v.v. bên trong phần đề bài.
    *   Khi các Set có sự chênh lệch lớn về Lớp, hãy cố gắng xây dựng bối cảnh phù hợp với Lớp cao nhất, nhưng điều chỉnh độ phức tạp của từng câu hỏi con để tương ứng chính xác với Lớp và Mức độ (Level) của Set mà câu hỏi đó kiểm tra.
    *   Tình huống này phải tạo ra mối liên kết, là cơ sở để đặt ra các câu hỏi con liên quan đến kiến thức từ các set khác nhau. Cố gắng tạo ra các kịch bản có tính liên môn rõ rệt nếu có thể.
    *   Các thông tin bổ sung, dữ kiện, quy ước, hằng số cần thiết (ví dụ: gia tốc trọng trường g, hằng số Avogadro Nᴀ, khối lượng mol, v.v.) phải được tích hợp một cách tự nhiên vào mô tả tình huống hoặc được liệt kê rõ ràng ở cuối phần đề bài mà **không cần tiêu đề**. Ví dụ: \"Coi g = 9.8 m/s². Cho Nᴀ = 6.022 x 10²³ mol⁻¹. Khối lượng mol của H₂O là 18 g/mol.\"
5.  **Nội dung câu hỏi con (a, b, c, ...):**
    *   Các câu hỏi phải khai thác kiến thức và kỹ năng được mô tả trong phần \`Prompt:\` của các set khác nhau.
    *   **Định dạng câu hỏi và câu trả lời mong đợi:** Tất cả các câu hỏi con phải được thiết kế sao cho câu trả lời có thể được diễn đạt hoàn toàn bằng **văn bản (text) và/hoặc công thức toán học/hóa học dạng LaTeX**. **TUYỆT ĐỐI KHÔNG** tạo ra các câu hỏi yêu cầu:
        *   Vẽ hình, dựng hình, vẽ đồ thị.
        *   Kẻ bảng biểu.
        *   Các dạng bài tập trắc nghiệm yêu cầu nối, khoanh tròn trên hình, điền vào chỗ trống trên sơ đồ, hoặc các tương tác đồ họa khác.
        *   Các thao tác thực hành, thí nghiệm mô tả.
    *   Việc yêu cầu viết phương trình hóa học (dạng text hoặc LaTeX) là hoàn toàn **chấp nhận được**.
    *   **Yêu cầu về kết quả tính toán:** Đối với các câu hỏi yêu cầu tính toán ra kết quả bằng số:
        *   Phải **nêu rõ yêu cầu làm tròn** số thập phân nếu cần thiết (ví dụ: \"làm tròn đến hai chữ số thập phân\", \"lấy kết quả gần đúng đến hàng phần trăm\"). Nếu không có yêu cầu cụ thể, ngầm định là giữ độ chính xác hợp lý hoặc theo quy tắc làm tròn thông thường của môn học.
        *   Phải có **ghi chú nhắc nhở ghi kèm đơn vị** cho kết quả (ví dụ: \"(ghi rõ đơn vị)\", \"(kết quả kèm theo đơn vị)\").
    *   Mỗi câu hỏi phải có độ khó tương ứng với \`Level:\` của set mà nó kiểm tra.
    *   Số lượng câu hỏi con được tạo ra phải ngẫu nhiên, nhưng **không được vượt quá** \`<so_cau_hoi_toi_da>\`.
    *   Tổng thể các câu hỏi con phải **đảm bảo bao quát được** các nội dung chính trong phần \`Prompt:\` của **tất cả các set** đã cung cấp.
    *   **QUAN TRỌNG:** Các câu hỏi con (a, b, c,...) phải được **sắp xếp theo thứ tự độ khó tăng dần**, dựa trên mức độ phức tạp (\`Level\`) của Set tương ứng và bản chất nội dung câu hỏi.
    *   Mỗi câu hỏi con chỉ chứa nội dung câu hỏi, bắt đầu bằng ký tự tương ứng (ví dụ: \"a) \", \"b) \", \"c) \"). **Tuyệt đối không** thêm bất kỳ thông tin nào khác như tên môn học hay mức độ vào trong câu hỏi con (KHÔNG VIẾT: \"a) (Toán - Vận dụng) Tính...\", CHỈ VIẾT: \"a) Tính...\").
    *   Các câu hỏi con **chỉ bao gồm nội dung câu hỏi**, tuyệt đối không kèm theo bất kỳ gợi ý, lời giải, đáp án hay hướng dẫn giải nào.
6.  **Định dạng đầu ra:**
    *   Chỉ trả về **DUY NHẤT** một chuỗi JSON hợp lệ đã được \`JSON.stringify()\`.
    *   Chuỗi JSON này biểu diễn một object duy nhất.
    *   Object JSON phải có cấu trúc như sau:
        *   Key \`\"de_bai\"\`: Value là một string chứa toàn bộ phần đề bài chung (đã loại bỏ tiêu đề phụ), được định dạng bằng Markdown.
        *   Các keys tiếp theo là \`\"cau_a\"\`, \`\"cau_b\"\`, \`\"cau_c\"\`, ... tương ứng với mỗi câu hỏi con được tạo ra và đã được sắp xếp theo độ khó.
        *   Value của mỗi key \`\"cau_a\"\`, \`\"cau_b\"\`, ... là một string chứa nội dung câu hỏi con tương ứng (bắt đầu bằng \"a) \", \"b) \", ...), có bao gồm yêu cầu về làm tròn và đơn vị nếu là câu hỏi tính toán, được định dạng bằng Markdown.
    *   Ví dụ cấu trúc JSON mong muốn (chỉ là ví dụ cấu trúc):
        \`\`\`json
        {
          \"de_bai\": \"Một quả bóng được đá từ mặt đất lên với vận tốc ban đầu 20 m/s theo phương hợp với phương ngang một góc 30°. Đồng thời, một dung dịch X được chuẩn bị bằng cách hòa tan 5.85 gam NaCl vào nước để tạo thành 500 ml dung dịch. Chọn hệ trục tọa độ Oxy với gốc O tại vị trí đá bóng, Ox hướng ngang, Oy thẳng đứng hướng lên. Bỏ qua sức cản của không khí.\\nCoi gia tốc trọng trường g = 9.8 m/s². Cho khối lượng mol của Na = 23 g/mol, Cl = 35.5 g/mol.\",
          \"cau_a\": \"a) Tính nồng độ mol của dung dịch X thu được. (ghi rõ đơn vị)\",
          \"cau_b\": \"b) Viết phương trình chuyển động và phương trình quỹ đạo của quả bóng. (làm tròn các hệ số đến hai chữ số thập phân nếu cần)\",
          \"cau_c\": \"c) Xác định độ cao cực đại mà quả bóng đạt được. (làm tròn kết quả đến hàng phần trăm, ghi rõ đơn vị)\",
          \"cau_d\": \"d) Tính tầm bay xa của quả bóng (khoảng cách từ vị trí đá đến vị trí bóng chạm đất). (làm tròn kết quả đến hai chữ số thập phân, ghi rõ đơn vị)\"
        }
        \`\`\`
7.  **Ngôn ngữ:** Tiếng Việt.

**QUAN TRỌNG:** Chỉ trả về **DUY NHẤT** chuỗi JSON đã được \`JSON.stringify()\`. **KHÔNG** được có bất kỳ văn bản giới thiệu nào (ví dụ: \"Đây là JSON bạn yêu cầu:\"), văn bản kết luận nào, hoặc dấu \`\`\`json \`\`\` bao quanh chuỗi JSON. Toàn bộ phản hồi của bạn phải là chuỗi JSON đó và chỉ có nó. Đảm bảo chuỗi JSON trả về là hợp lệ.

---

**DỮ LIỆU ĐẦU VÀO THỰC TẾ:**

**Danh sách Sets (Định dạng Text):**
\`${fixedPrompt}\`

**Số câu hỏi tối đa:**
\`${quantity}\`

`;
	const result = await generateText(systemInstruction);
	console.log(result);
	const sanitizedUsername = sanitizeUsername(username);
	const query = `UPDATE "User Infomation"."${sanitizedUsername}" SET "task" = $1 WHERE "assignment_id" = $2`;
	await sql(query, [result!.split("json")[1].split("```")[0], assignmentId]);

	return NextResponse.json(true);
}
