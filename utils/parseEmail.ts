export function parseEmailtoUsername(email: string): string {
	let substring = 0;
	for (const i of email) {
		substring++;
		if (i === "@") {
			substring--;
			break;
		}
	}
	return email.slice(0, substring);
}
