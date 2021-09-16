import { StyledLink } from "@/atoms/link";
import { addApolloState, initializeApollo } from "@/ions/services/apollo/client";
import UserPage from "@/templates/user-page";
import { PageProps } from "@/types";
import { GetServerSideProps, NextPage } from "next";
import { getProviders, getSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React from "react";

const Page: NextPage<PageProps> = () => {
	return (
		<UserPage>
			<Link passHref href="/deck">
				<StyledLink>New Deck</StyledLink>
			</Link>
		</UserPage>
	);
};

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		};
	}

	const apolloClient = initializeApollo();

	return addApolloState(apolloClient, {
		props: {
			...(await serverSideTranslations(context.locale)),
			providers: await getProviders(),
			session,
			locale: context.locale,
		},
	});
};

export default Page;
