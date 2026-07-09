import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'inline-css-into-html',
      enforce: 'post',
      generateBundle(_, bundle) {
        // Encontra os ficheiros HTML e CSS gerados no build
        const htmlKey = Object.keys(bundle).find(key => key.endsWith('.html'));
        const cssKey = Object.keys(bundle).find(key => key.endsWith('.css'));

        if (htmlKey && cssKey) {
          const cssCode = bundle[cssKey].source;
          const htmlAsset = bundle[htmlKey];

          // Substitui a tag <link> original pela tag <style> com todo o CSS dentro
          htmlAsset.source = htmlAsset.source.replace(
            /<link[^>]+rel="stylesheet"[^>]+href="[^"]+\.css"[^>]*>/i,
            `<style>\n${cssCode}\n</style>`
          );

          // Remove o ficheiro .css solto da pasta dist (já não é necessário)
          delete bundle[cssKey];
        }
      }
    }
  ]
});