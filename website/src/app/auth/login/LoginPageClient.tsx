'use client';

import {useEffect, useRef, useState} from 'react';
import styles from './LoginPageClient.module.css';
import {signIn} from 'next-auth/react';
import {useRouter} from 'next/navigation';

enum BtnState {
  Loading,
  Show,
  Hide,
}

function calculateCallbackUrl() {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get('callbackUrl') || undefined;
  } catch (e) {
    return '/';
  }
}

export default function LoginPageClient() {
  const router = useRouter();

  const username = useRef('');
  const password = useRef('');
  const [error, setError] = useState('');
  const [btnState, setBtnState] = useState<BtnState>(BtnState.Loading);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      console.log(url);
      if (
        url.protocol === 'https:' ||
        url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1'
      ) {
        setBtnState(BtnState.Show);
      } else {
        setBtnState(BtnState.Hide);
      }
    } catch (e) {
      setBtnState(BtnState.Hide);
    }
  }, []);

  const onSubmit = async () => {
    if (btnState !== BtnState.Show) {
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
        {btnState === BtnState.Show && <button onClick={onSubmit}>the button</button>}
        {btnState === BtnState.Hide && <div>Site must be https in order to log in.</div>}
        {error && <div className={styles.errorBox}>{error}</div>}
      </div>
    </div>
  );
}
