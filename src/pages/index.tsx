import { addApolloState, initializeApollo } from "@/ions/services/apollo/client";
import { pxToRem } from "@/ions/utils/unit";
import { PageProps } from "@/types";
import { Button } from "@dekk-ui/button";
import { TextInput } from "@dekk-ui/input-field";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { GetServerSideProps, NextPage } from "next";
import { getProviders, getSession, signIn } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";

const StyledButtonWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	${({ theme }) => css`
		margin: ${pxToRem(theme.space.xs)} 0;
		grid-gap: ${pxToRem(theme.space.xs)};
	`};
`;

const StyledLogin = styled.div`
	width: ${pxToRem(300)};
	margin: auto;
	${({ theme }) => css`
		padding: ${pxToRem(theme.space.xs)};
	`};
`;

const StyledFieldWrapper = styled.div`
	${({ theme }) => css`
		margin: ${pxToRem(theme.space.xs)} 0;
	`};
`;

const StyledLoginButtonWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	${({ theme }) => css`
		margin: ${pxToRem(theme.space.xs)} 0;
	`};
`;

const StyledLoginPage = styled.div`
	display: flex;
	align-content: center;
	align-items: center;
	justify-content: center;
	height: 100vh;
	${({ theme }) => css`
		background: ${theme.ui.background["1"]};
		color: ${theme.ui.text["1"]};
	`};
`;

const StyledLoginForm = styled.form``;

const Page: NextPage<PageProps> = () => {
	const [email, setEmail] = useState("");
	return (
		<StyledLoginPage>
			<StyledLogin>
				<StyledButtonWrapper>
					<Button
						onClick={() => {
							void signIn("google");
						}}
					>
						Google
					</Button>
					<Button
						onClick={() => {
							void signIn("github");
						}}
					>
						Github
					</Button>
				</StyledButtonWrapper>
				<StyledLoginForm
					onSubmit={event_ => {
						event_.preventDefault();
						void signIn("email", { email });
					}}
				>
					<StyledFieldWrapper>
						<TextInput
							fullWidth
							name="email"
							type="email"
							value={email}
							onChange={event_ => {
								setEmail(event_.target.value);
							}}
						/>
					</StyledFieldWrapper>
					<StyledLoginButtonWrapper>
						<Button
							onClick={() => {
								void signIn("email", { email });
							}}
						>
							Login
						</Button>
					</StyledLoginButtonWrapper>
				</StyledLoginForm>
			</StyledLogin>
		</StyledLoginPage>
	);
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
