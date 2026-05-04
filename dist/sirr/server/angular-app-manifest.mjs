
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/features/chat/components/chat-window/chat-window.component.ts": [
    {
      "path": "chunk-CDE4VB5J.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 7370, hash: '8e7c361b79289a886994ef35b13944412a18d529520e7d89d5ec9586ea7f89c4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 7666, hash: '114970ef3f7ccc51aa0bfbbce8c7ef6ec4edc38b3a8f503870cd4dadc3470af8', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-7T4XZAUG.css': {size: 92, hash: 'DnZgEomrmDA', text: () => import('./assets-chunks/styles-7T4XZAUG_css.mjs').then(m => m.default)}
  },
};
