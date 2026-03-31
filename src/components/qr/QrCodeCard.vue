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
  </section>
</template>

<style scoped>
.qr-card {
  display: grid;
  gap: 16px;
}

.qr-surface {
  display: grid;
  place-items: center;
  min-height: 252px;
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 16px;
  background: #ffffff;
}

.qr-image {
  width: 220px;
  height: 220px;
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
}

.qr-meta strong,
.qr-meta span,
.qr-meta p {
  margin: 0;
}
</style>
