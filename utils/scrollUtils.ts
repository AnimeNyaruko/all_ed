export const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
	t /= d / 2;
	if (t < 1) return (c / 2) * t * t + b;
	t--;
	return (-c / 2) * (t * (t - 2) - 1) + b;
};

export const scrollToElementById = (
	elementId: string,
	duration: number = 800,
	offset: number = 0
): void => {
	if (typeof window === "undefined") return;

	const element = document.getElementById(elementId);
	if (!element) {
		console.warn(`[scrollToElementById] Element with id "${elementId}" not found.`);
		return;
	}

	const startPosition = window.scrollY || window.pageYOffset;
	// Calculate target position correctly, considering potential fixed header/navbar height via offset
	const targetPosition = element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - offset;
	const distance = targetPosition - startPosition;
	let startTime: number | null = null;

	const animation = (currentTime: number) => {
		if (startTime === null) startTime = currentTime;
		const timeElapsed = currentTime - startTime;
		const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
		window.scrollTo(0, run);
		if (timeElapsed < duration) {
			requestAnimationFrame(animation);
		}
	};

	requestAnimationFrame(animation);
}; 