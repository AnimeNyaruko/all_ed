export default function sanitizeUsername(username: string): string {
	return username.replace(/[^a-zA-Z0-9_]/g, "_");
}
