"use client";

import Image from "next/image";

interface RotationOverlayProps {
	isVisible: boolean;
}

export const RotationOverlay = ({ isVisible }: RotationOverlayProps) => {
	if (!isVisible) return null;

	return (
		<div className="inset-0 bg-black/50 backdrop-blur-md fixed z-50 flex flex-col items-center justify-center">
			<div className="flex flex-col items-center">
				<Image
					src="/tilt_screen.gif"
					alt="Xoay màn hình"
					width={200}
					height={200}
					priority
				/>
				<p className="text-white text-xl mt-4 font-medium">
					Xoay màn hình ngang để tiếp tục
				</p>
			</div>
		</div>
	);
};
