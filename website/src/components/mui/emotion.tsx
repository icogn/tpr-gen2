'use client';

import React, {useState} from 'react';
import {CacheProvider} from '@emotion/react';
import {useServerInsertedHTML} from 'next/navigation';
import createEmotionCache from './createEmotionCache';

type RootStyleRegistryProps = {
  children?: React.ReactNode;
};

export default function RootStyleRegistry({children}: RootStyleRegistryProps) {
  const [cache] = useState(() => {
    const c = createEmotionCache();
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
