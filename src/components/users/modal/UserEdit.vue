<template>
  <BaseModal v-model="modalOpen" title="Edit User" size="md">
    <BaseCard type="single" variant="glass">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-2">
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
        <BaseButton type="submit" label="Save" variant="teal" class="w-full mt-4" />
      </form>
    </BaseCard>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  user: { type: Object, default: null },
  showRole: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['save'])
const modalOpen = defineModel()

const roleStore = useRolesStore()
const roleOptions = computed(() => roleStore.options)

const form = reactive({ ...props.user })

watch(
  () => props.user,
  (newVal) => {
    Object.assign(form, newVal)
  },
)

function handleSubmit() {
  modalOpen.value = false
  emit('save', { ...form })
}

onMounted(async () => {
  await roleStore.fetch()
})
</script>
