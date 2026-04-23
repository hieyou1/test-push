export default {
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                sw: './src/sw.js'
            },
            output: {
                entryFileNames: (chunkInfo: { name: string; }) => {
                    return chunkInfo.name === 'sw' ? '[name].js' : 'assets/[name]-[hash].js';
                }
            }
        }
    }
}