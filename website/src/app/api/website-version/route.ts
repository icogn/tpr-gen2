import getDynamicEnv from '@/util/getDynamicEnv';
import {NextResponse} from 'next/server';

// Have to force dynamic or any references to dynamic env variables will be
// statically replaced with `undefined`. Not needed on GETs which make use of
// the Request object.
export const dynamic = 'force-dynamic';

export async function GET() {
  const env = getDynamicEnv();
  return NextResponse.json({data: env.TPR_IMAGE_VERSION});
}
