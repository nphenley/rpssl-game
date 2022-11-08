import Head from 'next/head';

type StyledHeadProps = {
	title: string;
};

const StyledHead = (props: StyledHeadProps) => {
	return (
		<Head>
			<title>{props.title}</title>
			<meta name='viewport' content='initial-scale=1.0, width=device-width' />
		</Head>
	);
};

export default StyledHead;
