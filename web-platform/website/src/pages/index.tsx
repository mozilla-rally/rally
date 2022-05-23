import type { NextPage } from 'next';
import Head from 'next/head';
import { Strings } from '../resources/Strings';

const strings = Strings.pages.index;

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>{strings.title}</title>
      </Head>

      <main>
        Main Page
      </main>
    </div>
  );
};

export default Home;
