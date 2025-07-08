# HTML Compnent finder and Static generator for htmlcomponent

## vite-env.d.ts
For typescript you need to create
vite-env.d.ts in your src folder

then add
```
/// <reference types="vite/client" />
declare module 'virtual:htmlcomponent-static' {
  export const list: string[];
  export const map: {
    [key: string]: () => void
  };
}
```

## Plugin Options
**componentDir: string**  
The relative dir to vite config where the components are

**componentPrefix?: string**  
A prefix that is used in data-hc that is stripped

Example:  
componentPrefix="app/"  
data-hc="app/cart" -> Loading "cart" in component directory

**virtualExport?: string**  
A custom export string to use with import { map } from 'virtual:htmlcomponent-static'  
It has to start with virtual:

**findOptions: FindComponentOptions**  
The Search Function

**log?: (...args: any[]) => void**  
A Optional Logging function for debugging