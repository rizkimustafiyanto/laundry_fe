<template>
  <div>
    <BaseLoadingSpinner v-if="isPrepare" type="mini" />

    <div v-else>
      <h2
        class="text-xl font-semibold mb-4 flex items-center gap-2"
        :class="themeClass.text.secondary"
      >
        <i :class="['fa-solid fa-tag', themeClass.icon.primary]"></i>
        Pricing Settings
      </h2>

      <BaseCard variant="dark" class="p-6 space-y-5 mb-8 rounded-xl shadow-sm">
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

        <div class="flex justify-end gap-3 pt-4 border-t" :class="themeClass.border.secondary">
          <BaseButton
            label="Reset"
            variant="secondary"
            icon="fa-solid fa-rotate-left"
            @click="resetPricingForm"
          />
          <BaseButton
            :label="pricingForm.id ? 'Update' : 'Simpan'"
            variant="teal"
            :icon="pricingForm.id ? 'fa-solid fa-pen' : 'fa-solid fa-floppy-disk'"
            @click="savePricing"
          />
        </div>
      </BaseCard>

      <BaseCard variant="dark" class="p-6 rounded-xl shadow-sm space-y-6">
        <template v-for="(items, service) in groupedPricing" :key="service">
          <h3 class="text-lg font-semibold mb-2" :class="themeClass.text.secondary">
            {{ formatText(service) }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <BaseCard
              v-for="price in items"
              :key="price.id"
              variant="dark"
              class="p-4 rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="font-semibold" :class="themeClass.text.secondary">
                  {{ formatText(price.itemType?.name) }}
                </span>
                <div class="space-x-1">
                  <BaseButton
                    size="sm"
                    variant="secondary"
                    icon="fa-solid fa-pen"
                    @click="editPricing(price)"
                  />
                  <BaseButton
                    size="sm"
                    variant="danger"
                    icon="fa-solid fa-trash"
                    @click="deletePricing(price.id)"
                  />
                </div>
              </div>

              <p class="text-sm" :class="themeClass.text.secondary">
                Harga / Kg: <span class="font-bold">{{ formatCurrency(price.pricePerKg) }}</span>
              </p>
            </BaseCard>
          </div>
        </template>
      </BaseCard>

      <h2
        class="text-xl font-semibold mt-10 mb-4 flex items-center gap-2"
        :class="themeClass.text.secondary"
      >
        <i :class="['fa-solid fa-file-invoice-dollar', themeClass.icon.primary]"></i>
        Charges Settings
      </h2>

      <BaseCard variant="dark" class="p-6 space-y-6 rounded-xl shadow-sm">
        <div
          v-for="cat in chargeCategoryStore.items"
          :key="cat"
          class="pb-5 last:pb-0 border-b last:border-b-0 space-y-3"
          :class="themeClass.border.secondary"
        >
          <h3 class="font-semibold flex items-center gap-2" :class="themeClass.text.secondary">
            <i :class="['fa-solid fa-layer-group', themeClass.icon.secondary]"></i>
            {{ cat }}
          </h3>

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

          <div class="flex items-center gap-3 mt-2">
            <label class="text-sm" :class="themeClass.text.secondary">Status</label>
            <BaseSwitch v-model="chargesForm[cat].isEnabled" />
            <span :class="themeClass.text.secondary">
              {{ chargesForm[cat].isEnabled ? 'Aktif' : 'Non Aktif' }}
            </span>
          </div>

          <div class="flex justify-end mt-4">
            <BaseButton
              label="Simpan"
              variant="teal"
              icon="fa-solid fa-floppy-disk"
              @click="saveCharge(cat)"
            />
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
