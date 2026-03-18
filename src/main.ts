import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from '@/app/router'
import { bootstrap } from '@/app/bootstrap'
import '@/styles/tailwind.css'

async function start() {
    const app = createApp(App)

    app.use(createPinia())
    app.use(router)

    await bootstrap(app)

    app.mount('#app')
}

start()
