"use client";
import { useState } from "react";
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
import { redirect } from "next/navigation";
interface CardData {
	id: number;
	subject: string;
	grade: string;
	description: string;
	color: string;
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
		},
	]);

	const handleDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		index: number,
	) => {
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
			};
			setCards(newCards);
		}
	};

	const updateCard = (id: number, field: keyof CardData, value: string) => {
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
					console.log(result);
					if (!result) {
						redirect(`/lambai`);
					}
					setIsLoading(false);
				}}
				className="from-gray-50 to-white min-h-screen bg-gradient-to-b"
			>
				{/* Form Section */}
				<section className="pt-32 pb-16 px-6">
					<div className="container mx-auto">
						{cards.map((card, index) => (
							<div
								key={card.id}
								className={`mb-8 p-6 rounded-lg shadow-lg bg-gradient-to-br ${card.color} border-blue-200 relative cursor-move border`}
								draggable
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
									placeholder="Mô tả chi tiết kiến thức bạn muốn học..."
								/>
							</div>
						))}

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
