"use client";

import { useState, useEffect } from "react";

export const useOrientationCheck = () => {
	const [isLandscape, setIsLandscape] = useState(true);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const checkOrientation = () => {
			setIsLandscape(window.innerWidth > window.innerHeight);
		};

		// Kiểm tra ngay khi component mount
		checkOrientation();

		// Thêm event listener để kiểm tra khi resize
		window.addEventListener("resize", checkOrientation);

		// Kiểm tra định kỳ mỗi 1 giây
		const interval = setInterval(checkOrientation, 1000);

		// Cleanup
		return () => {
			window.removeEventListener("resize", checkOrientation);
			clearInterval(interval);
		};
	}, []);

	return isLandscape;
};
