
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/features/chat/components/chat-window/chat-window.component.ts": [
    {
      "path": "chunk-PPKUSWRN.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 7370, hash: '6e41d66d3023ff456b901cb4e54f2a2caf455292dbb5d0fa22dbe07f2aa93aa5', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 7666, hash: '15e5d55c621081c75189ff817709cfb7aee1f2d582a1d135dc42e2ea72a6f411', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-7T4XZAUG.css': {size: 92, hash: 'DnZgEomrmDA', text: () => import('./assets-chunks/styles-7T4XZAUG_css.mjs').then(m => m.default)}
  },
};
