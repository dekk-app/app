import { APOLLO_STATE_PROP_NAME } from "@/ions/constants";
import { PageProps } from "@/types";
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import merge from "deepmerge";
import isEqual from "lodash.isequal";
import process from "process";
import { useMemo } from "react";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const backend = new HttpLink({
	uri: process.env.NEXT_PUBLIC_BACKEND_URI,
	credentials: "include",
});

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === "undefined",
		link: backend,
		cache: new InMemoryCache().restore({}),
		defaultOptions: {
			query: {
				fetchPolicy: process.env.NODE_ENV === "production" ? "cache-first" : "no-cache",
				errorPolicy: "all",
			},
		},
	});
}

export function initializeApollo(initialState: NormalizedCacheObject = null) {
	const _apolloClient = apolloClient ?? createApolloClient();

	// If your page has Next.js data fetching methods that use Apollo Client, the initial state
	// gets hydrated here
	if (initialState) {
		// Get existing cache, loaded during client side data fetching
		const existingCache = _apolloClient.extract();

		// Merge the existing cache into data passed from getStaticProps/getServerSideProps
		const data = merge(initialState, existingCache, {
			// Combine arrays using object equality (like in sets)
			arrayMerge: (destinationArray: unknown[], sourceArray: unknown[]) => [
				...sourceArray,
				...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
			],
		});

		// Restore the cache with the merged data
		_apolloClient.cache.restore(data);
	}

	// For SSG and SSR always create a new Apollo Client
	if (typeof window === "undefined") {
		return _apolloClient;
	}

	// Create the Apollo Client once in the client
	if (!apolloClient) {
		apolloClient = _apolloClient;
	}

	return _apolloClient;
}

export const addApolloState = (
	client: ApolloClient<NormalizedCacheObject>,
	pageProps: {
		props: PageProps;
	}
): {
	props: PageProps;
} => {
	if (pageProps?.props) {
		pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
	}

	return pageProps;
};

export const useApollo = (pageProps: PageProps) =>
	useMemo(() => initializeApollo(pageProps[APOLLO_STATE_PROP_NAME]), [pageProps]);
