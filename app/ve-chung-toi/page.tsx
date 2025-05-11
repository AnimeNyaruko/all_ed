"use client";
import Image from "next/image";
import Header from "@/ui/Components/Header";
import Footer from "@/ui/Components/Footer";
import Link from "next/link";
import SamPiDieu from "@/public/220307 - SẨM PÍ DIỆU.jpg";
import TruongQuocSang from "@/public/truongquocsang.jpg";
import AnhTeam from "@/public/anh_team.jpg";

export default function Home() {
	const scrollToFooter = (e: React.MouseEvent) => {
		e.preventDefault();
		const footer = document.getElementById('features');
		if (!footer) return;

		const duration = 800; // Thời gian cuộn: 800ms (0.8s)
		const startPosition = window.pageYOffset;
		const targetPosition = footer.getBoundingClientRect().top + window.pageYOffset;
		const distance = targetPosition - startPosition;
		let startTime: number | null = null;

		function animation(currentTime: number) {
			if (startTime === null) startTime = currentTime;
			const timeElapsed = currentTime - startTime;
			const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
			window.scrollTo(0, run);
			if (timeElapsed < duration) requestAnimationFrame(animation);
		}

		// Hàm easing để làm cho cuộn mượt mà hơn
		function easeInOutQuad(t: number, b: number, c: number, d: number) {
			t /= d / 2;
			if (t < 1) return c / 2 * t * t + b;
			t--;
			return -c / 2 * (t * (t - 2) - 1) + b;
		}

		requestAnimationFrame(animation);
	};

	return (
		<>
			<Header />
			<main className="min-h-screen">
				{/* (1) Hero Section */}
				<section className="px-6 py-24 md:py-32 lg:py-40 flex items-center justify-center text-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white">
					<div className="container mx-auto">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
							The AllEd: Phá Vỡ Rào Cản - Học Liên Môn Thông Minh Cho Gen Z
						</h1>
						<p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
							Mệt mỏi với việc học tủ từng môn? The AllEd ra đời từ chính trăn trở của học sinh cuối cấp, ứng dụng AI để tạo bài tập liên môn &quot;chuẩn không cần chỉnh&quot;, giúp bạn tự tin bứt phá trong kỳ thi THPT 2025 và xa hơn nữa!
						</p>
					</div>
				</section>

				{/* (2) Câu Chuyện Của Chúng Tôi */}
				<section className="py-16 md:py-20 px-6 bg-white">
					<div className="container mx-auto">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
							Từ Áp Lực Cuối Cấp Đến Giải Pháp Học Tập Đột Phá
						</h2>
						<div className="md:grid md:grid-cols-2 gap-12 items-center">
							{/* Cột hình ảnh/illustration */}
							<div className="mb-8 md:mb-0 flex justify-center">
								<div className="w-full max-w-md h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
									<Image src={AnhTeam} alt="Team" width={400} height={600} className="object-cover w-full h-full" />
								</div>
							</div>
							{/* Cột nội dung */}
							<div className="text-gray-700 text-base md:text-lg space-y-4">
								<p>
									Chào bạn, chúng mình là <strong>Sẩm Pí Diệu</strong> và <strong>Trương Quốc Sang</strong> - hai học sinh cuối cấp tại TP. Hồ Chí Minh, cũng đang &quot;vật lộn&quot; với lượng kiến thức khổng lồ và áp lực thi cử như bao bạn khác. Nhận thấy Chương trình Giáo dục phổ thông 2018 và kỳ thi Tốt nghiệp THPT 2025 sắp tới đòi hỏi cách học liên môn, tích hợp kiến thức, tụi mình đã đối mặt với một thử thách lớn: tìm đâu ra nguồn bài tập chất lượng, đa dạng để ôn luyện hiệu quả khi thời gian thì có hạn?
								</p>
								<p>
									Hầu hết tài liệu trên mạng chỉ tập trung vào từng môn riêng lẻ, hoặc quá chuyên sâu, không phù hợp. Từ chính khó khăn đó, tụi mình đã mày mò, thử nghiệm ứng dụng Trí tuệ nhân tạo (AI) để tự tạo ra những bài tập liên môn theo ý muốn. Kết quả thật bất ngờ - điểm số cải thiện rõ rệt!
								</p>
								<p>
									Thấy được lợi ích thiết thực, tụi mình quyết định xây dựng The AllEd - một hệ thống hoàn chỉnh để không chỉ giúp bản thân mà còn chia sẻ giải pháp này đến tất cả các bạn học sinh khác. The AllEd ra đời với mong muốn biến việc học liên môn trở nên dễ dàng, thú vị và hiệu quả hơn bao giờ hết, đặc biệt là trong giai đoạn nước rút quan trọng này.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* (3) Giải Mã "Học Liên Môn" */}
				<section className="py-16 md:py-20 px-6 bg-gray-50">
					<div className="container mx-auto">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
							Học Liên Môn: &quot;Skill&quot; Không Thể Thiếu Của Thế Hệ Mới
						</h2>
						<p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
							Bạn có bao giờ tự hỏi kiến thức Toán, Lý, Hóa, Sinh liên quan đến nhau như thế nào trong đời sống thực tế không? <strong> Học liên môn (Interdisciplinary learning) </strong> chính là câu trả lời! Đó không phải là một khái niệm xa vời, mà đơn giản là phương pháp học kết hợp kiến thức, kỹ năng từ nhiều lĩnh vực khác nhau để giải quyết một vấn đề cụ thể. Thay vì học từng môn một cách cô lập, học liên môn giúp bạn:
						</p>
						{/* Lưới lợi ích */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{/* Lợi ích 1 */}
							<div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100 transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
								<div className="text-indigo-600 text-4xl mb-4">💡</div>
								<h3 className="text-xl font-semibold mb-2">Hiểu sâu bản chất</h3>
								<p className="text-gray-600">Nhìn thấy bức tranh toàn cảnh, kết nối các mảnh ghép kiến thức rời rạc.</p>
							</div>
							{/* Lợi ích 2 */}
							<div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100 transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
								<div className="text-indigo-600 text-4xl mb-4">🧠</div>
								<h3 className="text-xl font-semibold mb-2">Nhớ lâu hơn</h3>
								<p className="text-gray-600">Vận dụng kiến thức vào các tình huống thực tế đa dạng.</p>
							</div>
							{/* Lợi ích 3 */}
							<div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100 transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
								<div className="text-indigo-600 text-4xl mb-4">⚙️</div>
								<h3 className="text-xl font-semibold mb-2">Tư duy &quot;xịn&quot; hơn</h3>
								<p className="text-gray-600">Rèn luyện khả năng liên kết, phân tích và giải quyết các vấn đề phức tạp.</p>
							</div>
							{/* Lợi ích 4 */}
							<div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100 transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
								<div className="text-indigo-600 text-4xl mb-4">🎮</div>
								<h3 className="text-xl font-semibold mb-2">Học vui hơn</h3>
								<p className="text-gray-600">Khám phá sự thú vị khi thấy các môn học bổ trợ lẫn nhau và có ứng dụng rõ ràng.</p>
							</div>
						</div>
						<p className="text-center text-gray-600 text-base mt-10 max-w-4xl mx-auto">
							Đây chính là định hướng quan trọng của <strong> Chương trình GDPT 2018 </strong> và là chìa khóa giúp bạn chinh phục kỳ thi THPT theo cấu trúc mới, đồng thời trang bị những năng lực cần thiết cho tương lai trong thời đại 4.0, đặc biệt là theo định hướng STEM. The AllEd giúp bạn thực hành phương pháp học tập tiên tiến này một cách dễ dàng nhất.
						</p>
					</div>
				</section>

				{/* (4) Đội Ngũ Sáng Lập */}
				<section className="py-16 md:py-20 px-6 bg-white">
					<div className="container mx-auto">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
							Những &quot;Đồng Môn&quot; Đứng Sau The AllEd
						</h2>
						<p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
							The AllEd được xây dựng bởi chính những học sinh như bạn, thấu hiểu những gì bạn cần:
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
							{/* Card Sẩm Pí Diệu */}
							<div className="bg-gray-50 p-6 rounded-lg shadow-md text-center border border-gray-200 flex flex-col items-center transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
								<div className="w-40 h-60 rounded-lg bg-gray-300 mb-4 flex items-center justify-center text-gray-500 overflow-hidden">
									<Image src={SamPiDieu} alt="Sẩm Pí Diệu" width={400} height={600} className="object-cover w-full h-full" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-1">Sẩm Pí Diệu</h3>
								<p className="text-sm text-gray-500 italic mb-3">Học sinh lớp 12 Tin, Trường Phổ thông Năng khiếu, ĐHQG-HCM.</p>
								<blockquote className="text-gray-700 italic">
									&quot;Mình tin AI có thể là &apos;trợ thủ&apos; đắc lực, giúp mỗi người có lộ trình học tập cá nhân hóa và hiệu quả hơn.&quot;
								</blockquote>
							</div>
							{/* Card Trương Quốc Sang */}
							<div className="bg-gray-50 p-6 rounded-lg shadow-md text-center border border-gray-200 flex flex-col items-center transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
								<div className="w-40 h-60 rounded-lg bg-gray-300 mb-4 flex items-center justify-center text-gray-500 overflow-hidden">
									<Image src={TruongQuocSang} alt="Trương Quốc Sang" width={400} height={600} className="object-cover w-full h-full" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-1">Trương Quốc Sang</h3>
								<p className="text-sm text-gray-500 italic mb-3">Học sinh lớp 12A05, Trường THPT Trần Phú, Tân Phú.</p>
								<blockquote className="text-gray-700 italic">
									&quot;Ước mơ của mình là tạo ra một công cụ học tập thực sự &apos;chất&apos;, giúp các bạn cùng trang lứa giảm bớt áp lực và tìm thấy niềm vui học tập.&quot;
								</blockquote>
							</div>
						</div>
					</div>
				</section>

				{/* (5) Tầm Nhìn & Sứ Mệnh */}
				<section className="py-16 md:py-20 px-6 bg-indigo-50">
					<div className="container mx-auto text-center">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
							Khát Vọng Của The AllEd
						</h2>
						<div className="md:grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
							{/* Sứ mệnh */}
							<div className="mb-10 md:mb-0 bg-white p-8 rounded-lg shadow-lg border-t-4 border-indigo-600 text-center">
								<h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center justify-center">
									<span className="mr-2 text-3xl">🎯</span>
									<span>Sứ Mệnh</span>
								</h3>
								<p className="text-gray-700 text-lg font-medium">
									Cung cấp một nền tảng học tập liên môn ứng dụng AI thông minh, dễ tiếp cận và hiệu quả, giúp học sinh Việt Nam làm chủ kiến thức tích hợp, tự tin đối mặt với các kỳ thi và phát triển năng lực toàn diện theo chương trình mới.
								</p>
							</div>
							{/* Tầm nhìn */}
							<div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-indigo-600 text-center">
								<h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center justify-center">
									<span className="mr-2 text-3xl">🚀</span>
									<span>Tầm Nhìn</span>
								</h3>
								<p className="text-gray-700 text-lg font-medium">
									Trở thành người bạn đồng hành công nghệ đáng tin cậy, thúc đẩy tinh thần tự học và sáng tạo, góp phần nâng cao chất lượng giáo dục và chuẩn bị hành trang vững chắc cho thế hệ trẻ Việt Nam bước vào tương lai.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* (6) Lộ Trình Phát Triển */}
				<section className="py-16 md:py-20 px-6 bg-white">
					<div className="container mx-auto text-center">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
							Hành Trình Tiếp Theo Của The AllEd (Coming Soon!)
						</h2>
						<p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
							Tụi mình biết rằng The AllEd mới chỉ là bước khởi đầu. Với sự ủng hộ của các bạn, team sẽ không ngừng nỗ lực để hoàn thiện và mang đến nhiều tính năng giá trị hơn nữa trong tương lai gần:
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
							{/* Tính năng 1 */}
							<div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-start space-x-4 transition duration-300 ease-in-out hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
								<div className="text-green-500 text-3xl">✅</div>
								<div>
									<h3 className="text-lg font-semibold mb-1">Nâng cấp chấm điểm</h3>
									<p className="text-gray-600 text-sm">Gợi ý bước giải, chỉ lỗi sai chi tiết.</p>
								</div>
							</div>
							{/* Tính năng 2 */}
							<div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-start space-x-4 transition duration-300 ease-in-out hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
								<div className="text-blue-500 text-3xl">📝</div>
								<div>
									<h3 className="text-lg font-semibold mb-1">Đa dạng dạng bài</h3>
									<p className="text-gray-600 text-sm">Thêm trắc nghiệm, trả lời ngắn, Đúng/Sai...</p>
								</div>
							</div>
							{/* Tính năng 3 */}
							<div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-start space-x-4 transition duration-300 ease-in-out hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
								<div className="text-purple-500 text-3xl">➕</div>
								<div>
									<h3 className="text-lg font-semibold mb-1">Mở rộng môn học</h3>
									<p className="text-gray-600 text-sm">Tích hợp thêm kiến thức từ các môn khác.</p>
								</div>
							</div>
							{/* Tính năng 4 */}
							<div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-start space-x-4 transition duration-300 ease-in-out hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
								<div className="text-orange-500 text-3xl">💬</div>
								<div>
									<h3 className="text-lg font-semibold mb-1">Xây dựng cộng đồng</h3>
									<p className="text-gray-600 text-sm">Diễn đàn trao đổi, thảo luận, giúp đỡ nhau.</p>
								</div>
							</div>
							{/* Tính năng 5 */}
							<div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex items-start space-x-4 transition duration-300 ease-in-out hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
								<div className="text-yellow-500 text-3xl">✍️⬆️</div>
								<div>
									<h3 className="text-lg font-semibold mb-1">Nhập liệu linh hoạt</h3>
									<p className="text-gray-600 text-sm">Hỗ trợ vẽ hình, tải ảnh bài làm tay.</p>
								</div>
							</div>
						</div>
						<p className="text-center text-gray-700 text-lg mt-12">
							Hãy cùng chờ đón và <a href="#footer" className="text-indigo-600 hover:underline font-semibold">đóng góp ý kiến (Liên hệ)</a> để The AllEd ngày càng phát triển nhé!
						</p>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
