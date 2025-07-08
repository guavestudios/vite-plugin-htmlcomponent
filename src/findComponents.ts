import { glob } from 'glob'
import path from 'path'
import fs from 'fs'

export interface FindComponentOptions {
    path: string | string[]
    ignore?: string[]
    cwd?: string
    pattern?: RegExp
    log?: (...args: any[]) => void
  
}
export async function findComponents (options: FindComponentOptions): Promise<string[]> {
  const templates = await glob(options.path, { ignore: options.ignore ?? 'node_modules/**', cwd: options.cwd ?? process.cwd() })
  const pattern = options.pattern ?? /data-hc="([^"]+)"/g

  const componentsMap = new Map()
  options.log?.('Templates: ', templates.length)

  for (const templatePath of templates) {
    options.log?.('Processing template:', templatePath)
    const templateContent = await fs.promises.readFile(templatePath, 'utf8')
    let res = null
    while ((res = pattern.exec(templateContent)) != null) {
      const name = res[1]
      options.log?.('Found component:', name)
      const map = componentsMap.get(name) ?? { name, files: [] }
      map.files.push(path.relative(process.cwd(), templatePath))
      componentsMap.set(name, map)
    }
  }
  
  return Array.from(componentsMap.keys())
}
