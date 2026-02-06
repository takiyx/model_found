import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { regionLabel } from "@/lib/regions";
import { getSession } from "@/lib/session";
import { ImageGallery } from "@/components/image-gallery";
import { prefectureLabels } from "@/lib/prefectures";
import { canViewContact } from "@/lib/contact-permission";
import { BlockButton } from "@/components/block-button";
import { TagChip } from "@/components/tag-chip";
import { CopyButton } from "@/components/copy-button";
import { isAdminEmail } from "@/lib/admin";
import { absoluteUrl } from "@/lib/site";
import { generatePostMetadata } from "./metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

import { NoticeBanner } from "@/components/notice-banner";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return await generatePostMetadata(id);
}

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reported?: string; sanitized?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const reported = sp.reported === "1";
  const sanitized = sp.sanitized === "1";

  const post = await prisma.post.findFirst({
    where: { id },
    include: { author: true, images: true },
  });
  if (!post) return notFound();

  const session = await getSession();
  const currentUserId = session?.user?.id;
  const isAuthor = currentUserId === post.authorId;
  const isAdmin = isAdminEmail(session?.user?.email);

  // If the post is hidden, show a friendly page instead of 404.
  if (!post.isPublic && !isAuthor) {
    return (
      <div className="grid gap-6">
        <NoticeBanner tone="danger" title="この投稿は現在非表示です">
          運営の判断により非表示になっている可能性があります。
        </NoticeBanner>
        <div className="rounded-3xl border bg-white p-6">
          <h1 className="text-xl font-semibold">投稿は閲覧できません</h1>
          <p className="mt-2 text-sm text-zinc-600">ホームに戻って別の投稿を探してください。</p>
          <div className="mt-4">
            <Link className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50" href="/">
              ホームへ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const contactAllowed = currentUserId
    ? await canViewContact({ postId: post.id, viewerId: currentUserId })
    : false;

  // Author can still preview their hidden post
  const hiddenForOthers = !post.isPublic;
  const hiddenBecauseUrl = hiddenForOthers
    ? (await import("@/lib/post-guard")).containsUrlLike(`${post.title}\n${post.body}\n${post.contactText}`)
    : false;

  const initialBlocked = currentUserId
    ? !!(await prisma.blockUser.findUnique({
        where: { blockerId_blockedId: { blockerId: currentUserId, blockedId: post.authorId } },
        select: { blockerId: true },
      }))
    : false;

  return (
    <div className="grid gap-6">
      {reported ? (
        <NoticeBanner tone="success" title="報告を受け付けました">
          ありがとうございます。内容を確認して対応します。
        </NoticeBanner>
      ) : null}

      {sanitized ? (
        <NoticeBanner tone="warning" title="外部リンクを自動削除しました">
          スパム対策のため、投稿に含まれていた外部URLは自動的に削除されました。必要なら @ID やメール等で記載してください。
        </NoticeBanner>
      ) : null}

      {hiddenForOthers ? (
        <NoticeBanner tone="warning" title="この投稿は非表示です（投稿者のみ表示）">
          {hiddenBecauseUrl ? (
            <>
              外部URLを含むため、スパム対策の自動審査で一時的に非公開になっています。
              必要ならURLを削除して再投稿するか、管理者の確認をお待ちください。
            </>
          ) : (
            <>他のユーザーには表示されません。</>
          )}
        </NoticeBanner>
      ) : null}

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": absoluteUrl(`/posts/${post.id}#post`),
            headline: post.title,
            description: (post.body || "").replace(/\s+/g, " ").trim().slice(0, 200),
            inLanguage: "ja-JP",
            isAccessibleForFree: true,
            datePublished: post.createdAt?.toISOString?.() ?? post.createdAt,
            dateModified: post.updatedAt?.toISOString?.() ?? post.updatedAt,
            author: {
              "@type": "Person",
              name: post.author.displayName,
              url: absoluteUrl(`/u/${post.authorId}`),
            },
            publisher: {
              "@type": "Organization",
              name: "Model Find",
              url: absoluteUrl("/"),
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": absoluteUrl(`/posts/${post.id}`),
              url: absoluteUrl(`/posts/${post.id}`),
            },
            url: absoluteUrl(`/posts/${post.id}`),
            keywords: post.tags || undefined,
            about: (post.tags || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .slice(0, 20)
              .map((t) => ({ "@type": "Thing", name: t })),
            image: post.images?.map((i) => i.url) ?? [],
          }),
        }}
      />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: post.title, url: `/posts/${post.id}` },
            ])
          ),
        }}
      />

      <header className="rounded-3xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-zinc-500">
              {prefectureLabels[post.prefecture]}（{regionLabel(post.region)}） / {post.mode === "PHOTOGRAPHER" ? "撮影者" : "モデル"}投稿
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{post.title}</h1>
            <div className="mt-2 text-sm text-zinc-600">
              投稿者：{post.author.displayName} ・ {new Date(post.createdAt).toLocaleString("ja-JP")}
            </div>

            {isAuthor || isAdmin ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                <span className="font-medium text-zinc-900">Post ID</span>
                <code className="rounded-lg border bg-zinc-50 px-2 py-1">{post.id}</code>
                <CopyButton text={post.id} />
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {currentUserId === post.authorId ? (
              <Link
                className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
                href={`/posts/${post.id}/edit`}
              >
                編集
              </Link>
            ) : null}
            {session?.user && currentUserId !== post.authorId ? (
              <BlockButton blockedId={post.authorId} initialBlocked={initialBlocked} />
            ) : null}
            <Link
              className="rounded-full border px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
              href={`/report?postId=${post.id}`}
            >
              報告
            </Link>
          </div>
        </div>
      </header>

      <article className="rounded-3xl border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-zinc-50 p-4">
            <div className="text-xs font-medium text-zinc-500">報酬</div>
            <div className="mt-1 text-sm text-zinc-900">{post.reward || "-"}</div>
          </div>
          <div className="rounded-2xl border bg-zinc-50 p-4">
            <div className="text-xs font-medium text-zinc-500">場所</div>
            <div className="mt-1 text-sm text-zinc-900">{post.place || "-"}</div>
          </div>
          <div className="rounded-2xl border bg-zinc-50 p-4">
            <div className="text-xs font-medium text-zinc-500">日時</div>
            <div className="mt-1 text-sm text-zinc-900">{post.dateText || "-"}</div>
          </div>
          <div className="rounded-2xl border bg-zinc-50 p-4">
            <div className="text-xs font-medium text-zinc-500">タグ</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {post.tags
                ? post.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <TagChip key={t} tag={t} />
                    ))
                : "-"}
            </div>
          </div>
        </div>

        <div className="mt-6 prose max-w-none prose-zinc">
          <p className="whitespace-pre-wrap">{post.body}</p>
        </div>

        {post.images.length > 0 ? (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-900">写真</div>
              <div className="text-xs text-zinc-500">クリックして拡大</div>
            </div>
            <ImageGallery images={post.images} />
          </div>
        ) : null}
      </article>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold">連絡 / 連絡先</h2>

        {!session?.user ? (
          <p className="mt-2 text-sm text-zinc-600">
            メッセージを送るにはログインが必要です。
          </p>
        ) : currentUserId === post.authorId ? (
          <div className="mt-3">
            <div className="text-sm text-zinc-600">あなたの連絡先（投稿者のみ表示）</div>
            <div className="mt-2 rounded-2xl border bg-zinc-50 p-4 text-sm text-zinc-900 whitespace-pre-wrap">
              {post.contactText || "-"}
            </div>
          </div>
        ) : (
          <div className="mt-3 grid gap-3">
            <div>
              <Link
                className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                href={`/threads/new?postId=${post.id}`}
              >
                メッセージを送る
              </Link>
              <p className="mt-2 text-xs text-zinc-500">会話は「受信箱」から確認できます。</p>
            </div>

            {contactAllowed ? (
              <div>
                <div className="text-sm font-medium text-zinc-900">連絡先</div>
                <div className="mt-2 rounded-2xl border bg-zinc-50 p-4 text-sm text-zinc-900 whitespace-pre-wrap">
                  {post.contactText || "-"}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border bg-zinc-50 p-4 text-sm text-zinc-600">
                迷惑行為対策のため、連絡先は <span className="font-medium text-zinc-900">相手が返信した後</span> に表示されます。
                まずは站内メッセージで連絡してください。
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
