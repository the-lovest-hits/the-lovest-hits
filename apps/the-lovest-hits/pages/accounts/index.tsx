import { Title } from '../../components/page-elements';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Accounts() {

  const router = useRouter();

  useEffect(() => {
    router.push('/accounts/add');
  }, [ router ])

  return (<Title>Accounts</Title>)
}
