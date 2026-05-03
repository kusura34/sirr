
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/features/chat/components/chat-window/chat-window.component.ts": [
    {
      "path": "chunk-FDJVLRZZ.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 7373, hash: '68de30bcc3c93312c45d055ea9d6fd6de75e75dd88a9655a3d740c6a91d66d46', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 7666, hash: 'e1ff957618eeee9f56383fb5aa75a7e1c2eeb420103b5480ee8ca212dca2ce30', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PKSK37PX.css': {size: 95, hash: 'eJwLvQOX0ak', text: () => import('./assets-chunks/styles-PKSK37PX_css.mjs').then(m => m.default)}
  },
};
