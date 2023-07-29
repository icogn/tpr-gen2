import {headers} from 'next/headers';
import {getServerSession} from 'next-auth';
import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import LoginPageClient from './LoginPageClient';
import {redirect} from 'next/navigation';

function calcCanShowLoginBtn() {
  try {
    const hdrs = headers();
    console.log('headers:');
    console.log([...hdrs.entries()]);
    const host = hdrs.get('x-forwarded-host');
    console.log(`host is ${host}`);
    const hostname = host ? host.split(':')[0] : '';
    console.log(`hostname is "${hostname}"`);

    const xf = hdrs.get('x-forwarded-proto');
    console.log(`x-forwarded-proto is "${xf}"`);

    return xf === 'https' || hostname === 'localhost' || hostname === '127.0.0.1';
  } catch (e) {
    return false;
  }
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/');
  }

  const canShowLoginBtn = calcCanShowLoginBtn();

  return <LoginPageClient canShowLoginBtn={canShowLoginBtn} />;
}
