"use client";
import Image from "next/image";
import Header from "@/ui/Components/Header";
import Footer from "@/ui/Components/Footer";

export default function Home() {
	return (
		<>
			<Header />
			<main className="from-gray-50 to-white min-h-screen bg-gradient-to-b">
				{/* Welcome Section */}
				<section className="px-6 pt-20 flex min-h-screen items-center justify-center">
					<div className="container mx-auto text-center">
						<h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
							Chào mừng đến với{" "}
							<span className="text-indigo-600">The AllEd</span>
						</h1>
						<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
							Nền tảng học trực tuyến hàng đầu, nơi kiến thức không có giới hạn
							và mọi người đều có cơ hội phát triển bản thân.
						</p>
						<div className="sm:flex-row gap-4 flex flex-col justify-center">
							<button className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 text-lg font-medium transition-colors">
								Bắt đầu học ngay
							</button>
							<button className="border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 text-lg font-medium border-2 transition-colors">
								Khám phá khóa học
							</button>
						</div>
					</div>
				</section>

				{/* Hero Section */}
				<section className="pt-32 pb-16 px-6">
					<div className="md:flex-row container mx-auto flex flex-col items-center justify-between">
						<div className="md:w-1/2 mb-8 md:mb-0">
							<h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
								Học tập không giới hạn với The AllEd
							</h1>
							<p className="text-lg text-gray-600 mb-8">
								Khám phá thế giới tri thức với nền tảng học trực tuyến hàng đầu.
								Học mọi lúc, mọi nơi với đội ngũ giảng viên chất lượng cao.
							</p>
							<button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
								Bắt đầu học ngay
							</button>
						</div>
						<div className="md:w-1/2">
							<div className="relative h-[400px] w-full">
								<Image
									src="/hero-image.jpg"
									alt="Học tập trực tuyến"
									fill
									className="rounded-lg object-cover"
									priority
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-16 px-6 bg-gray-50">
					<div className="container mx-auto">
						<h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
							Tại sao chọn The AllEd?
						</h2>
						<div className="md:grid-cols-3 gap-8 grid grid-cols-1">
							<div className="bg-white p-6 rounded-lg shadow-sm">
								<div className="text-indigo-600 text-2xl mb-4">🎓</div>
								<h3 className="text-xl font-semibold mb-2">
									Chương trình đa dạng
								</h3>
								<p className="text-gray-600">
									Hàng trăm khóa học chất lượng cao từ các chuyên gia hàng đầu
								</p>
							</div>
							<div className="bg-white p-6 rounded-lg shadow-sm">
								<div className="text-indigo-600 text-2xl mb-4">⏰</div>
								<h3 className="text-xl font-semibold mb-2">
									Học tập linh hoạt
								</h3>
								<p className="text-gray-600">
									Tự do học tập theo thời gian và tốc độ của riêng bạn
								</p>
							</div>
							<div className="bg-white p-6 rounded-lg shadow-sm">
								<div className="text-indigo-600 text-2xl mb-4">🤝</div>
								<h3 className="text-xl font-semibold mb-2">
									Cộng đồng sôi động
								</h3>
								<p className="text-gray-600">
									Kết nối với học viên khác và chia sẻ kinh nghiệm học tập
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-16 px-6">
					<div className="container mx-auto text-center">
						<h2 className="text-3xl font-bold text-gray-800 mb-6">
							Sẵn sàng bắt đầu hành trình học tập của bạn?
						</h2>
						<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
							Tham gia cộng đồng học tập của chúng tôi ngay hôm nay và mở khóa
							tiềm năng của bạn
						</p>
						<button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
							Đăng ký miễn phí
						</button>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
