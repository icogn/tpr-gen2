'use client';

import {useRef, useState} from 'react';
import styles from './LoginPageClient.module.css';
import {signIn} from 'next-auth/react';
import {useRouter} from 'next/navigation';

type LoginPageClientProps = {
  canShowLoginBtn: boolean;
};

function calculateCallbackUrl() {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get('callbackUrl') || undefined;
  } catch (e) {
    return '/';
  }
}

export default function LoginPageClient({canShowLoginBtn}: LoginPageClientProps) {
  const router = useRouter();

  const username = useRef('');
  const password = useRef('');
  const [error, setError] = useState<string>('');

  const onSubmit = async () => {
    if (!canShowLoginBtn) {
      return;
    }

    const result = await signIn('credentials', {
      username: username.current,
      password: password.current,
      redirect: false,
      callbackUrl: calculateCallbackUrl(),
    });

    console.log(result);
    if (result) {
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setError('');
        router.refresh();
        router.replace(result.url);
      } else {
        setError('Login failed');
      }
    } else {
      setError('Login failed');
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.loginSection}>
        <div>LoginPagee</div>
        <div>{`canShowLoginBtn:${canShowLoginBtn}`}</div>
        <div style={{color: 'black'}}>
          <div>
            <input
              placeholder="username"
              onChange={e => {
                username.current = e.target.value;
              }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="password"
              onChange={e => {
                password.current = e.target.value;
              }}
            />
          </div>
        </div>
        {canShowLoginBtn ? (
          <button onClick={onSubmit}>the button</button>
        ) : (
          <div>Site must be https in order to log in.</div>
        )}
        {error && <div className={styles.errorBox}>{error}</div>}
      </div>
    </div>
  );
}
