<script setup>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  assetName: {
    type: String,
    default: 'Asset',
  },
  qrValue: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    default: 'QR code ini siap dicetak dan ditempel pada asset fisik.',
  },
  size: {
    type: Number,
    default: 220,
  },
})

const qrDataUrl = ref('')
const errorMessage = ref('')

const createFileName = () =>
  `${String(props.assetName || 'asset')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'asset'}-qr.png`

const generateCode = async () => {
  if (!props.qrValue) {
    qrDataUrl.value = ''
    return
  }

  try {
    qrDataUrl.value = await QRCode.toDataURL(props.qrValue, {
      width: props.size,
      margin: 1,
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    })
    errorMessage.value = ''
  } catch {
    errorMessage.value = 'QR code gagal digenerate.'
  }
}

watch(() => [props.qrValue, props.size], generateCode, { immediate: true })

const downloadQr = () => {
  if (!qrDataUrl.value || typeof window === 'undefined') return

  const link = window.document.createElement('a')
  link.href = qrDataUrl.value
  link.download = createFileName()
  link.click()
}

const printQr = () => {
  if (!qrDataUrl.value || typeof window === 'undefined') return

  const printWindow = window.open('', '_blank', 'width=720,height=900')

  if (!printWindow) {
    errorMessage.value = 'Popup diblokir browser. Izinkan popup untuk print QR.'
    return
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Print QR ${props.assetName}</title>
        <style>
          body {
            margin: 0;
            padding: 32px;
            font-family: Arial, sans-serif;
            color: #111827;
          }
          .sheet {
            display: grid;
            place-items: center;
            gap: 12px;
            padding: 24px;
            border: 1px dashed #cbd5e1;
          }
          img {
            width: 260px;
            height: 260px;
            object-fit: contain;
          }
          h1, p {
            margin: 0;
            text-align: center;
          }
          h1 {
            font-size: 22px;
          }
          p {
            font-size: 15px;
          }
        </style>
      </head>
      <body>
        <section class="sheet">
          <img src="${qrDataUrl.value}" alt="QR ${props.assetName}" />
          <h1>${props.assetName}</h1>
          <p>${props.qrValue}</p>
        </section>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}
</script>

<template>
  <section class="qr-card">
    <div class="qr-surface">
      <img v-if="qrDataUrl" :src="qrDataUrl" :alt="`QR ${assetName}`" class="qr-image" />
      <div v-else class="qr-empty">QR belum tersedia</div>
    </div>

    <div class="qr-meta">
      <strong>{{ assetName }}</strong>
      <span>{{ qrValue || '-' }}</span>
      <p>{{ errorMessage || caption }}</p>
    </div>

    <div class="qr-actions">
      <button type="button" class="btn-secondary" :disabled="!qrDataUrl" @click="downloadQr">Download PNG</button>
      <button type="button" class="btn-primary" :disabled="!qrDataUrl" @click="printQr">Print QR</button>
    </div>
  </section>
</template>

<style scoped>
.qr-card {
  display: grid;
  gap: 12px;
}

.qr-surface {
  display: grid;
  place-items: center;
  min-height: 230px;
  padding: 14px;
  border: 1px solid #dbe4ee;
  border-radius: 16px;
  background: #ffffff;
}

.qr-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.qr-empty,
.qr-meta span,
.qr-meta p {
  color: #64748b;
}

.qr-meta {
  display: grid;
  gap: 6px;
  padding: 0 4px;
}

.qr-meta strong,
.qr-meta span,
.qr-meta p {
  margin: 0;
}

.qr-meta strong {
  font-size: 15px;
  color: #111827;
}

.qr-meta span {
  font-variant-numeric: tabular-nums;
  word-break: break-all;
}

.qr-meta p {
  line-height: 1.6;
}

.qr-actions {
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

@media (max-width: 920px) {
  .qr-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .qr-surface {
    min-height: 220px;
  }
}
</style>
