import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { hydrateAppData } from './stores/bootstrapStore'

await hydrateAppData().catch((error) => {
  console.error('Gagal memuat data awal aplikasi:', error)
})

createApp(App).use(router).mount('#app')
