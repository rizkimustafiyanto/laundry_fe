<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-2" :class="themeClass.text.secondary">
      <i :class="['fa-solid fa-users', themeClass.icon.primary]"></i>
      Daftar User
    </h2>

    <BaseCard variant="secondary" class="shadow-sm rounded-xl">
      <BaseTable
        :items="items"
        :columns="columns"
        :loading="isLoading"
        :pagination="userStore.meta"
        searchable
        exportable
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
        @search="handleSearch"
      >
        <template #name_email="{ item }">
          <div
            class="flex items-center gap-3 cursor-pointer group"
            @click="showUserDetails(item.id)"
          >
            <img
              class="w-12 h-12 rounded-full object-cover ring-2"
              :class="themeClass.border.airy"
              :src="`${__BASE_URL__}${item.photo}`"
              @error="$event.target.src = defaultAvatar"
            />
            <div>
              <div class="font-semibold" :class="themeClass.text.dark">
                {{ item.name }}
              </div>
              <div class="text-sm" :class="themeClass.text.stone">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>

        <template #createdAt="{ value }">
          <span :class="themeClass.text.secondary">
            {{ formatDate(value) }}
          </span>
        </template>

        <template #role="{ value }">
          <BaseBadge
            variant-text="secondary"
            variant-b-g-color="sky"
            variant-hover="airy"
            text-size="sm"
            rounded="full"
          >
            <i :class="['fa-solid fa-user-shield me-1', themeClass.icon.info]"></i>
            {{ formatText(value) }}
          </BaseBadge>
        </template>

        <template #actions="{ item }">
          <div class="flex gap-2">
            <BaseButton
              size="sm"
              @click="openEditModal(item.id)"
              variant="secondary"
              icon="fa-solid fa-pen"
              :title="`Edit ${item.name}`"
            />
          </div>
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
