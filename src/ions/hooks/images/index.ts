import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Photos } from "unsplash-js/src/methods/search/types/response";
import { useDebounce } from "use-debounce";

export const useUnsplash = (query, delay = 200) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AxiosError | null>(null);
	const [data, setData] = useState<Photos | null>(null);
	const [debouncedQuery] = useDebounce<string>(query, delay);

	useEffect(() => {
		if (!debouncedQuery) {
			setData({
				results: [],
				total: 0,
				total_pages: 0,
			});
			return;
		}

		const url = `/api/unsplash/search/photos?page=1&per_page=100&query=${debouncedQuery}`;
		setLoading(true);
		setError(null);
		axios
			.get<Photos>(url)
			.then(response => {
				setData(response.data);
			})
			.catch(error_ => {
				setError(error_);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [debouncedQuery]);

	return { data, error, loading };
};
