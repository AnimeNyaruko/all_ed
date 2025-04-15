"use server";

import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";
import { getCookie } from "@/utils/cookie";
import { redirect } from "next/navigation";
import Selection from "../(UI)/Selection";
interface DataItem {
	name: string;
	assignment_id: string;
}

export default async function Page() {
	const username = (await getCookie("session")) || "";
	if (!username) {
		redirect("/");
	}

	const sanitizedTableName: string = sanitizeUsername(username);
	const data = await sql(
		`SELECT "name","assignment_id" FROM "User Infomation"."${sanitizedTableName}"`,
	);
	const formattedData: DataItem[] = data.map(
		(item: { name?: string; assignment_id?: string }) => ({
			name: item.name || "",
			assignment_id: item.assignment_id || "",
		}),
	);
	return <Selection data={formattedData} />;
}
