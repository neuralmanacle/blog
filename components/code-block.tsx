import { codeToHtml } from "shiki"

type CodeBlockProps = {
  code: string
  language?: string
}

export default async function CodeBlock({ code, language = "typescript" }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })

  return (
    <div
      className="code-block-container my-4 overflow-x-auto rounded-2xl border border-neutral-200 bg-[var(--code-bg)] p-4 dark:border-white/10 [&_pre]:m-0 [&_pre]:bg-transparent [&_code]:text-sm [&_code]:font-mono [&_code]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
