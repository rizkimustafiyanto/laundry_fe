<template>
  <BaseModal v-model="modelValue" title="Buat Pesanan Laundry" size="3xl">
    <BaseCard class="space-y-4">
      <!-- Customer Selection -->
      <BaseSelect
        label="Pilih Alamat Pengambilan"
        v-model="form.pickupAddressId"
        :options="addressOption"
        placeholder="-- Pilih Alamat Pengambilan --"
        required
      />

      <BaseSelect
        v-if="form.deliveryRequested === true"
        label="Pilih Alamat Pengantaran"
        v-model="form.deliveryAddressId"
        :options="addressOption"
        placeholder="-- Pilih Alamat Pengantaran --"
        required
      />

      <!-- Pickup & Delivery -->
      <div class="flex gap-4">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.pickupRequested" disabled />
          Minta Penjemputan
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.deliveryRequested" />
          Minta Pengantaran
        </label>
      </div>

      <!-- Notes -->
      <BaseInput
        label="Catatan"
        v-model="form.notes"
        type="textarea"
        rows="3"
        placeholder="Tulis catatan tambahan..."
      />

      <!-- Laundry Items -->
      <div>
        <h3 class="font-semibold mb-2">Item Laundry</h3>
        <div
          v-for="(item, index) in form.items"
          :key="index"
          class="mb-4 p-4 border rounded-md space-y-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
        >
          <div class="grid grid-cols-2 gap-4">
            <BaseInput
              v-model="item.itemType"
              label="Jenis Item"
              placeholder="Baju, Kaos, Celana"
              required
            />
            <BaseSelect
              v-model="item.serviceType"
              label="Jenis Layanan"
              :options="serviceTypeOption"
              placeholder="-- Pilih Layanan --"
              required
            />
            <!-- <BaseInput v-model.number="item.unitPrice" type="number" label="Harga/kg" min="0" disabled /> -->
          </div>
          <BaseInput v-model.number="item.weightInKg" type="number" label="Berat (kg)" min="0" />
          <div class="text-sm text-gray-500 dark:text-gray-300">
            Subtotal: Rp {{ item.subtotal.toLocaleString() }}
          </div>
          <div class="text-right">
            <BaseButton label="Hapus Item" variant="danger" @click="removeItem(index)" />
          </div>
        </div>
        <BaseButton label="+ Tambah Item" variant="outline" class="w-full" @click="addItem" />
      </div>

      <!-- Payment -->
      <div class="mt-4 space-y-2">
        <h3 class="font-semibold">Pembayaran</h3>
        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model.number="form.payment.amountPaid"
            label="Jumlah Dibayar"
            type="number"
          />
          <BaseSelect
            v-model="form.payment.paymentMethod"
            label="Metode Pembayaran"
            :options="[
              { label: 'Tunai', value: 'CASH' },
              { label: 'Transfer', value: 'TRANSFER' },
              { label: 'E-Wallet', value: 'EWALLET' },
            ]"
            placeholder="-- Pilih Metode --"
          />
        </div>
        <BaseInput
          v-model="form.payment.note"
          label="Catatan Pembayaran (opsional)"
          placeholder="Tulis jika ada catatan..."
          type="textarea"
        />
      </div>

      <!-- Submit -->
      <div class="pt-4 text-right">
        <BaseButton label="Simpan Pesanan" @click="submitOrder" />
      </div>
    </BaseCard>
  </BaseModal>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/stores/services/order'
import { useUserStore } from '@/stores/services/user'
import { useAuthStore } from '@/stores/auth/auth'

const modelValue = defineModel()
const orderStore = useOrderStore()
const userStore = useUserStore()

const { user } = storeToRefs(useAuthStore())

const serviceTypeOption = computed(() => {
  return Array.isArray(orderStore.serviceTypeList) ? orderStore.serviceTypeList : []
})

const addressOption = computed(() => {
  return userStore.addresses.map((a) => ({
    value: a.id,
    label: `${a.address_line}, ${a.label} (${a.notes})`,
  }))
})

const form = reactive({
  customerId: user.value.id,
  pickupRequested: true,
  deliveryRequested: false,
  pickupAddressId: '',
  deliveryAddressId: '',
  notes: '',
  items: [],
  payment: {
    amountPaid: 0,
    paymentMethod: '',
    note: '',
  },
})

const addItem = () => {
  form.items.push({
    itemType: '',
    serviceType: '',
    weightInKg: 0,
    unitPrice: 0,
    get subtotal() {
      return Math.round(this.weightInKg * this.unitPrice)
    },
  })
}

const removeItem = (index) => {
  form.items.splice(index, 1)
}

const submitOrder = async () => {
  const preparedItems = form.items.map((item) => ({
    itemType: item.itemType,
    serviceType: item.serviceType,
    weightInKg: item.weightInKg,
    unitPrice: item.unitPrice,
    subtotal: Math.round(item.weightInKg * item.unitPrice),
  }))

  const payload = {
    customerId: form.customerId,
    pickupRequested: form.pickupRequested,
    ...(form.pickupRequested
      ? {
          pickupAddressId: form.pickupAddressId,
        }
      : {}),
    deliveryRequested: form.deliveryRequested,
    ...(form.deliveryRequested
      ? {
          deliveryAddressId: form.deliveryAddressId,
        }
      : {}),
    notes: form.notes,
    items: preparedItems,
    ...(form.payment.paymentMethod
      ? {
          paymentData: form.payment,
        }
      : {}),
  }

  await orderStore.createOrder(payload)
  modelValue.value = false
}

onMounted(async () => {
  await userStore.fetchUsers()
  await orderStore.fetchServiceType()
})
</script>
