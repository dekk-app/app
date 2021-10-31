import { NextApiHandler } from "next";
import process from "process";
import { createApi } from "unsplash-js";

const handler: NextApiHandler = async (request, response) => {
	const args = request.query.args as string[];
	return new Promise(resolve => {
		if (args.join("/") === "search/photos") {
			// On your node server
			const query = request.query.query as string;
			const page = Number.parseInt((request.query.page ?? "1") as string, 10);
			const perPage = Number.parseInt((request.query.per_page ?? "10") as string, 10);
			const serverApi = createApi({
				accessKey: process.env.UNSPLASH_ACCESS_KEY,
			});
			void serverApi.search
				.getPhotos({
					query,
					page,
					perPage,
				})
				.then(data => {
					response.status(200).json(data.response);
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
