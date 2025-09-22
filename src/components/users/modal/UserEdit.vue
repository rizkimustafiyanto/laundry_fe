<script setup>
const props = defineProps({
  showRole: { type: Boolean, default: false },
})

const emit = defineEmits(['save'])
const modalOpen = defineModel()

const roleStore = useRolesStore()
const userStore = useUserStore()
const { formPayload } = storeToRefs(userStore)

const roleOptions = computed(() => roleStore.options)

function handleSubmit() {
  modalOpen.value = false
  emit('save')
}

onMounted(async () => {
  await roleStore.fetch()
})
</script>

<template>
  <teleport to="body">
    <BaseModal v-model="modalOpen" title="Edit User" size="md">
      <BaseCard type="single" variant="glass">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <BaseInput label="Name" v-model="formPayload.name" id="name" />
            <BaseInput type="email" label="Email" v-model="formPayload.email" id="email" />
            <BaseInput
              type="password"
              label="New Password (optional)"
              placeholder="New Password (optional)"
              v-model="formPayload.password"
              id="password"
              :required="false"
            />
            <BaseSelect
              v-if="props.showRole"
              id="role"
              label="Role"
              v-model="formPayload.role"
              :options="roleOptions"
              placeholder="Pilih Role"
              type="default"
            />
            <BaseRadioButton
              v-model="formPayload.isActive"
              :options="[
                { label: 'Active', value: true },
                { label: 'Disabled', value: false },
              ]"
              type="horizontal"
              label="Status"
            />
          </div>
          <BaseButton type="submit" label="Save" variant="teal" class="w-full mt-4" />
        </form>
      </BaseCard>
    </BaseModal>
  </teleport>
</template>
