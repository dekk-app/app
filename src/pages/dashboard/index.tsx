import { addApolloState, initializeApollo } from "@/ions/services/apollo/client";
import {
	StyledHeader,
	StyledLayoutWithLeft,
	StyledLeft,
	StyledMain,
} from "@/organisms/layout/styled";
import { PageProps } from "@/types";
import { GetServerSideProps, NextPage } from "next";
import { getProviders, getSession, useSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React from "react";

const Page: NextPage<PageProps> = () => {
	const [session] = useSession();
	return (
		<StyledLayoutWithLeft>
			<StyledHeader>Dashboard</StyledHeader>
			<StyledLeft>
				<img src={session.user.image} alt={session.user.name} />
				<div>{session.user.name}</div>
				<div>
					<Link passHref href="/create">
						<a>Create</a>
					</Link>
				</div>
			</StyledLeft>
			<StyledMain>Main</StyledMain>
		</StyledLayoutWithLeft>
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
