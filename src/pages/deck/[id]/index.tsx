import { addApolloState, initializeApollo } from "@/ions/services/apollo/client";
import {
	StyledBox,
	StyledButtonRow,
	StyledFieldRow,
	StyledHeader,
	StyledLayoutWithLeftRight,
	StyledLeft,
	StyledMain,
	StyledRight,
} from "@/organisms/layout/styled";
import { PageProps } from "@/types";
import { IconButton } from "@dekk-ui/icon-button";
import { NumberInput } from "@dekk-ui/input-field";
import { InputLabel } from "@dekk-ui/input-label";
import { GetServerSideProps, NextPage } from "next";
import { getProviders, getSession } from "next-auth/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Page: NextPage<PageProps> = () => {
	const { t } = useTranslation(["common"]);
	const router = useRouter();
	console.log(router);
	return (
		<StyledLayoutWithLeftRight>
			<StyledHeader>
				<StyledButtonRow>
					<IconButton icon="editorText" />
					<IconButton icon="editorImage" />
				</StyledButtonRow>
			</StyledHeader>
			<StyledLeft>
				<StyledBox>
					<Link passHref href="/dashboard">
						<a>Dashboard</a>
					</Link>
				</StyledBox>
			</StyledLeft>
			<StyledMain>
				<h1>{t("common:yes")}</h1>
			</StyledMain>
			<StyledRight>
				<div>
					<StyledFieldRow>
						<InputLabel htmlFor="number-1">Number</InputLabel>
						<NumberInput id="number-1" textAlign="right" />
					</StyledFieldRow>
					<StyledFieldRow>
						<InputLabel htmlFor="number-2">Number</InputLabel>
						<NumberInput id="number-2" textAlign="right" />
					</StyledFieldRow>
					<StyledFieldRow>
						<InputLabel htmlFor="number-3">Number</InputLabel>
						<NumberInput id="number-3" textAlign="right" />
					</StyledFieldRow>
				</div>
			</StyledRight>
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
