import { ResultData, QuestionDetail } from "@/types";
import ResultPage from "./(UI)/ResultPage";
import sql from "@/utils/database";
import sanitizeUsername from "@/utils/sanitizeUsername";
import { getCookie } from "@/utils/cookie";
import { redirect } from "next/navigation";
export default async function Page() {
	const username = await getCookie("session");
	if (!username) {
		redirect("/");
	}
	const query = `SELECT result from "User Infomation"."${sanitizeUsername(username)}"`;
	const data = await sql(query);
	if (!data[0].result) {
		redirect("/lambai");
	}
	const resultJson = JSON.parse(data[0].result);
	const resultQuestions: QuestionDetail[] = resultJson.cau_hoi.reduce(
		(acc: QuestionDetail[], question: string, index: number) => {
			acc.push({
				id: index + 1,
				subQuestion: question,
				userAnswer: resultJson.cau_tra_loi[index],
				correctAnswer: resultJson.dap_an_dung[index],
				isCorrect: resultJson.cau_tra_loi_dung[index],
			});
			return acc;
		},
		[],
	);

	const correctAnswers = resultQuestions.reduce(
		(acc: number, cur: QuestionDetail) => {
			return acc + (cur.isCorrect ? 1 : 0);
		},
		0,
	);
	const totalQuestions = resultQuestions.length;
	const percentage = (correctAnswers / totalQuestions) * 100;

	const result: ResultData = {
		correctAnswers: correctAnswers,
		totalQuestions: totalQuestions,
		percentage: Math.round((percentage + Number.EPSILON) * 10) / 10,
		completionTime: resultJson.completionTime,
		de_bai: resultJson.de_bai,
		questions: resultQuestions,
	};

	return <ResultPage result={result} />;
}
