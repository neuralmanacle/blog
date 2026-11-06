import type { ReactNode } from "react"
import CodeBlock from "@/components/code-block"

const tableClass =
  "w-full min-w-[36rem] border-collapse text-left font-sans text-lg"
const cellClass = "p-4"
const rowClass = "border-b border-neutral-200 dark:border-white/10"
const linkClass =
  "text-emerald-500 underline decoration-emerald-400/50 underline-offset-4 dark:text-emerald-300"

function isTableRow(line: string) {
  return line.trim().startsWith("|") && line.trim().endsWith("|")
}

function tableCells(line: string) {
  return line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim())
}

function readMathGroup(source: string, start: number) {
  if (source[start] !== "{") return null
  let depth = 0
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1
    if (source[index] === "}") depth -= 1
    if (depth === 0) {
      return { value: source.slice(start + 1, index), end: index + 1 }
    }
  }
  return null
}

function readMathAtom(source: string, start: number) {
  const group = readMathGroup(source, start)
  if (group) return group
  if (start >= source.length) return null
  return { value: source[start], end: start + 1 }
}

function formatMath(source: string): string {
  const symbols: Record<string, string> = {
    approx: "≈",
    alpha: "α",
    cdot: "·",
    Delta: "Δ",
    ge: "≥",
    geq: "≥",
    le: "≤",
    leq: "≤",
    mu: "μ",
    neq: "≠",
    pi: "π",
    phi: "φ",
    quad: "   ",
    qquad: "   ",
    sum: "Σ",
    tau: "τ",
    times: "×",
    to: "→",
  }
  let output = ""

  for (let index = 0; index < source.length;) {
    if (source[index] === "\\") {
      if (source[index + 1] === "," || source[index + 1] === ";") {
        output += " "
        index += 2
        continue
      }

      const commandMatch = /^[A-Za-z]+/.exec(source.slice(index + 1))
      const command = commandMatch?.[0] ?? source[index + 1]
      const commandEnd = index + 1 + command.length
      if (command === "left" || command === "right") {
        index = commandEnd
        continue
      }

      if (command === "frac") {
        const numerator = readMathAtom(source, commandEnd)
        const denominator = numerator
          ? readMathAtom(source, numerator.end)
          : null
        if (numerator && denominator) {
          output += `(${formatMath(numerator.value)} / ${formatMath(denominator.value)})`
          index = denominator.end
          continue
        }
      }

      if (command === "sqrt") {
        const radicand = readMathAtom(source, commandEnd)
        if (radicand) {
          output += `√(${formatMath(radicand.value)})`
          index = radicand.end
          continue
        }
      }

      if (
        command === "operatorname" ||
        command === "text" ||
        command === "mathrm"
      ) {
        const group = readMathGroup(source, commandEnd)
        if (group) {
          output += formatMath(group.value)
          index = group.end
          continue
        }
      }

      output += symbols[command] ?? command
      index = commandEnd
      continue
    }

    if (source[index] === "{") {
      const group = readMathGroup(source, index)
      if (group) {
        output += `(${formatMath(group.value)})`
        index = group.end
        continue
      }
    }

    output += source[index]
    index += 1
  }

  return output
}

function InlineContent({ source }: { source: string }) {
  const tokenPattern =
    /(\[[^\]]+\]\([^)]+\)|\*\*.+?\*\*|\*[^*]+\*|`[^`]+`|\$[^$]+\$)/g
  const nodes: ReactNode[] = []
  let previousIndex = 0
  let match: RegExpExecArray | null

  while ((match = tokenPattern.exec(source)) !== null) {
    if (match.index > previousIndex) {
      nodes.push(source.slice(previousIndex, match.index))
    }

    const token = match[0]
    if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
      if (linkMatch) {
        const [, label, href] = linkMatch
        const external = /^https?:\/\//.test(href)
        nodes.push(
          <a
            key={`link-${match.index}`}
            href={href}
            className={linkClass}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            <InlineContent source={label} />
          </a>,
        )
      }
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={`strong-${match.index}`}>
          <InlineContent source={token.slice(2, -2)} />
        </strong>,
      )
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={`em-${match.index}`}>
          <InlineContent source={token.slice(1, -1)} />
        </em>,
      )
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`code-${match.index}`}
          className="rounded bg-neutral-100 px-1 py-0.5 text-[0.85em] dark:bg-white/10"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else {
      nodes.push(
        <span
          key={`math-${match.index}`}
          className="whitespace-nowrap font-serif italic"
          aria-label={`Formula: ${formatMath(token.slice(1, -1))}`}
        >
          {formatMath(token.slice(1, -1))}
        </span>,
      )
    }

    previousIndex = tokenPattern.lastIndex
  }

  if (previousIndex < source.length) {
    nodes.push(source.slice(previousIndex))
  }

  return <>{nodes}</>
}

function isBlockStart(lines: string[], index: number) {
  const line = lines[index]
  return (
    /^#{1,3}\s/.test(line) ||
    line.startsWith("```") ||
    line.trim() === "$$" ||
    line.startsWith(">") ||
    isTableRow(line) ||
    /^\s*[-*]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line)
  )
}

