"use client";
import Image from "next/image";
import Header from "@/ui/Components/Header";
import Footer from "@/ui/Components/Footer";
import Link from "next/link";

export default function Home() {
	const scrollToFooter = (e: React.MouseEvent) => {
		e.preventDefault();
		const footer = document.getElementById("features");
		if (!footer) return;

		const duration = 800; // Thời gian cuộn: 800ms (0.8s)
		const startPosition = window.pageYOffset;
		const targetPosition =
			footer.getBoundingClientRect().top + window.pageYOffset;
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
			if (t < 1) return (c / 2) * t * t + b;
			t--;
			return (-c / 2) * (t * (t - 2) - 1) + b;
		}

		requestAnimationFrame(animation);
	};

	return (
		<>
			<Header />
			<main className="from-gray-50 to-white min-h-screen bg-gradient-to-b">
				{/* Updated Hero Section */}
				<section className="px-6 pt-20 pb-16 from-indigo-50 via-white to-cyan-50 flex min-h-screen items-center justify-center bg-gradient-to-br">
					{" "}
					{/* Example background gradient */}
					<div className="container mx-auto text-center">
						{/* Placeholder for visual element (GIF/video/illustration) */}
						{/* <div className="mb-8 h-40 w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">Visual Element Placeholder</div> */}

						<h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
							The AllEd:{" "}
							<span className="text-indigo-600">
								Bứt Phá Học Tập Liên Môn Cùng AI
							</span>
						</h1>
						<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
							Tạo và luyện tập không giới hạn bài tập tích hợp liên môn theo
							chuẩn chương trình mới. Cá nhân hóa lộ trình học của bạn ngay!
						</p>
						<div className="sm:flex-row gap-4 flex flex-col justify-center">
							<Link
								href="/taobai"
								className="bg-indigo-600 text-white px-10 py-4 rounded-lg hover:bg-indigo-700 text-lg font-semibold shadow-md hover:shadow-xl flex items-center justify-center transition-colors" // Slightly larger, bolder primary button, added flex alignment and hover:shadow-xl
							>
								Tạo Bài Tập Ngay!
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="w-6 h-6 ml-2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M13.5 4.5 21 12m0 0L13.5 19.5M21 12H3"
									/>
								</svg>
							</Link>
							<Link
								onClick={scrollToFooter}
								href="#features" // Updated link to scroll to Features section
								scroll={true}
								className="border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 text-lg font-medium border-2 transition-colors"
							>
								Xem Nhanh Tính Năng
							</Link>
						</div>
					</div>
				</section>

				{/* Updated "Why The AllEd?" Section */}
				<section className="py-20 px-6 bg-gray-50">
					{" "}
					{/* Increased py */}
					<div className="container mx-auto">
						<h2 className="text-3xl font-bold text-gray-800 mb-16 text-center">
							{" "}
							{/* Increased mb */}
							Giải pháp Học Liên Môn Thời Đại Mới {/* Updated H2 */}
						</h2>
						{/* Updated to 4 columns */}
						<div className="lg:grid-cols-4 md:grid-cols-2 gap-8 grid grid-cols-1">
							{/* Card 1: AI */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">🧠</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">
									Bài Tập AI Thông Minh
								</h3>
								<p className="text-gray-600">
									Tự động tạo đề liên môn theo yêu cầu, bám sát chương trình.
								</p>
							</div>
							{/* Card 2: Personalization */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">🎯</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">
									Cá Nhân Hóa Lộ Trình
								</h3>
								<p className="text-gray-600">
									Dễ dàng chọn môn, chủ đề, độ khó phù hợp năng lực.
								</p>
							</div>
							{/* Card 3: Editor */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">✍️</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">
									Soạn Thảo Trực Quan
								</h3>
								<p className="text-gray-600">
									Nhập công thức Toán-Lý-Hóa dễ dàng, tiện lợi.
								</p>
							</div>
							{/* Card 4: Community */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">🤝</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">
									Cộng Đồng Sôi Động
								</h3>
								<p className="text-gray-600">
									Kết nối với cộng đồng và chia sẻ kinh nghiệm học tập.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* How It Works Section */}
				<section className="py-20 px-6">
					{" "}
					{/* Increased py */}
					<div className="container mx-auto text-center">
						<h2 className="text-3xl font-bold text-gray-800 mb-16">
							{" "}
							{/* Increased mb */}
							Học Cùng The AllEd Chỉ Trong 3 Bước
						</h2>
						{/* Updated Timeline Layout */}
						<div className="md:px-10 relative">
							{" "}
							{/* Add relative positioning and padding for line */}
							{/* Connecting Line (visible on md screens and up) */}
							<div
								className="md:block top-8 left-0 right-0 h-0.5 bg-indigo-300 max-w-xl lg:max-w-2xl absolute mx-auto hidden w-full" /* Changed bg-indigo-200 to bg-indigo-300 */
								style={{ left: "50%", transform: "translateX(-50%)" }} // Center the line
							></div>
							<div className="md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-8 max-w-4xl mx-auto flex flex-col items-start justify-between">
								{/* Step 1 */}
								<div className="md:w-1/3 relative flex flex-col items-center text-center">
									<div className="bg-indigo-600 text-white h-18 w-18 text-2xl font-bold mb-4 border-white shadow-md z-10 flex items-center justify-center rounded-full border-4">
										{" "}
										{/* Increased size h-16 w-16 to h-18 w-18 (adjust if needed) */}
										1
									</div>
									<h3 className="text-xl font-semibold mb-2">Yêu Cầu</h3>
									<p className="text-gray-600">
										Chọn môn, lớp, độ khó bạn muốn.
									</p>
								</div>
								{/* Step 2 */}
								<div className="md:w-1/3 relative flex flex-col items-center text-center">
									<div className="bg-indigo-600 text-white h-18 w-18 text-2xl font-bold mb-4 border-white shadow-md z-10 flex items-center justify-center rounded-full border-4">
										{" "}
										{/* Increased size */}2
									</div>
									<h3 className="text-xl font-semibold mb-2">AI Tạo Đề</h3>
									<p className="text-gray-600">
										Chờ vài giây để AI tạo bài tập riêng cho bạn.
									</p>
								</div>
								{/* Step 3 */}
								<div className="md:w-1/3 relative flex flex-col items-center text-center">
									<div className="bg-indigo-600 text-white h-18 w-18 text-2xl font-bold mb-4 border-white shadow-md z-10 flex items-center justify-center rounded-full border-4">
										{" "}
										{/* Increased size */}3
									</div>
									<h3 className="text-xl font-semibold mb-2">Luyện Tập</h3>
									<p className="text-gray-600">
										Làm bài trực tuyến & nhận kết quả ngay.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features Highlight Section */}
				<section id="features" className="py-20 px-6 bg-gray-50">
					{" "}
					{/* Increased py, Added id='features' */}
					<div className="container mx-auto">
						<h2 className="text-3xl font-bold text-gray-800 mb-16 text-center">
							{" "}
							{/* Increased mb */}
							Khám Phá Tính Năng Vượt Trội
						</h2>
						<div className="sm:grid-cols-2 lg:grid-cols-3 gap-8 grid grid-cols-1">
							{/* Feature Card 1 */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col items-center border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">💡</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">
									Tạo Đề Liên Môn AI
								</h3>
							</div>
							{/* Feature Card 2 */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col items-center border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">📊</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">Tùy Chỉnh Độ Khó</h3>
							</div>
							{/* Feature Card 3 */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col items-center border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">📐</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">
									Trình Soạn Thảo Toán Học
								</h3>
							</div>
							{/* Feature Card 4 */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col items-center border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">✅</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">
									Chấm Điểm Tức Thì
								</h3>
							</div>
							{/* Feature Card 5 */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col items-center border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">📚</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">
									Chuẩn Chương Trình Mới
								</h3>
							</div>
							{/* Feature Card 6 */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col items-center border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">🔒</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">Bảo Mật An Toàn</h3>
							</div>
							{/* Feature Card 7 */}
							<div className="bg-white p-6 rounded-xl shadow-sm border-gray-100 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col items-center border text-center transition duration-300">
								{" "}
								{/* Added border, rounded-xl, hover effects */}
								<div className="text-indigo-600 text-4xl mb-4">🔄</div>{" "}
								{/* Placeholder Icon */}
								<h3 className="text-xl font-semibold mb-2">
									Làm Lại Bài Tập Dễ Dàng
								</h3>
							</div>
						</div>
					</div>
				</section>

				{/* Updated Final CTA Section */}
				<section className="py-20 px-6">
					{" "}
					{/* Increased py */}
					<div className="container mx-auto text-center">
						<h2 className="text-3xl font-bold text-gray-800 mb-6">
							Sẵn sàng Nâng Tầm Học Tập? {/* Updated H2 */}
						</h2>
						<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
							Tham gia cộng đồng học sinh tiến bộ cùng The AllEd!{" "}
							{/* Updated sub-headline */}
						</p>
						{/* Updated Button */}
						<Link
							href="/dangnhap" // Placeholder link, update if needed
							className="bg-indigo-600 text-white px-10 py-4 rounded-lg hover:bg-indigo-700 text-xl font-semibold shadow-lg hover:shadow-xl inline-flex items-center justify-center transition-colors" // Larger, prominent button, added inline-flex alignment and hover:shadow-xl
						>
							Đăng Ký Miễn Phí Ngay!
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="w-6 h-6 ml-2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13.5 4.5 21 12m0 0L13.5 19.5M21 12H3"
								/>
							</svg>
						</Link>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
