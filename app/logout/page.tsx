import { handler } from "./handler";
import { redirect } from "next/navigation";
export default async function Page() {
	await handler();
	redirect("/");
}
