import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

type Violation = {
  file: string
  line: number
  column: number
  expression: string
}

const root = process.cwd()
const sourceRoot = path.join(root, 'src')
const allowedFile = path.normalize(path.join(sourceRoot, 'lib', 'stock.ts'))
const mutationModels = new Set(['lot', 'movement'])
const mutationMethods = new Set(['update', 'upsert', 'create'])

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(file)
    return /\.(ts|tsx)$/.test(entry.name) ? [file] : []
  })
}

function collectViolations(file: string): Violation[] {
  const source = readFileSync(file, 'utf8')
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
  const violations: Violation[] = []

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const method = node.expression.name.text
      const receiver = node.expression.expression
      if (mutationMethods.has(method) && ts.isPropertyAccessExpression(receiver)) {
        const model = receiver.name.text
        if (mutationModels.has(model) && path.normalize(file) !== allowedFile) {
          const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
          violations.push({
            file: path.relative(root, file).replaceAll(path.sep, '/'),
            line: position.line + 1,
            column: position.character + 1,
            expression: `${model}.${method}`,
          })
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return violations
}

const violations = sourceFiles(sourceRoot).flatMap(collectViolations)

if (violations.length > 0) {
  console.error('Architecture check failed:')
  for (const violation of violations) {
    console.error(
      `  ${violation.file}:${violation.line}:${violation.column} ` +
        `direct inventory mutation "${violation.expression}" is only allowed in src/lib/stock.ts`
    )
  }
  process.exitCode = 1
} else {
  console.log('Architecture check passed: inventory mutations stay behind applyMovement().')
}
