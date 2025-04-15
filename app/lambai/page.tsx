"use server";

import { redirect } from "next/navigation";
import { handler } from "./(handler)/handler";
import Home from "./(UI)/lambai";

export default async function Page() {
	const result = await handler();
	if (result.status === "error") {
		redirect("/lambai/selection");
	} else return <Home markdownContent={result.data?.[0]?.task} />;
}
