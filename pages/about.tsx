import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Allows direct access to /about
const AboutPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?about=1', '/about');
  }, []);

  return <></>;
};

export default AboutPage;
