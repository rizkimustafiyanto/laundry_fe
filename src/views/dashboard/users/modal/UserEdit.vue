<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-30"
    @click.self="close"
  >
    <div class="w-full max-w-xl bg-white rounded-lg shadow-lg">
      <form @submit.prevent="handleSubmit">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">Edit User</h3>
          <button type="button" @click="close" class="text-gray-400 hover:text-gray-900">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

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
        </div>

        <div class="flex justify-end p-4 border-t border-gray-200">
          <button
            type="submit"
            class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

const props = defineProps({
  visible: Boolean,
  user: Object,
  showRole: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close', 'save'])

const form = reactive({
  id: props.user?.id,
  name: props.user?.name || '',
  email: props.user?.email || '',
  password: '',
  role: props.user?.role || 'CUSTOMER',
})

const roleOptions = [
  { label: 'Admin', value: 'SUPER_ADMIN' },
  { label: 'Owner', value: 'OWNER' },
  { label: 'Customer', value: 'CUSTOMER' },
]

function close() {
  emit('close')
}

function handleSubmit() {
  emit('save', { ...form })
  close()
}
</script>
