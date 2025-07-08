//#region src/findComponents.d.ts
interface FindComponentOptions {
  path: string | string[];
  ignore?: string[];
  cwd?: string;
  pattern?: RegExp;
  log?: (...args: any[]) => void;
}
declare function findComponents(options: FindComponentOptions): Promise<string[]>;
//#endregion
//#region src/htmlcomponent-plugin.d.ts
interface HtmlComponentPluginOptions {
  componentDir: string;
  componentPrefix?: string;
  virtualExport?: string;
  findOptions: FindComponentOptions;
  log?: (...args: any[]) => void;
}
declare function htmlcomponentPlugin(options: HtmlComponentPluginOptions): {
  name: string;
  configResolved(resolvedConfig: any): void;
  resolveId(id: string): string | undefined;
  transform(): void;
  load(id: string): Promise<string | undefined>;
};
//#endregion
export { FindComponentOptions, HtmlComponentPluginOptions, findComponents, htmlcomponentPlugin };