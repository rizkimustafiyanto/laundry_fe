<template>
  <BaseModal
    v-model="modelValue"
    size="sm"
    :title="title"
    class="p-6 flex flex-col items-center text-center gap-4"
    @close="onCancel"
  >
    <div class="flex flex-col gap-4 mt-4">
      <i class="fas fa-triangle-exclamation text-5xl" :class="themeClass.icon.warning"></i>

      <p :class="themeClass.text.secondary" class="text-base leading-relaxed">
        {{ message }}
      </p>

      <div v-if="requireReason" class="w-full">
        <BaseInput
          type="textarea"
          v-model="reason"
          rows="3"
          label="Alasan"
          placeholder="Masukkan alasan"
        />
      </div>

      <div class="flex justify-center gap-3 w-full mt-2">
        <BaseButton variant="softBlue" class="flex-1" @click="onCancel">Batal</BaseButton>
        <BaseButton variant="danger" class="flex-1" @click="onConfirm">Ya, Lanjutkan</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
const themeClass = useThemeClass()
const ui = useUIStore()
const { showConfirm, confirmTitle, confirmMessage, confirmRequireReason, confirmReason } =
  storeToRefs(ui)

const modelValue = computed({
  get: () => showConfirm.value,
  set: (v) => (showConfirm.value = v),
})

const title = computed(() => confirmTitle.value || 'Konfirmasi')
const message = computed(() => confirmMessage.value)
const requireReason = computed(() => confirmRequireReason.value)
const reason = confirmReason

function onConfirm() {
  ui.confirmYes()
}
function onCancel() {
  ui.confirmNo()
}
</script>
