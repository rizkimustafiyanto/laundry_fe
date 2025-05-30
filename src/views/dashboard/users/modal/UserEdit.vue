<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-30"
    @click.self="close"
  >
    <BaseCard type="single" variant="primary" class="w-full max-w-xl">
      <div class="flex items-center justify-between p-4 border-b" :class="themeClass.borderColor">
        <h3 class="text-xl font-semibold">Edit User</h3>
        <button type="button" @click="close" class="text-gray-400 hover:text-gray-900">
          <font-awesome-icon :icon="['fas', 'xmark']" class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="p-6 space-y-6">
          <BaseInput label="Name" v-model="form.name" id="name" />
          <BaseInput type="email" label="Email" v-model="form.email" id="email" />
          <BaseInput
            type="password"
            label="New Password (optional)"
            placeholder="New Password (optional)"
            v-model="form.password"
            id="password"
            :required="false"
          />
          <BaseSelect
            v-if="showRole"
            id="role"
            label="Role"
            v-model="form.role"
            :options="roleOptions"
            placeholder="Pilih Role"
            type="default"
          />
          <BaseRadioButton
            v-model="form.isActive"
            :options="[
              { label: 'Active', value: true },
              { label: 'Disabled', value: false },
            ]"
            type="horizontal"
            label="Status"
          />
        </div>

        <div class="flex justify-end p-4 border-t" :class="themeClass.borderColor">
          <button
            type="submit"
            class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'
import { useUserStore } from '@/stores/services/user'

const props = defineProps({
  visible: Boolean,
  user: Object,
  showRole: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

const { themeClass } = useThemeClass()
const userStore = useUserStore()

const form = reactive({
  id: props.user?.id,
  name: props.user?.name || '',
  email: props.user?.email || '',
  password: '',
  role: props.user?.role || 'CUSTOMER',
  isActive: props.user?.isActive === true || false,
})

const roleOptions = computed(() => {
  return userStore.roleOption ?? []
})

function close() {
  emit('close')
}

function handleSubmit() {
  emit('save', { ...form })
  close()
}

onMounted(async () => {
  await userStore.fetchRoleOption()
})
</script>
