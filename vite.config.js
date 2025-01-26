import { defineConfig } from 'vite'

export default defineConfig({
  base: '/candle/', // Укажите имя вашего репозитория
  build: {
    outDir: 'dist', // Папка, в которую будет собран проект
  },
  // server: {
  //   host: '127.0.0.1',
  //   port: 300,
  //   open: true,
  // },
})

