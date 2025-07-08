import { glob } from "glob";
import path from "path";
import fs from "fs";

//#region src/findComponents.ts
async function findComponents(options) {
	const templates = await glob(options.path, {
		ignore: options.ignore ?? "node_modules/**",
		cwd: options.cwd ?? process.cwd()
	});
	const pattern = options.pattern ?? /data-hc="([^"]+)"/g;
	const componentsMap = /* @__PURE__ */ new Map();
	options.log?.("Templates: ", templates.length);
	for (const templatePath of templates) {
		options.log?.("Processing template:", templatePath);
		const templateContent = await fs.promises.readFile(templatePath, "utf8");
		let res = null;
		while ((res = pattern.exec(templateContent)) != null) {
			const name = res[1];
			options.log?.("Found component:", name);
			const map = componentsMap.get(name) ?? {
				name,
				files: []
			};
			map.files.push(path.relative(process.cwd(), templatePath));
			componentsMap.set(name, map);
		}
	}
	return Array.from(componentsMap.keys());
}

//#endregion
//#region src/htmlcomponent-plugin.ts
function htmlcomponentPlugin(options) {
	let config;
	let virtualModuleId = "virtual:htmlcomponent-static";
	if (options.virtualExport != null) {
		if (!options.virtualExport.startsWith("virtual:")) throw new Error("Virtual export must start with \"virtual:\"");
		virtualModuleId = options.virtualExport;
	}
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;
	return {
		name: "htmlcomponent-plugin",
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		resolveId(id) {
			if (id === virtualModuleId) {
				options.log?.("Html Component Plugin: resolving virtual module", id);
				return resolvedVirtualModuleId;
			}
		},
		transform() {
			if (config.command === "serve") {}
		},
		async load(id) {
			if (id === resolvedVirtualModuleId) {
				const map = await findComponents({ ...options.findOptions });
				const componentPrefix = options.componentPrefix;
				if (componentPrefix != null) map.forEach((item, i) => {
					map[i] = item.replace(componentPrefix, "");
				});
				const imports = map.map((item) => `import ${item} from '${options.componentDir}/${item}'`).join("\n");
				return `${imports}
        export const list = ${JSON.stringify(map)}
        export const map = {
          ${map.join(", ")}
        }
        `;
			}
		}
	};
}

//#endregion
export { findComponents, htmlcomponentPlugin };