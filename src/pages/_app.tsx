import "@/ions/fonts/poppins.css";
import { ConsentProvider } from "@/ions/hooks/consent/context";
import { useApollo } from "@/ions/services/apollo/client";
import { cache } from "@/ions/services/emotion/cache";
import { PageProps } from "@/types";
import { ApolloProvider } from "@apollo/client";
import {
	CacheProvider as EmotionCacheProvider,
	css,
	Global,
	ThemeProvider as EmotionThemeProvider,
} from "@emotion/react";
import { Provider as NextAuthProvider } from "next-auth/client";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import useDarkMode from "use-dark-mode";
import pkg from "../../package.json";

export const fontFaces = css`
	body {
		font-family: "Poppins", sans-serif;
	}
`;

export const debugging = css`
	:root {
		--debug-color: hsla(180, 100%, 50%, 0.3);
		--debug-stroke: 1px;
	}
`;

const App = ({ Component, pageProps }: AppProps<PageProps>) => {
	const { value: darkMode } = useDarkMode();
	const [theme, setTheme] = useState({});
	const apolloClient = useApollo(pageProps as PageProps);
	const { locale } = useRouter();

	useEffect(() => {
		setTheme({});
	}, [darkMode]);

	return (
		<>
			<Global styles={fontFaces} />
			<Head>
				<title key="title">Dekk</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta name="version" content={pkg.version} />
				<meta name="application-name" content="Dekk" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<meta name="apple-mobile-web-app-title" content="Dekk" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="robots" content="noindex,nofollow" />
				{/* Enable when needed
				<meta name="msapplication-TileColor" content={theme.ui.colors.theme.background}/>
				*/}
				<meta name="msapplication-tap-highlight" content="no" />
				{/* Enable when needed
				<meta name="theme-color" content={theme.ui.colors.theme.background} />
				*/}
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href={`/icons/apple-touch-icon.png?${pkg.version}`}
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href={`/icons/icon-32x32.png?${pkg.version}`}
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href={`/icons/icon-16x16.png?${pkg.version}`}
				/>
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href={`/	favicon.ico?${pkg.version}`} />
			</Head>
			<ConsentProvider consent={(pageProps as PageProps).consent ?? null}>
				<NextAuthProvider session={(pageProps as PageProps).session}>
					<ApolloProvider client={apolloClient}>
						<EmotionCacheProvider value={cache}>
							<EmotionThemeProvider theme={theme}>
								<Component {...pageProps} />
							</EmotionThemeProvider>
						</EmotionCacheProvider>
					</ApolloProvider>
				</NextAuthProvider>
			</ConsentProvider>
			<Script
				src={`https://consent.cookiefirst.com/banner.js?cookiefirst-key=${process.env.NEXT_PUBLIC_COOKIEFIRST_KEY}&language=${locale}`}
				strategy="lazyOnload"
			/>
		</>
	);
};

export default appWithTranslation(App);
