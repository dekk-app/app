import MainNavigation from "@/molecules/main-navigation";
import UserArea from "@/molecules/user-area";
import Layout from "@/organisms/layout/layout-with-left";
import { StyledHeader, StyledLeft, StyledMain } from "@/organisms/layout/styled";
import React, { FC, memo, useEffect } from "react";

export interface UserPageProps {
	data?: unknown;
}

const UserPage: FC<UserPageProps> = ({ children, data }) => {
	useEffect(() => {
		console.log(data);
	}, [data]);
	return (
		<Layout>
			<StyledHeader>HEADER</StyledHeader>
			<StyledLeft>
				<UserArea />
				<MainNavigation />
			</StyledLeft>
			<StyledMain>{children}</StyledMain>
		</Layout>
	);
};

export default memo<FC<UserPageProps>>(UserPage);
