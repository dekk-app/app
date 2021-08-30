import { addApolloState, initializeApollo } from "@/ions/services/apollo/client";
import { PageProps } from "@/types";
import { GetServerSideProps, NextPage } from "next";
import { getProviders, getSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

const Page: NextPage<PageProps> = () => {
	return <div>Please Login</div>;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
	const session = await getSession(context);

	if (session) {
		return {
			redirect: {
				permanent: false,
				destination: "/dashboard",
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
