export default async function setCookie(
	name: string,
	data: string,
	option: any,
) {
	const formData = new FormData();
	formData.append("username", name);
	formData.append("data", data);
	formData.append("option", JSON.stringify(option));
	await fetch(`${process.env.NEXTAUTH_URL!}/api/cookie`, {
		body: formData,
		method: "POST",
	});
}
