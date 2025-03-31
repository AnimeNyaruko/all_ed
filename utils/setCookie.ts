export default async function setCookie(
	name: string,
	data: string,
	option: any,
) {
	const formData = new FormData();
	formData.append("username", name);
	formData.append("data", data);
	formData.append("option", JSON.stringify(option));
	await fetch("http://localhost:3000/api/cookie", {
		body: formData,
		method: "POST",
	});
}
