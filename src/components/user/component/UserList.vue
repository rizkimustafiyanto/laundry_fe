<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Daftar User</h2>

    <BaseTable
      :items="users.data"
      :headers="['Nama', 'Role', 'Tanggal Bergabung', 'Action']"
      :loading="isMiniLoading"
      :pagination="{ page: page, limit: limit, total: users.total, from: fromIndex, to: toIndex }"
      v-model="search"
      @search="onSearchChange"
      @page-change="changePage"
    >
      <template #default="{ items }">
        <tr
          v-for="u in items"
          :key="u.id"
          class="border-b"
          :class="[themeClass.trHover, themeClass.borderColor]"
        >
          <td
            class="flex items-center px-6 py-4 whitespace-nowrap cursor-pointer"
            @click="showUserDetails(u)"
          >
            <img class="w-10 h-10 rounded-full" :src="u.photo || defaultAvatar" />
            <div class="ps-3">
              <div :class="themeClass.labelName">{{ u.name }}</div>
              <div :class="themeClass.labelMail">{{ u.email }}</div>
            </div>
          </td>
          <td class="px-6 py-4">{{ u.role }}</td>
          <td class="px-6 py-4">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
          <td class="px-6 py-4">
            <a href="#" class="text-blue-600 hover:underline" @click.prevent="openEditModal(u)"
              >Edit</a
            >
          </td>
        </tr>
      </template>
    </BaseTable>

    <UserDetail
      v-if="selectedUser && showDetail"
      :user="selectedUser"
      :show="showDetail"
      @close="showDetail = false"
    />

    <EditUserModal
      v-if="editUser"
      :visible="showEditModal"
      :user="editUser"
      :showRole="true"
      @close="closeEditModal"
      @save="saveEditedUser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/services/user.js'
import { useUIStore } from '@/stores/component/ui'
import { useLoadingStore } from '@/stores/component/loading'
import EditUserModal from '@/components/user/modal/UserEdit.vue'
import UserDetail from '@/components/user/modal/UserDetail.vue'
import defaultAvatar from '@/assets/icons/user.png'
import { useThemeClass } from '@/composables/useThemeClass.js'

const { themeClass } = useThemeClass()
const userStore = useUserStore()
const ui = useUIStore()
const loading = useLoadingStore()
const { users } = storeToRefs(userStore)

const search = ref('')
const page = ref(1)
const limit = ref(10)
const selectedUser = ref(null)

const fromIndex = computed(() => (page.value - 1) * limit.value + 1)
const toIndex = computed(() => Math.min(fromIndex.value + limit.value - 1, users.value?.total || 0))
const isMiniLoading = computed(() => loading.isMiniLoading)

const loadUsers = async () => {
  loading.startMini()
  try {
    await userStore.fetchUsers({
      page: page.value,
      limit: limit.value,
      search: search.value,
    })
  } catch (err) {
    ui.show('failed', err?.response?.data?.message || 'Gagal memuat data user')
  } finally {
    loading.stopMini()
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

const showDetail = ref(false)
const showUserDetails = (user) => {
  selectedUser.value = user
  showDetail.value = true
}

const showEditModal = ref(false)
const editUser = ref(null)

const openEditModal = (user) => {
  editUser.value = { ...user }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editUser.value = null
}

const saveEditedUser = async (updatedUser) => {
  loading.startMini()
  try {
    await userStore.updateUserById(updatedUser.id, updatedUser)
    ui.show('success', 'User berhasil diperbarui')
    loadUsers()
  } catch (err) {
    ui.show('failed', err?.response?.data?.message || 'Gagal memperbarui user')
  } finally {
    loading.stopMini()
    closeEditModal()
  }
}

onMounted(async () => {
  loading.start()
  try {
    await loadUsers()
  } finally {
    loading.stop()
  }
})
</script>
