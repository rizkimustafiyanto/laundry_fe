<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Daftar User</h2>

    <!-- Search input -->
    <div class="mb-4">
      <input
        v-model="search"
        @change="onSearchChange"
        type="text"
        placeholder="Cari nama atau email..."
        class="border rounded px-4 py-2 w-full sm:w-64"
      />
    </div>

    <!-- Table -->
    <div>
      <table v-if="!isLoading && users.data?.length" class="min-w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal Bergabung</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in users.data"
            :key="u.id"
            class="border-t hover:bg-gray-50 cursor-pointer"
            @click="showUserDetails(u)"
          >
            <td class="px-4 py-2">{{ u.name }}</td>
            <td class="px-4 py-2">{{ u.email }}</td>
            <td class="px-4 py-2">{{ u.role }}</td>
            <td class="px-4 py-2">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Loading or Empty -->
      <div v-if="isLoading" class="text-gray-500 mb-4">Memuat data...</div>
      <div v-else-if="users.data?.length === 0" class="text-gray-500 mb-4">
        Tidak ada user ditemukan.
      </div>

      <!-- Kontrol bawah -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <!-- Total data -->
        <div class="text-sm text-gray-600">Total: {{ users.total || 0 }}</div>

        <!-- Pagination & Limit -->
        <div class="flex items-center gap-4">
          <button
            :disabled="page <= 1"
            @click="changePage(page - 1)"
            class="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            ← Prev
          </button>
          <p class="text-sm text-gray-600">Halaman {{ page }}</p>
          <button
            :disabled="page >= totalPages"
            @click="changePage(page + 1)"
            class="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            Next →
          </button>

          <select v-model="limit" @change="changeLimit" class="border rounded px-2 py-1 text-sm">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="selectedUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 class="text-xl font-semibold mb-4">Detail User</h3>
        <p><strong>Nama:</strong> {{ selectedUser.name }}</p>
        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Role:</strong> {{ selectedUser.role }}</p>
        <p>
          <strong>Tanggal Bergabung:</strong>
          {{ new Date(selectedUser.createdAt).toLocaleDateString() }}
        </p>
        <button class="mt-4 bg-red-500 text-white py-2 px-4 rounded" @click="closeUserDetails">
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/services/user.js'
import { useUIStore } from '@/stores/component/ui'

const userStore = useUserStore()
const ui = useUIStore()
const { users } = storeToRefs(userStore)

const search = ref('')
const page = ref(1)
const limit = ref(10)
const isLoading = ref(true)
const selectedUser = ref(null)

const totalPages = computed(() => {
  const total = users.value?.totalUsers || 0
  return Math.ceil(total / limit.value)
})

const loadUsers = async () => {
  isLoading.value = true
  try {
    await userStore.fetchUsers({
      page: page.value,
      limit: limit.value,
      search: search.value,
    })
  } catch (err) {
    ui.show('failed', err?.response?.data?.message || 'Gagal memuat data user')
  } finally {
    isLoading.value = false
  }
}

const onSearchChange = () => {
  page.value = 1
  loadUsers()
}

const changePage = (newPage) => {
  page.value = newPage
  loadUsers()
}

const changeLimit = () => {
  page.value = 1
  loadUsers()
}

const showUserDetails = (user) => {
  selectedUser.value = user
}

const closeUserDetails = () => {
  selectedUser.value = null
}

onMounted(loadUsers)
</script>