export default async function MarkdownArticleContent({
  source,
}: {
  source: string
}) {
  const lines = source.replace(/\r\n/g, "\n").split("\n")
  const blocks: ReactNode[] = []
  let index = 0
  let key = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line) {
      index += 1
      continue
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "text"
      const codeLines: string[] = []
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index])
        index += 1
      }
      if (index >= lines.length) {
        throw new Error("Unclosed code block in the Step 9 article source.")
      }
      index += 1
      blocks.push(
        <CodeBlock key={key++} language={language} code={codeLines.join("\n")} />,
      )
      continue
    }

    if (line === "$$") {
      const mathLines: string[] = []
      index += 1
      while (index < lines.length && lines[index].trim() !== "$$") {
        mathLines.push(lines[index].trim())
        index += 1
      }
      if (index >= lines.length) {
        throw new Error("Unclosed display formula in the Step 9 article source.")
      }
      index += 1
      blocks.push(
        <div
          key={key++}
          className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-6 text-center font-serif text-2xl leading-relaxed text-neutral-800 sm:text-3xl dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-100"
          role="math"
          aria-label={formatMath(mathLines.join(" "))}
        >
          {formatMath(mathLines.join(" "))}
        </div>,
      )
      continue
    }

    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)?.[0].length ?? 2
      const heading = line.replace(/^#{1,3}\s+/, "")
      const className =
        "pt-4 text-2xl font-semibold text-neutral-900 dark:text-white"
      blocks.push(
        level === 3 ? (
          <h3 key={key++} className={className}>
            <InlineContent source={heading} />
          </h3>
        ) : (
          <h2 key={key++} className={className}>
            <InlineContent source={heading} />
          </h2>
        ),
      )
      index += 1
      continue
    }

    if (isTableRow(line) && index + 1 < lines.length && isTableRow(lines[index + 1])) {
      const headers = tableCells(line)
      index += 2
      const rows: string[][] = []
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(tableCells(lines[index]))
        index += 1
      }
      blocks.push(
        <div
          key={key++}
          className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10"
        >
          <table className={tableClass}>
            <thead className="bg-neutral-100 dark:bg-white/5">
              <tr>
                {headers.map((header, column) => (
                  <th key={column} className={cellClass}>
                    <InlineContent source={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex < rows.length - 1 ? rowClass : undefined}
                >
                  {row.map((cell, column) => (
                    <td key={column} className={cellClass}>
                      <InlineContent source={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    if (line.startsWith(">")) {
      const quote: string[] = []
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quote.push(lines[index].trim().replace(/^>\s?/, ""))
        index += 1
      }
      blocks.push(
        <blockquote
          key={key++}
          className="border-l-2 border-emerald-400/70 pl-4 text-lg italic text-neutral-600 dark:text-neutral-200"
        >
          <InlineContent source={quote.join(" ")} />
        </blockquote>,
      )
      continue
    }

    const listMatch = /^\s*([-*]|\d+\.)\s+/.exec(lines[index])
    if (listMatch) {
      const ordered = /^\d+\.$/.test(listMatch[1])
      const items: string[] = []
      const pattern = ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/
      while (index < lines.length && pattern.test(lines[index])) {
        items.push(lines[index].replace(pattern, "").trim())
        index += 1
      }
      const ItemList = ordered ? "ol" : "ul"
      blocks.push(
        <ItemList
          key={key++}
          className={`space-y-2 pl-6 ${
            ordered ? "list-decimal" : "list-disc marker:text-emerald-300"
          }`}
        >
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <InlineContent source={item} />
            </li>
          ))}
        </ItemList>,
      )
      continue
    }

    const paragraph: string[] = []
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isBlockStart(lines, index)
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    if (paragraph.length === 0) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push(
      <p key={key++}>
        <InlineContent source={paragraph.join(" ")} />
      </p>,
    )
  }

  return (
    <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-mono text-2xl leading-relaxed">
      {blocks}
    </div>
  )
}
