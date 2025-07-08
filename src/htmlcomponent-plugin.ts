import { findComponents, type FindComponentOptions } from './findComponents'

export interface HtmlComponentPluginOptions {
  componentDir: string
  componentPrefix?: string
  virtualExport?: string
  findOptions: FindComponentOptions
  log?: (...args: any[]) => void,
}


export function htmlcomponentPlugin (options: HtmlComponentPluginOptions) {
  let config: any
  
  
  let virtualModuleId = 'virtual:htmlcomponent-static'
  if (options.virtualExport != null) {
    if (!options.virtualExport.startsWith('virtual:')) {
      throw new Error('Virtual export must start with "virtual:"')
    }
    virtualModuleId = options.virtualExport
  }

  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: 'htmlcomponent-plugin',

    configResolved(resolvedConfig: any) {
      // store the resolved config
      config = resolvedConfig
    },

    resolveId(id: string) {
      if (id === virtualModuleId) {
        options.log?.('Html Component Plugin: resolving virtual module', id)
        return resolvedVirtualModuleId
      }
    },

    // use stored config in other hooks
    transform() {
      if (config.command === 'serve') {

      } else {

      }
    },

    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const map = await findComponents({ ...options.findOptions })
        const componentPrefix = options.componentPrefix
        if (componentPrefix != null) {
          map.forEach((item, i) => {
            map[i] = item.replace(componentPrefix, '')
          })
        }
        const imports = map.map((item) => `import ${item} from '${options.componentDir}/${item}'`).join('\n')
        return `${imports}
        export const list = ${JSON.stringify(map)}
        export const map = {
          ${map.join(', ')}
        }
        `
      }
    },
  }
}