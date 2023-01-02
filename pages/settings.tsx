import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Allows direct access to /settings
const SettingsPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?settings=1', '/settings');
  }, []);

  return <></>;
};

export default SettingsPage;
