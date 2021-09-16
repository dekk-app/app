import { StyledNavLink } from "@/atoms/link";
import styled from "@emotion/styled";
import { signOut } from "next-auth/client";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo } from "react";

export const StyledNav = styled.nav`
	display: block;
	width: 100%;
`;

const menuLinks = [
	{ route: "/profile", label: "profile" },
	{ route: "/account", label: "account" },
	{ route: "/projects", label: "projects" },
];

const MainNavigation = () => {
	const { route } = useRouter();
	const { t } = useTranslation("menu");
	return (
		<StyledNav>
			{menuLinks.map(menuLink => (
				<Link key={menuLink.route} passHref href={menuLink.route}>
					<StyledNavLink isActive={route === menuLink.route}>
						{t(`menu:${menuLink.label}`)}
					</StyledNavLink>
				</Link>
			))}
			<StyledNavLink
				as="button"
				onClick={() => {
					void signOut();
				}}
			>
				Logout
			</StyledNavLink>
		</StyledNav>
	);
};

export default memo(MainNavigation);
