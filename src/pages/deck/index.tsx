import { PageProps } from "@/types";
import { GetServerSideProps, NextPage } from "next";
import { v4 as uuid } from "uuid";

const Page: NextPage<PageProps> = () => {
	return null;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
	const id = uuid();
	return {
		redirect: {
			permanent: false,
			destination: `/deck/${id}`,
		},
	};
};

export default Page;
