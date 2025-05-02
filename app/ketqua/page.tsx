import { ResultData } from "@/types";
import ResultPage from "./(UI)/ResultPage";

export default async function Page() {
	const result: ResultData = {
		correctAnswers: 0,
		totalQuestions: 0,
		percentage: 0,
		completionTime: "",
		de_bai: "",
		questions: [],
	};

	return <ResultPage result={result} />;
}
