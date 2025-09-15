export function getValidOptions(services, items, pricing) {
  const validServiceIds = new Set(pricing.map((p) => p.serviceTypeId))
  const validItemIds = new Set(pricing.map((p) => p.itemTypeId))

  const validServices = services
    .filter((s) => validServiceIds.has(s.id))
    .map((s) => ({ label: s.name, value: s.id }))

  const validItems = items
    .filter((i) => validItemIds.has(i.id))
    .map((i) => ({ label: i.name, value: i.id }))

  const validMap = pricing.reduce((map, p) => {
    if (!map[p.serviceTypeId]) map[p.serviceTypeId] = new Set()
    map[p.serviceTypeId].add(p.itemTypeId)
    return map
  }, {})

  return { validServices, validItems, validMap }
}

export function useValidOptions(serviceStore, itemStore, pricingStore) {
  const validOptions = computed(() =>
    getValidOptions(serviceStore.items, itemStore.items, pricingStore.items),
  )

  const serviceTypeOption = computed(() => validOptions.value.validServices)
  const itemTypeOption = computed(() => validOptions.value.validItems)

  const getItemsForService = (serviceId) => {
    const allowedItemIds = validOptions.value.validMap[serviceId] || new Set()
    return validOptions.value.validItems.filter((i) => allowedItemIds.has(i.value))
  }

  return {
    serviceTypeOption,
    itemTypeOption,
    getItemsForService,
  }
}
