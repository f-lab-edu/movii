import Head from 'next/head';

type MetaProps = {
  title?: string;
};

const Meta = ({ title }: MetaProps) => {
  return (
    <Head>
      <title>{title ?? 'Movii'}</title>
    </Head>
  );
};

export default Meta;
