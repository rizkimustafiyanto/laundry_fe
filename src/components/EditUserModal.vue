<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-30"
    @click.self="close"
  >
    <div class="w-full max-w-xl bg-white rounded-lg shadow-lg">
      <form @submit.prevent="handleSubmit">
        <!-- Header -->
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

        <!-- Body -->
        <div class="p-6 space-y-6">
          <BaseInput label="Name" v-model="form.name" id="name" />
          <BaseInput type="email" label="Email" v-model="form.email" id="email" />
          <BaseInput
            type="password"
            label="New Password (optional)"
            v-model="form.password"
            id="password"
            :required="false"
          />
          <div v-if="showRole">
            <label for="role" class="block mb-2 text-sm font-medium text-gray-900">Role</label>
            <select
              id="role"
              v-model="form.role"
              class="w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 bg-gray-50"
            >
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER">Customer</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>

        <!-- Footer -->
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
import { reactive, defineProps, defineEmits } from 'vue'
import BaseInput from './BaseInput.vue'

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

function close() {
  emit('close')
}

function handleSubmit() {
  emit('save', { ...form })
  close()
}
</script>
