
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/features/chat/pages/auth-page/auth-page.component.ts": [
    {
      "path": "chunk-OS3OKOMB.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-DFH3LLDJ.js",
      "dynamicImport": false
    }
  ],
  "src/app/features/chat/components/chat-window/chat-window.component.ts": [
    {
      "path": "chunk-KEUYDBNA.js",
      "dynamicImport": false
    },
    {
      "path": "chunk-DFH3LLDJ.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 30313, hash: '30f004fb6bff9c1d92faf057a6c35a38d4a183b7f861ccf4353db5c2240c8706', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 23777, hash: '32c100d82d78688768e0ed823a43ec1fd95605ba26898bfe58eae14ab1c60e39', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-K4U3WSS6.css': {size: 7089, hash: 'WF6vmRxAZvM', text: () => import('./assets-chunks/styles-K4U3WSS6_css.mjs').then(m => m.default)}
  },
};
