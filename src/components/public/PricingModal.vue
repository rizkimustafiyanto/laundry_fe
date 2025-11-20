<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999]"
  >
    <div class="absolute inset-0" @click="close"></div>

    <div
      class="relative bg-[#0D0D0D] border border-[#C6A667]/30 rounded-3xl p-8 w-[90%] max-w-md shadow-[0_0_40px_rgba(198,166,103,0.25)] animate-modal"
    >
      <button
        @click="close"
        class="absolute top-3 right-4 text-[#C6A667] hover:text-white text-2xl transition"
      >
        ✕
      </button>

      <h2 class="text-3xl text-[#C6A667] font-bold mb-4 text-center">
        {{ formatText(price?.serviceType?.name) }}
      </h2>
      <h2 class="text-3xl text-[#C6A667] font-bold mb-4 text-center">
        {{ formatText(price?.itemType?.name) }}
      </h2>

      <div class="text-center mb-6">
        <p class="text-[#D4D4D4] text-sm opacity-80">Harga per Kg</p>
        <p class="text-3xl font-extrabold text-[#C6A667]">
          Rp {{ price?.pricePerKg?.toLocaleString('id-ID') }}
        </p>
      </div>

      <div class="text-[#D4D4D4] leading-relaxed text-center mb-6">
        <p v-if="price?.itemType?.description">
          <strong class="text-[#C6A667]">Deskripsi:</strong><br />
          <span> {{ price?.itemType?.description }}<br /> </span>
        </p>

        <p v-else class="text-[#777] italic">Tidak ada deskripsi yang tersedia.</p>
      </div>

      <button
        @click="sendWhatsApp"
        class="w-full bg-[#C6A667] hover:bg-[#9E864F] text-[#0D0D0D] font-bold py-3 rounded-xl text-lg shadow-md transition-all hover:-translate-y-1"
      >
        Order via WhatsApp
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  price: Object,
  baseUrl: { type: String },
  whatsappNumber: { type: String, default: '6281234567890' },
})

const emits = defineEmits(['update:modelValue'])

const close = () => {
  emits('update:modelValue', false)
}

const sendWhatsApp = () => {
  if (!props.price) return

  const item = props.price.itemType?.name || '-'
  const service = props.price.serviceType?.name || '-'
  const price = props.price.pricePerKg.toLocaleString('id-ID')

  const text = `Halo, saya ingin pesan layanan *${service}* untuk *${item}*\nHarga per Kg: Rp ${price}`
  const url = `https://wa.me/${props.whatsappNumber}?text=` + encodeURIComponent(text)

  window.open(url, '_blank')
}
</script>

<style scoped>
@keyframes modal-pop {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-modal {
  animation: modal-pop 0.35s ease-out;
}
</style>
