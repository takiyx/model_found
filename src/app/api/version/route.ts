export const dynamic = "force-dynamic";

export async function GET() {
  const sha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    null;
  const ref = process.env.VERCEL_GIT_COMMIT_REF || null;
  const env = process.env.VERCEL_ENV || null;
  const url = process.env.VERCEL_URL || null;

  return Response.json({ sha, ref, env, url, now: new Date().toISOString() });
}
