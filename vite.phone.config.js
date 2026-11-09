import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
// HTTPS on the local network so a phone can use the camera
export default defineConfig({ plugins: [react(), basicSsl()], server: { host: true } })
