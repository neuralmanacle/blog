import { isValidElement, type ReactNode } from "react"
import { MarkdownAsync, type Components } from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import CodeBlock from "@/components/code-block"

const linkClass =
  "text-emerald-500 underline decoration-emerald-400/50 underline-offset-4 dark:text-emerald-300"
const tableClass =
  "w-full min-w-[36rem] border-collapse text-left font-sans text-lg"
const cellClass = "p-4"

function getHeadingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children)
  }

  if (Array.isArray(children)) {
    return children.map(getHeadingText).join("")
  }

  if (isValidElement<{ children?: ReactNode }>(children)) {
    return getHeadingText(children.props.children)
  }

  return ""
}

function getHeadingId(children: ReactNode): string {
  return getHeadingText(children)
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

const components: Components = {
  a: ({ children, href }) => {
    const external = href?.startsWith("http://") || href?.startsWith("https://")
    return (
      <a
        href={href}
        className={linkClass}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    )
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-emerald-400/70 pl-4 text-lg italic text-neutral-600 dark:text-neutral-200">
      {children}
    </blockquote>
  ),
  code: async ({ children, className }) => {
    const language = /language-([\w-]+)/.exec(className ?? "")?.[1]
    if (language) {
      return (
        <CodeBlock
          language={language}
          code={String(children).replace(/\n$/, "")}
        />
      )
    }

    return (
      <code className="rounded bg-neutral-100 px-1 py-0.5 text-[0.85em] dark:bg-white/10">
        {children}
      </code>
    )
  },
  h2: ({ children }) => (
    <h2
      id={getHeadingId(children)}
      className="pt-4 text-2xl font-semibold text-neutral-900 dark:text-white"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      id={getHeadingId(children)}
      className="pt-4 text-xl font-semibold text-neutral-900 dark:text-white"
    >
      {children}
    </h3>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-6">{children}</ol>
  ),
  p: ({ children }) => <p>{children}</p>,
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10">
      <table className={tableClass}>{children}</table>
    </div>
  ),
  td: ({ children }) => (
    <td className={`${cellClass} border-b border-neutral-200 dark:border-white/10`}>
      {children}
    </td>
  ),
  th: ({ children }) => (
    <th className={`${cellClass} bg-neutral-100 text-left dark:bg-white/5`}>
      {children}
    </th>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-6 marker:text-emerald-300">
      {children}
    </ul>
  ),
}

export default async function MarkdownArticleContent({
  source,
}: {
  source: string
}) {
  return (
    <div className="markdown-article-content space-y-6 text-2xl leading-relaxed text-neutral-700 dark:text-neutral-300">
      <MarkdownAsync
        components={components}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {source}
      </MarkdownAsync>
    </div>
  )
}
