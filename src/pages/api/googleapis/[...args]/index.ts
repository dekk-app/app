import { GoogleFontData } from "@/ions/hooks/fonts";
import axios from "axios";
import { NextApiHandler } from "next";
import process from "process";

const handler: NextApiHandler = (request, response) => {
	const args = request.query.args as string[];
	if (args.join("/") === "webfonts/v1/webfonts") {
		const sort = request.query.sort as string;
		const url = `https://www.googleapis.com/webfonts/v1/webfonts?sort=${sort}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
		axios
			.get<GoogleFontData>(url)
			.then(({ data }) => {
				response.json(data);
			})
			.catch(error_ => {
				response.json(error_);
			});
	} else {
		response.json(null);
	}
};

export default handler;
