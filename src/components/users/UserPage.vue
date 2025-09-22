<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Daftar User</h2>

    <BaseCard variant="secondary">
      <BaseTable
        :items="items"
        :columns="columns"
        :loading="isLoading"
        :pagination="userStore.meta"
        searchable
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
        @search="handleSearch"
      >
        <template #name_email="{ item }">
          <div class="flex items-center cursor-pointer" @click="showUserDetails(item.id)">
            <img
              class="w-10 h-10 rounded-full"
              :src="`${__BASE_URL__}${item.photo}`"
              @error="$event.target.src = defaultAvatar"
            />
            <div class="ps-3">
              <div :class="themeClass.text.dark">{{ item.name }}</div>
              <div :class="themeClass.text.stone">{{ item.email }}</div>
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
          <BaseButton size="sm" @click="openEditModal(item.id)" variant="secondary" icon="pen" />
        </template>
      </BaseTable>

      <UserDetail
        v-if="item && showDetail && !isMiniLoading"
        :user="item"
        :show="showDetail"
        @close="showDetail = false"
      />

      <EditUserModal v-model="showEditModal" :showRole="true" @save="saveEditedUser" />
    </BaseCard>
  </div>
</template>

<script setup>
import EditUserModal from '@/components/users/modal/UserEdit.vue'
import UserDetail from '@/components/users/modal/UserDetail.vue'
import defaultAvatar from '@/assets/icons/user.png'
import BaseCard from '../BaseCard.vue'

const themeClass = useThemeClass()
const userStore = useUserStore()
const loadingStore = useLoadingStore()
const { items, item } = storeToRefs(userStore)
const { isLoading, isMiniLoading } = storeToRefs(loadingStore)

const showDetail = ref(false)

const columns = [
  { key: 'name_email', label: 'Name' },
  { key: 'role', label: 'Access Level' },
  { key: 'createdAt', label: 'Join Date' },
  { key: 'actions', label: 'Actions' },
]

const loadUsers = async () => {
  await userStore.fetchItems()
}

function handlePageChange(newPage) {
  userStore.fetchItems({ page: newPage })
}

const handleLimitChange = (newLimit) => {
  userStore.fetchItems({ page: 1, limit: newLimit })
}

const handleSearch = (search) => {
  userStore.fetchItems({ page: 1, search: search })
}

const showUserDetails = (userId) => {
  userStore.fetchItemById(userId)
  showDetail.value = true
}

const showEditModal = ref(false)

const openEditModal = (userId) => {
  userStore.fetchItemById(userId)
  showEditModal.value = true
}

const saveEditedUser = async () => {
  await userStore.updateItem(userStore.formPayload.id)
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
