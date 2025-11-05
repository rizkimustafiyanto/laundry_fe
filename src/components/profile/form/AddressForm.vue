<template>
  <BaseModal
    v-model="modalOpen"
    :title="mode === 'create' ? 'Tambah Alamat' : 'Edit Alamat'"
    size="md"
  >
    <form @submit.prevent="submitForm" class="flex flex-col gap-3">
      <BaseInput
        id="label"
        label="Label Alamat"
        v-model="store.formPayload.label"
        placeholder="(Contoh: Rumah, Kantor)"
        required
      />
      <BaseInput
        id="addressLine"
        label="Detail Alamat"
        type="textarea"
        v-model="store.formPayload.addressLine"
        placeholder="Silahkan masukkan detail alamat"
        rows="3"
        required
      />
      <BaseInput
        id="notes"
        label="Catatan"
        v-model="store.formPayload.notes"
        placeholder="Masukkan Catatan"
      />

      <div class="h-64 w-full rounded-lg border">
        <div ref="mapContainer" class="h-full w-full rounded-lg"></div>
      </div>

      <div class="flex gap-2">
        <BaseInput
          id="latitude"
          label="Latitude"
          placeholder="Latitude"
          v-model="store.formPayload.latitude"
          readonly
        />
        <BaseInput
          id="longitude"
          label="Longitude"
          placeholder="Longitude"
          v-model="store.formPayload.longitude"
          readonly
        />
      </div>

      <BaseButton type="submit" label="Simpan" variant="success" class="w-full mt-4" />
    </form>
  </BaseModal>
</template>

<script setup>
import L from 'leaflet'
const props = defineProps({
  mode: { type: String, required: true },
})
const emit = defineEmits(['save', 'edit'])
const modalOpen = defineModel()

const store = useAddressStore()
const mapContainer = ref(null)

let map = null
let marker = null

watch(modalOpen, async (val) => {
  if (val) {
    await nextTick()
    initMap()
  } else {
    if (map) {
      map.remove()
      map = null
      marker = null
    }
  }
})

function initMap() {
  if (!mapContainer.value) return

  const defaultLat = -7.250445
  const defaultLng = 112.768845

  const initialLat = store.formPayload.latitude || defaultLat
  const initialLng = store.formPayload.longitude || defaultLng

  map = L.map(mapContainer.value).setView([initialLat, initialLng], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    store.formPayload.latitude = lat
    store.formPayload.longitude = lng
    setMarker([lat, lng])
  })

  if (store.formPayload.latitude && store.formPayload.longitude) {
    setMarker([store.formPayload.latitude, store.formPayload.longitude])
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          store.formPayload.latitude = latitude
          store.formPayload.longitude = longitude
          setMarker([latitude, longitude])
        },
        () => {
          store.formPayload.latitude = defaultLat
          store.formPayload.longitude = defaultLng
          setMarker([defaultLat, defaultLng])
        },
      )
    } else {
      store.formPayload.latitude = defaultLat
      store.formPayload.longitude = defaultLng
      setMarker([defaultLat, defaultLng])
    }
  }

  map.whenReady(() => map.invalidateSize())
}

function setMarker([lat, lng]) {
  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map)
    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng()
      store.formPayload.latitude = lat
      store.formPayload.longitude = lng
    })
  }
  map.setView([lat, lng], 15)
}

function submitForm() {
  modalOpen.value = false
  emit(props.mode === 'create' ? 'save' : 'edit')
}
</script>
