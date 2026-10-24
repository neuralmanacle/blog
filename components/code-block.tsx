import { codeToHtml } from "shiki"

type CodeBlockProps = {
  code: string
  language?: string
}

export default async function CodeBlock({
  code,
  language = "typescript",
}: CodeBlockProps) {
  const html = await codeToHtml(code.trim(), {
    lang: language,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  })

  return (
    <div
      className="code-block-container"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
