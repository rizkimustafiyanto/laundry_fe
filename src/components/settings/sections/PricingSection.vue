<template>
  <div>
    <BaseLoadingSpinner v-if="isPrepare" type="mini" />

    <div v-else>
      <h2 class="text-xl font-semibold mb-4" :class="themeClass.text.secondary">
        Pricing Settings
      </h2>

      <BaseCard variant="dark" class="p-4 space-y-4 mb-6">
        <BaseSelect
          label="Tipe Layanan"
          v-model="pricingForm.serviceTypeId"
          :options="serviceTypeStore.options"
          placeholder="-- Pilih Layanan --"
        />

        <BaseSelect
          label="Tipe Item"
          v-model="pricingForm.itemTypeId"
          :options="itemTypeStore.options"
          placeholder="-- Pilih Item --"
        />

        <BaseInput
          label="Harga per Kg"
          v-model.number="pricingForm.pricePerKg"
          type="number"
          min="0"
          placeholder="Contoh: 10000"
        />

        <div class="flex justify-end gap-2">
          <BaseButton label="Reset" variant="secondary" @click="resetPricingForm" />
          <BaseButton
            :label="pricingForm.id ? 'Update' : 'Simpan'"
            variant="teal"
            @click="savePricing"
          />
        </div>
      </BaseCard>

      <BaseCard variant="dark" class="p-4">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr :class="themeClass.text.secondary">
              <th class="text-left p-2">Layanan</th>
              <th class="text-left p-2">Item</th>
              <th class="text-left p-2">Harga / Kg</th>
              <th class="text-right p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(items, service) in groupedPricing" :key="service">
              <tr class="bg-gray-800/50">
                <td class="p-2 font-semibold" colspan="4">{{ service }}</td>
              </tr>

              <tr v-for="price in items" :key="price.id" class="border-t border-gray-700">
                <td class="p-2"></td>
                <td class="p-2">{{ price.itemType?.name }}</td>
                <td class="p-2">{{ price.pricePerKg.toLocaleString() }}</td>
                <td class="p-2 text-right space-x-2">
                  <BaseButton
                    size="sm"
                    variant="secondary"
                    label="Edit"
                    @click="editPricing(price)"
                  />
                  <BaseButton
                    size="sm"
                    variant="danger"
                    label="Hapus"
                    @click="deletePricing(price.id)"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </BaseCard>

      <h2 class="text-xl font-semibold mt-8 mb-4" :class="themeClass.text.secondary">
        Charges Settings
      </h2>

      <BaseCard variant="dark" class="p-4 space-y-6">
        <div
          v-for="cat in chargeCategoryStore.items"
          :key="cat"
          class="border-b pb-4 last:border-b-0"
          :class="themeClass.border.secondary"
        >
          <h3 class="font-semibold mb-2">{{ cat }}</h3>

          <BaseSelect
            label="Tipe"
            v-model="chargesForm[cat].type"
            :options="chargeTypeStore.options"
            placeholder="-- Pilih Tipe --"
          />

          <BaseInput
            label="Value"
            v-model.number="chargesForm[cat].value"
            type="number"
            min="0"
            placeholder="Contoh: 10 (persen) / 5000 (fixed)"
          />

          <div class="flex items-center gap-2 mt-2">
            <label :class="themeClass.text.secondary">Status</label>
            <BaseSwitch v-model="chargesForm[cat].isEnabled" />
            <span>{{ chargesForm[cat].isEnabled ? 'Aktif' : 'Non Aktif' }}</span>
          </div>

          <div class="flex justify-end gap-2 mt-3">
            <BaseButton label="Simpan" variant="teal" @click="saveCharge(cat)" />
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
const themeClass = useThemeClass()

const pricingStore = usePricingStore()
const serviceTypeStore = useServiceTypeStore()
const itemTypeStore = useItemTypeStore()
const chargeStore = useChargeStore()
const chargeCategoryStore = useChargeCategoryStore()
const chargeTypeStore = useChargeTypeStore()

const isPrepare = ref(true)

const pricingForm = reactive({
  id: null,
  serviceTypeId: '',
  itemTypeId: '',
  pricePerKg: 0,
})

const resetPricingForm = () => {
  pricingForm.id = null
  pricingForm.serviceTypeId = ''
  pricingForm.itemTypeId = ''
  pricingForm.pricePerKg = 0
}

const savePricing = async () => {
  pricingStore.formPayload = { ...pricingForm }
  if (pricingForm.id) {
    await pricingStore.updateItem(pricingForm.id)
  } else {
    await pricingStore.createItem()
  }
  resetPricingForm()
}

const editPricing = (price) => {
  pricingForm.id = price.id
  pricingForm.serviceTypeId = price.serviceTypeId
  pricingForm.itemTypeId = price.itemTypeId
  pricingForm.pricePerKg = price.pricePerKg
}

const deletePricing = async (id) => {
  await pricingStore.deleteItem(id)
}

const groupedPricing = computed(() => {
  const groups = {}
  pricingStore.items.forEach((price) => {
    const service = price.serviceType?.name || 'Tanpa Layanan'
    if (!groups[service]) groups[service] = []
    groups[service].push(price)
  })
  return groups
})

const chargesForm = reactive({})

const loadCharges = async () => {
  await chargeCategoryStore.fetch()
  await chargeTypeStore.fetch()
  await chargeStore.fetchItems()

  chargeCategoryStore.items.forEach((cat) => {
    const existing = chargeStore.items.find((c) => c.category === cat)
    chargesForm[cat] = existing
      ? { ...existing }
      : { category: cat, type: '', value: 0, isEnabled: true }
  })
}

const saveCharge = async (cat) => {
  await chargeStore.upsertCharge(chargesForm[cat])
}

onMounted(async () => {
  try {
    await Promise.all([
      serviceTypeStore.fetchItems(),
      itemTypeStore.fetchItems(),
      pricingStore.fetchItems(),
    ])
    await loadCharges()
  } finally {
    isPrepare.value = false
  }
})
</script>
