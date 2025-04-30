"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faClockRotateLeft,
	faCircleXmark,
	faPlus,
	faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Header from "@/ui/Components/Header";
import Footer from "@/ui/Components/Footer";
import { handler } from "./(data_handler)/handler";

interface CardData {
	id: number;
	subject: string;
	grade: string;
	description: string;
	color: string;
	level: number;
}

const cardColors = [
	"from-blue-50 to-blue-100",
	"from-green-50 to-green-100",
	"from-purple-50 to-purple-100",
	"from-pink-50 to-pink-100",
	"from-yellow-50 to-yellow-100",
];

export default function Page() {
	const [cards, setCards] = useState<CardData[]>([
		{
			id: 1,
			subject: "",
			grade: "",
			description: "",
			color: cardColors[0],
			level: 1,
		},
	]);
	const [isDraggingSlider, setIsDraggingSlider] = useState(false);
	const [quantity, setQuantity] = useState(1);

	// Đảm bảo isDraggingSlider được reset khi người dùng thả chuột hoặc ngón tay bất cứ đâu
	useEffect(() => {
		const handleGlobalMouseUp = () => setIsDraggingSlider(false);
		const handleGlobalTouchEnd = () => setIsDraggingSlider(false);

		window.addEventListener("mouseup", handleGlobalMouseUp);
		window.addEventListener("touchend", handleGlobalTouchEnd);

		return () => {
			window.removeEventListener("mouseup", handleGlobalMouseUp);
			window.removeEventListener("touchend", handleGlobalTouchEnd);
		};
	}, []);

	const handleDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		index: number,
	) => {
		if (isDraggingSlider) {
			e.preventDefault();
			return;
		}
		e.dataTransfer.setData("text/plain", index.toString());
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleDrop = (
		e: React.DragEvent<HTMLDivElement>,
		dropIndex: number,
	) => {
		e.preventDefault();
		const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

		if (dragIndex === dropIndex) return;

		const newCards = [...cards];
		const [draggedCard] = newCards.splice(dragIndex, 1);
		newCards.splice(dropIndex, 0, draggedCard);

		setCards(newCards);
	};

	const addCard = () => {
		if (cards.length < 5) {
			const usedColors = cards.map((card) => card.color);
			const availableColors = cardColors.filter(
				(color) => !usedColors.includes(color),
			);
			const randomColor =
				availableColors[Math.floor(Math.random() * availableColors.length)];

			setCards([
				...cards,
				{
					id: Date.now(),
					subject: "",
					grade: "",
					description: "",
					color: randomColor,
					level: 1,
				},
			]);
		}
	};

	const removeCard = (id: number) => {
		if (cards.length > 1) {
			setCards(cards.filter((card) => card.id !== id));
		}
	};

	const copyPreviousData = (currentIndex: number) => {
		if (currentIndex > 0) {
			const newCards = [...cards];
			const previousCard = cards[currentIndex - 1];
			newCards[currentIndex] = {
				...newCards[currentIndex],
				subject: previousCard.subject,
				grade: previousCard.grade,
				description: previousCard.description,
				level: previousCard.level,
			};
			setCards(newCards);
		}
	};

	const updateCard = (
		id: number,
		field: keyof CardData,
		value: string | number,
	) => {
		setCards(
			cards.map((card) =>
				card.id === id ? { ...card, [field]: value } : card,
			),
		);
	};

	const [isLoading, setIsLoading] = useState(false);

	return (
		<>
			<Header />
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					setIsLoading(true);
					const result = await handler(formData);
					if (result) {
						setIsLoading(false);
					}
				}}
				className="from-gray-50 to-white min-h-screen bg-gradient-to-b"
			>
				{/* Form Section */}
				<section className="pt-32 pb-16 px-6">
					<div className="container mx-auto">
						{cards.map((card, index) => (
							<div
								key={card.id}
								className={`mb-8 p-6 rounded-lg shadow-lg bg-gradient-to-br ${card.color} border-blue-200 relative ${!isDraggingSlider ? "cursor-move" : "cursor-default"} border`}
								draggable={!isDraggingSlider}
								onDragStart={(e) => handleDragStart(e, index)}
								onDragOver={handleDragOver}
								onDrop={(e) => handleDrop(e, index)}
							>
								{/* Delete Button và Recent Button - Chỉ hiện khi có từ 2 thẻ trở lên */}
								{cards.length > 1 && (
									<div className="-top-3 -right-3 gap-2 absolute z-10 flex">
										{index > 0 && (
											<button
												type="button"
												onClick={() => copyPreviousData(index)}
												className="text-gray-500 hover:text-blue-600 transition-colors"
											>
												<FontAwesomeIcon
													icon={faClockRotateLeft}
													className="text-2xl"
												/>
											</button>
										)}
										<button
											type="button"
											onClick={() => removeCard(card.id)}
											className="text-gray-500 hover:text-red-500 transition-colors"
										>
											<FontAwesomeIcon
												icon={faCircleXmark}
												className="text-2xl"
											/>
										</button>
									</div>
								)}

								<div className="md:grid-cols-2 gap-4 mb-4 grid grid-cols-1">
									<select
										autoFocus
										required
										className="p-2 border-blue-300 rounded-md bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500 w-full border focus:ring-2"
										name="subject"
										value={card.subject}
										onChange={(e) =>
											updateCard(card.id, "subject", e.target.value)
										}
									>
										<option value="" className="text-gray-500">
											Chọn môn học
										</option>
										<option value="Toán học" className="text-gray-800">
											Toán học
										</option>
										<option value="Vật lí" className="text-gray-800">
											Vật lí
										</option>
										<option value="Hóa học" className="text-gray-800">
											Hóa học
										</option>
										<option value="Sinh học" className="text-gray-800">
											Sinh học
										</option>
									</select>

									<div className="relative">
										<select
											required
											className="p-2 border-blue-300 rounded-md bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500 w-full border focus:ring-2"
											name="class"
											value={card.grade}
											onChange={(e) =>
												updateCard(card.id, "grade", e.target.value)
											}
										>
											<option value="" className="text-gray-500">
												Chọn lớp
											</option>
											{[...Array(12)].map((_, i) => (
												<option
													key={i + 1}
													value={i + 1}
													className="text-gray-800"
												>
													{i + 1}
												</option>
											))}
										</select>
									</div>
								</div>

								<textarea
									required
									className="p-3 border-blue-300 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 w-full border focus:ring-2"
									rows={4}
									name="prompt"
									value={card.description}
									onChange={(e) =>
										updateCard(card.id, "description", e.target.value)
									}
									placeholder="Điền yêu cầu/chủ đề/kiến thức cần vận dụng..."
								/>

								{/* Thanh kéo thả mức độ - Thiết kế mới */}
								<div className="mt-3 p-2 bg-white rounded-lg border-blue-200 shadow-sm border">
									<div className="mb-1 flex items-center justify-between">
										<div className="flex items-center">
											<span className="text-sm font-medium text-gray-700 mr-2">
												Mức độ:
											</span>
											<span className="text-sm font-medium text-blue-600">
												{card.level === 1 || card.level === 2
													? "Nhận biết"
													: card.level === 3 || card.level === 4
														? "Thông hiểu"
														: card.level === 5 || card.level === 6
															? "Vận dụng"
															: "Vận dụng cao"}
											</span>
										</div>
										<span className="text-sm font-medium text-gray-700">
											{card.level}/8
										</span>
									</div>

									<div className="relative">
										{/* Thanh kéo thả với 8 mức */}
										<input
											type="range"
											min="1"
											max="8"
											step="1"
											value={card.level}
											onChange={(e) =>
												updateCard(card.id, "level", parseInt(e.target.value))
											}
											onMouseDown={(e) => {
												e.stopPropagation();
												setIsDraggingSlider(true);
											}}
											onTouchStart={(e) => {
												e.stopPropagation();
												setIsDraggingSlider(true);
											}}
											onMouseUp={() => setIsDraggingSlider(false)}
											onTouchEnd={() => setIsDraggingSlider(false)}
											onMouseLeave={() => setIsDraggingSlider(false)}
											className="h-1.5 bg-gray-200 rounded-lg accent-blue-500 w-full cursor-pointer appearance-none"
											name="level"
											style={{
												backgroundImage: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(card.level - 1) * 14.28}%, #e5e7eb ${(card.level - 1) * 14.28}%, #e5e7eb 100%)`,
											}}
										/>

										{/* Điểm đánh dấu 8 mức và số tương ứng */}
										<div className="mt-0.5 flex justify-between">
											{[1, 2, 3, 4, 5, 6, 7, 8].map((mark) => (
												<div key={mark} className="flex flex-col items-center">
													<div
														className={`w-1 h-2 rounded-full ${card.level >= mark ? "bg-blue-500" : "bg-gray-300"}`}
													></div>
													<span className="text-xs text-gray-500 mt-0.5">
														{mark}
													</span>
												</div>
											))}
										</div>
									</div>

									{/* Chú thích các mức độ */}
									<div className="mt-1 text-xs text-gray-500 flex justify-between">
										<div className="flex w-1/4 flex-col items-center">
											<span className="text-center">Nhận biết</span>
										</div>
										<div className="flex w-1/4 flex-col items-center">
											<span className="text-center">Thông hiểu</span>
										</div>
										<div className="flex w-1/4 flex-col items-center">
											<span className="text-center">Vận dụng</span>
										</div>
										<div className="flex w-1/4 flex-col items-center">
											<span className="text-center">Vận dụng cao</span>
										</div>
									</div>
								</div>
							</div>
						))}

						{/* Quantity Slider */}
						<div className="my-5 p-2 bg-white rounded-lg border-blue-200 shadow-sm w-full border">
							<div className="mb-1 flex items-center justify-between">
								<div className="flex items-center">
									<span className="text-sm font-medium text-gray-700 mr-2">
										Số lượng bài tập tối đa:
									</span>
									<span className="text-sm font-medium text-blue-600">
										{quantity}
									</span>
								</div>
								<span className="text-sm font-medium text-gray-700">
									{quantity}/8
								</span>
							</div>

							<div className="relative">
								<input
									type="range"
									min="1"
									max="8"
									step="1"
									value={quantity}
									name="quantity"
									onChange={(e) => setQuantity(parseInt(e.target.value))}
									onMouseDown={(e) => {
										e.stopPropagation();
										setIsDraggingSlider(true);
									}}
									onTouchStart={(e) => {
										e.stopPropagation();
										setIsDraggingSlider(true);
									}}
									onMouseUp={() => setIsDraggingSlider(false)}
									onTouchEnd={() => setIsDraggingSlider(false)}
									onMouseLeave={() => setIsDraggingSlider(false)}
									className="h-1.5 bg-gray-200 rounded-lg accent-blue-500 w-full cursor-pointer appearance-none"
									style={{
										backgroundImage: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(quantity - 1) * 14.28}%, #e5e7eb ${(quantity - 1) * 14.28}%, #e5e7eb 100%)`,
									}}
								/>

								<div className="mt-0.5 flex justify-between">
									{[1, 2, 3, 4, 5, 6, 7, 8].map((mark) => (
										<div key={mark} className="flex flex-col items-center">
											<div
												className={`w-1 h-2 rounded-full ${quantity >= mark ? "bg-blue-500" : "bg-gray-300"}`}
											></div>
											<span className="text-xs text-gray-500 mt-0.5">
												{mark}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Add Card Button - Chỉ hiện khi chưa đủ 5 thẻ */}
						{cards.length < 5 && (
							<button
								onClick={addCard}
								type="button"
								className="p-4 border-blue-300 rounded-lg text-blue-500 hover:border-blue-500 hover:text-blue-600 gap-2 flex w-full items-center justify-center border-2 border-dashed transition-colors"
							>
								<FontAwesomeIcon icon={faPlus} className="h-6 w-6" />
								<span>Thêm thẻ mới</span>
							</button>
						)}

						{/* Submit Button */}
						<div className="mt-8 text-center">
							<button
								type="submit"
								className="from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 text-xl font-medium shadow-lg transform bg-gradient-to-r transition-colors hover:scale-105"
							>
								{isLoading ? (
									<FontAwesomeIcon icon={faSpinner} className="h-6 w-6" />
								) : (
									"Gửi yêu cầu"
								)}
							</button>
						</div>
					</div>
				</section>
			</form>
			<Footer />
		</>
	);
}
