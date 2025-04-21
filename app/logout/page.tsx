import { redirect } from "next/navigation";
import { handler } from "./handler";

export default async function Page() {
	await handler();
}
