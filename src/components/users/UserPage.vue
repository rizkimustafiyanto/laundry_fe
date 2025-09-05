<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Daftar User</h2>

    <BaseCard variant="glass">
      <BaseTable
        :items="users"
        :columns="columns"
        :loading="loading"
        :pagination="userStore.meta"
        searchable
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
        @search="handleSearch"
      >
        <template #name_email="{ item }">
          <div class="flex items-center cursor-pointer" @click="showUserDetails(item)">
            <img class="w-10 h-10 rounded-full" :src="item.photo ?? defaultAvatar" />
            <div class="ps-3">
              <div :class="themeClass.labelName">{{ item.name }}</div>
              <div :class="themeClass.labelMail">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <template #createdAt="{ value }">
          {{ formatDate(value) }}
        </template>

        <template #role="{ value }">
          {{ formatText(value) }}
        </template>

        <template #actions="{ item }">
          <BaseButton size="sm" @click="openEditModal(item)" variant="secondary" icon="pen" />
        </template>
      </BaseTable>

      <UserDetail
        v-if="selectedUser && showDetail"
        :user="selectedUser"
        :show="showDetail"
        @close="showDetail = false"
      />

      <EditUserModal
        v-model="showEditModal"
        :user="selectedUser"
        :showRole="true"
        @save="saveEditedUser"
      />
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/services/user.service.js'
import { useLoadingStore } from '@/stores/utils/loading'
import EditUserModal from '@/components/users/modal/UserEdit.vue'
import UserDetail from '@/components/users/modal/UserDetail.vue'
import defaultAvatar from '@/assets/icons/user.png'
import { useThemeClass } from '@/composables/useThemeClass.js'
import { formatDate, formatText } from '@/utils/formatters'
import BaseCard from '../BaseCard.vue'

const { themeClass } = useThemeClass()
const userStore = useUserStore()
const loadingStore = useLoadingStore()
const { users } = storeToRefs(userStore)

const search = ref('')
const page = ref(1)
const limit = ref(10)
const selectedUser = ref(null)

const loading = computed(() => loadingStore.isMiniLoading)

const showDetail = ref(false)

const columns = [
  { key: 'name_email', label: 'Name' },
  { key: 'role', label: 'Access Level' },
  { key: 'createdAt', label: 'Join Date' },
  { key: 'actions', label: 'Actions' },
]

const loadUsers = async () => {
  await userStore.fetchUsers({
    page: page.value,
    limit: limit.value,
    search: search.value,
  })
}

function handlePageChange(newPage) {
  userStore.fetchUsers({ page: newPage })
}

const handleLimitChange = (newLimit) => {
  userStore.fetchUsers({ page: 1, limit: newLimit })
}

const handleSearch = (search) => {
  userStore.fetchUsers({ page: 1, search: search })
}

const showUserDetails = (user) => {
  selectedUser.value = user
  showDetail.value = true
}

const showEditModal = ref(false)

const openEditModal = (user) => {
  selectedUser.value = user
  showEditModal.value = true
}

const saveEditedUser = async (updatedUser) => {
  await userStore.updateUser(updatedUser.id, updatedUser)
}

onMounted(async () => {
  loadingStore.start()
  try {
    await loadUsers()
  } finally {
    loadingStore.stop()
  }
})
</script>
