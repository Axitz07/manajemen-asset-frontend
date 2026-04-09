<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createAsset } from '../../stores/assetStore'
import { categoryItems } from '../../stores/categoryStore'

const router = useRouter()
const errorMessage = ref('')
const isSubmitting = ref(false)
const hasCategories = computed(() => categoryItems.value.length > 0)

const form = reactive({
  asset_name: '',
  asset_code: '',
  category_id: categoryItems.value[0]?.category_id ?? '',
  condition: 'Good',
  status: 'Available',
})

watch(
  categoryItems,
  (items) => {
    if (!form.category_id && items.length > 0) {
      form.category_id = items[0].category_id
    }
  },
  { immediate: true },
)

const submitForm = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  if (!hasCategories.value) {
    errorMessage.value = 'Tambahkan category terlebih dahulu sebelum membuat asset.'
    isSubmitting.value = false
    return
  }

  try {
    await createAsset(form)
    router.push('/assets')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Create</p>
    </div>

    <h1 class="page-title">Create New Asset</h1>

    <p v-if="errorMessage" class="notice">{{ errorMessage }}</p>

    <form class="form-card panel" @submit.prevent="submitForm">
      <div class="form-grid">
        <label class="field">
          <span>Asset Name</span>
          <input v-model="form.asset_name" type="text" required />
        </label>
        <label class="field">
          <span>Asset Code</span>
          <input v-model="form.asset_code" type="text" placeholder="Kosongkan untuk auto-generate" />
        </label>
        <label class="field">
          <span>Category</span>
          <select v-model="form.category_id" required>
            <option v-if="!hasCategories" value="">Belum ada category tersedia</option>
            <option v-for="item in categoryItems" :key="item.category_id" :value="item.category_id">
              {{ item.category_name }}
            </option>
          </select>
        </label>
        <label class="field">
          <span>Condition (Physical)</span>
          <select v-model="form.condition">
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
        </label>
        <label class="field">
          <span>Status (Operational)</span>
          <select v-model="form.status">
            <option>Available</option>
            <option>Broken</option>
            <option>Maintenance</option>
          </select>
        </label>
      </div>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="router.push('/assets')">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="!hasCategories || isSubmitting">
          {{ isSubmitting ? 'Saving...' : 'Save Asset' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 20px 20px 80px;
  box-sizing: border-box;
}

.breadcrumb-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 27px;
  padding-bottom: 8px;
  border-bottom: 1px solid #d4d4d4;
}

.breadcrumb,
.page-title {
  margin: 0;
}

.breadcrumb {
  font-size: 14px;
  font-weight: 600;
  color: #737373;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #404040;
}

.notice {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
}

.form-card {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
  color: #404040;
  font-weight: 700;
}

.field input,
.field select {
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  background: #ffffff;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  border: 1px solid #363636;
  background: linear-gradient(270deg, #171717 0%, #363636 100%);
  color: #ffffff;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-secondary {
  border: 1px solid #d4d4d4;
  background: #ffffff;
  color: #404040;
}

@media (max-width: 920px) {
  .page {
    padding-inline: 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
