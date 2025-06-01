<template>
  <BaseCard type="single" variant="primary">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Alamat Order</h2>
      <BaseButton
        @click="$emit('toggle-address-form')"
        :label="addressFormVisible ? 'Batal' : 'Tambah Alamat'"
        :variant="addressFormVisible ? 'danger' : 'secondary'"
        class="w-40"
      />
    </div>

    <div v-if="addressFormVisible" class="mb-6">
      <slot name="address-form" />
    </div>

    <div v-if="addresses.length === 0" class="text-gray-500">Belum ada alamat tambahan.</div>

    <ul v-else class="space-y-4">
      <li
        v-for="address in addresses"
        :key="address.id"
        class="border p-4 rounded shadow-sm flex justify-between items-start"
      >
        <div>
          <h3 class="font-semibold text-lg">{{ address.label }}</h3>
          <p><strong>Nama Penerima:</strong> {{ address.recipientName }}</p>
          <p><strong>No. Telepon:</strong> {{ address.recipientPhone }}</p>
          <p class="whitespace-pre-line">{{ address.addressDetail }}</p>
        </div>
        <div class="space-x-2">
          <BaseButton
            @click="$emit('edit-address', address)"
            label="Edit"
            variant="primary"
            class="w-40"
          />
          <BaseButton
            @click="$emit('delete-address', address.id)"
            label="Hapus"
            variant="danger"
            class="w-40"
          />
        </div>
      </li>
    </ul>
  </BaseCard>
</template>

<script setup>
defineProps({
  addresses: Array,
  addressFormVisible: Boolean,
})

defineEmits(['toggle-address-form', 'edit-address', 'delete-address'])
</script>
