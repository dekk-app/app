import { GoogleFontData } from "@/ions/hooks/fonts";
import axios from "axios";
import { NextApiHandler } from "next";
import process from "process";

const handler: NextApiHandler = async (request, response) => {
	const args = request.query.args as string[];
	return new Promise(resolve => {
		if (args.join("/") === "webfonts/v1/webfonts") {
			const sort = request.query.sort as string;
			const url = `https://www.googleapis.com/webfonts/v1/webfonts?sort=${sort}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
			axios
				.get<GoogleFontData>(url)
				.then(({ data }) => {
					response.status(200).json(data);
					resolve();
				})
				.catch(() => {
					response.status(500).end();
					resolve();
				});
		} else {
			response.status(404).end();
			resolve();
		}
	});
};

export default handler;
