import { addApolloState, initializeApollo } from "@/ions/services/apollo/client";
import {
	StyledHeader,
	StyledLayoutWithLeftRight,
	StyledLeft,
	StyledMain,
	StyledRight,
} from "@/organisms/layout/styled";
import { PageProps } from "@/types";
import { GetServerSideProps, NextPage } from "next";
import { getProviders, getSession, useSession } from "next-auth/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React from "react";

const Page: NextPage<PageProps> = () => {
	const [session] = useSession();
	const { t } = useTranslation(["common"]);
	return (
		<StyledLayoutWithLeftRight>
			<StyledHeader>
				{session ? (
					<button type="button">Save</button>
				) : (
					<button type="button">Login</button>
				)}
			</StyledHeader>
			<StyledLeft>
				<div>
					<Link passHref href="/dashboard">
						<a>Dashboard</a>
					</Link>
				</div>
			</StyledLeft>
			<StyledMain>
				<h1>{t("common:yes")}</h1>
			</StyledMain>
			<StyledRight>Right</StyledRight>
		</StyledLayoutWithLeftRight>
	);
};

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
	const apolloClient = initializeApollo();

	return addApolloState(apolloClient, {
		props: {
			...(await serverSideTranslations(context.locale)),
			providers: await getProviders(),
			session: await getSession(context),
			locale: context.locale,
		},
	});
};

export default Page;
