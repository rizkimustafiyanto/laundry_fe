<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Company Sponsor</h2>

    <form @submit.prevent="submitForm" enctype="multipart/form-data" class="space-y-4">
      <input
        v-model="formPayload.name"
        placeholder="Sponsor Name"
        class="w-full p-2 border rounded"
      />
      <input
        v-model="formPayload.website"
        placeholder="Website"
        class="w-full p-2 border rounded"
      />
      <input type="file" @change="handleFileUpload" class="w-full" />

      <div class="flex space-x-2">
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {{ item?.id ? 'Update' : 'Create' }}
        </button>
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </form>

    <ul class="mt-6 space-y-2">
      <li
        v-for="s in items"
        :key="s.id"
        class="flex justify-between items-center p-2 border rounded"
      >
        <div class="flex items-center space-x-2">
          <img v-if="s.logo" :src="s.logo" alt="logo" class="w-12 h-12 object-cover rounded" />
          <span>{{ s.name }} - {{ s.website }}</span>
        </div>
        <div class="space-x-2">
          <button @click="edit(s.id)" class="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500">
            Edit
          </button>
          <button
            @click="deleteItem(s.id)"
            class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const store = useCompanySponsorStore()
const { items, formPayload, item } = storeToRefs(store)

const submitForm = async () => {
  const payload = new FormData()
  for (const key in formPayload.value) payload.append(key, formPayload.value[key])

  if (item.value?.id) await store.updateItemWithFormData(item.value.id, payload)
  else await store.createItemWithFormData(payload)
}

const resetForm = () => store.resetForm()
const edit = (id) => store.fetchItemById(id)
const handleFileUpload = (e) => {
  formPayload.value.logo = e.target.files[0]
}

store.fetchItems()
</script>
