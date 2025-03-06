//Types from Umi4

type CSSModuleClasses = { readonly [key: string]: string }
declare module '*.css' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.scss' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.sass' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.less' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.styl' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.stylus' {
  const classes: CSSModuleClasses
  export default classes
}

// images
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.gif' {
  const src: string
  export default src
}
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<
  SVGSVGElement
  > & { title?: string }>;

  const src: string
  export default src
}
declare module '*.ico' {
  const src: string
  export default src
}
declare module '*.webp' {
  const src: string
  export default src
}
declare module '*.avif' {
  const src: string
  export default src
}

// media
declare module '*.mp4' {
  const src: string
  export default src
}
declare module '*.webm' {
  const src: string
  export default src
}
declare module '*.ogg' {
  const src: string
  export default src
}
declare module '*.mp3' {
  const src: string
  export default src
}
declare module '*.wav' {
  const src: string
  export default src
}
declare module '*.flac' {
  const src: string
  export default src
}
declare module '*.aac' {
  const src: string
  export default src
}

// fonts
declare module '*.woff' {
  const src: string
  export default src
}
declare module '*.woff2' {
  const src: string
  export default src
}
declare module '*.eot' {
  const src: string
  export default src
}
declare module '*.ttf' {
  const src: string
  export default src
}
declare module '*.otf' {
  const src: string
  export default src
}

// other
declare module '*.wasm' {
  const initWasm: (options: WebAssembly.Imports) => Promise<WebAssembly.Exports>
  export default initWasm
}
declare module '*.webmanifest' {
  const src: string
  export default src
}
declare module '*.pdf' {
  const src: string
  export default src
}
declare module '*.txt' {
  const src: string
  export default src
}
