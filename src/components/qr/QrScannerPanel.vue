<script setup>
import { onBeforeUnmount, ref } from 'vue'
import jsQR from 'jsqr'

const emit = defineEmits(['detected'])

const videoRef = ref(null)
const canvasRef = ref(null)
const isStarting = ref(false)
const isCameraActive = ref(false)
const statusMessage = ref('Klik start camera untuk scan QR asset.')
const errorMessage = ref('')

let stream = null
let frameRequest = null

const stopCamera = () => {
  if (frameRequest) {
    cancelAnimationFrame(frameRequest)
    frameRequest = null
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null
  }

  isCameraActive.value = false
}

const scanFrame = () => {
  const video = videoRef.value
  const canvas = canvasRef.value

  if (!video || !canvas || !isCameraActive.value) return

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const context = canvas.getContext('2d', { willReadFrequently: true })
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const result = jsQR(imageData.data, canvas.width, canvas.height)

    if (result?.data) {
      statusMessage.value = `QR terdeteksi: ${result.data}`
      emit('detected', result.data)
      stopCamera()
      return
    }
  }

  frameRequest = requestAnimationFrame(scanFrame)
}

const startCamera = async () => {
  if (isCameraActive.value || isStarting.value) return

  isStarting.value = true
  errorMessage.value = ''

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
      },
      audio: false,
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      await videoRef.value.play()
    }

    isCameraActive.value = true
    statusMessage.value = 'Camera aktif. Arahkan ke QR code asset.'
    scanFrame()
  } catch (error) {
    errorMessage.value = 'Camera tidak bisa diakses. Cek izin browser atau gunakan manual select.'
    statusMessage.value = 'Camera gagal dibuka.'
  } finally {
    isStarting.value = false
  }
}

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<template>
  <section class="scanner-panel">
    <div class="scanner-head">
      <div>
        <p class="eyebrow">Live Camera</p>
        <h4>Scan QR dari asset fisik</h4>
      </div>
      <div class="scanner-pill" :class="{ active: isCameraActive }">
        {{ isCameraActive ? 'Camera aktif' : 'Camera standby' }}
      </div>
    </div>

    <div class="video-shell">
      <video ref="videoRef" class="scanner-video" playsinline muted></video>
      <div v-if="!isCameraActive" class="scanner-overlay">
        <div class="scanner-frame"></div>
        <span>Camera belum aktif</span>
      </div>
    </div>

    <canvas ref="canvasRef" class="hidden-canvas"></canvas>

    <div class="scanner-actions">
      <button type="button" class="btn-primary" :disabled="isStarting || isCameraActive" @click="startCamera">
        {{ isStarting ? 'Opening...' : 'Start Camera' }}
      </button>
      <button type="button" class="btn-secondary" :disabled="!isCameraActive" @click="stopCamera">Stop Camera</button>
    </div>

    <p class="status-text">{{ statusMessage }}</p>
    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
  </section>
</template>

<style scoped>
.scanner-panel {
  display: grid;
  gap: 12px;
}

.scanner-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0 0 4px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.scanner-head h4 {
  margin: 0;
  font-size: 16px;
  color: #111827;
}

.scanner-pill {
  padding: 7px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.scanner-pill.active {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.video-shell {
  position: relative;
  min-height: 0;
  aspect-ratio: 16 / 11;
  overflow: hidden;
  border: 1px dashed #93c5fd;
  border-radius: 16px;
  background: #0f172a;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.scanner-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  gap: 14px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.68), rgba(15, 23, 42, 0.58));
  color: #e2e8f0;
  text-align: center;
}

.scanner-frame {
  width: 150px;
  height: 150px;
  border: 4px solid #38bdf8;
  border-radius: 16px;
  box-shadow: inset 0 0 0 8px rgba(56, 189, 248, 0.08);
}

.hidden-canvas {
  display: none;
}

.scanner-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  min-height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  border: 1px solid #363636;
  background: linear-gradient(270deg, #171717 0%, #363636 100%);
  color: #ffffff;
}

.btn-secondary {
  border: 1px solid #d4d4d4;
  background: #ffffff;
  color: #404040;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.status-text,
.error-text {
  margin: 0;
  color: #64748b;
}

.error-text {
  color: #b91c1c;
}

@media (max-width: 920px) {
  .scanner-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .scanner-head {
    flex-direction: column;
  }

  .video-shell {
    aspect-ratio: 4 / 3;
  }
}
</style>
