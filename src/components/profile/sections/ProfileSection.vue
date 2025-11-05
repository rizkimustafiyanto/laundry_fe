<template>
  <div>
    <BaseCard type="single" variant="secondary">
      <div
        class="flex justify-between items-center py-3 border-b px-2"
        :class="themeClass.border.subtle"
      >
        <h1 class="text-xl font-bold flex items-center gap-2" :class="themeClass.text.secondary">
          <i :class="['fa-solid fa-user-circle', themeClass.icon.primary]"></i>
          Profil Saya
        </h1>
        <BaseButton
          @click="editModal()"
          label="Edit Profil"
          variant="secondary"
          size="sm"
          icon="fa-solid fa-pen"
        />
      </div>

      <div class="flex flex-col py-6 px-2 gap-6">
        <div class="flex items-center gap-6">
          <img
            :src="profileSrc"
            alt="Foto Profil"
            class="w-28 h-28 rounded-full object-cover ring-2"
            :class="themeClass.border.indigo"
          />
          <div class="flex-1 min-w-0 space-y-1">
            <h2 class="text-lg font-semibold break-words" :class="themeClass.text.dark">
              {{ profile?.name }}
            </h2>
            <p class="text-sm break-words" :class="themeClass.text.subtleMeta">
              {{ profile?.email }}
            </p>
            <BaseBadge
              variant-text="secondary"
              variant-b-g-color="softPink"
              variant-hover="airy"
              text-size="sm"
              rounded="full"
            >
              {{ formatText(profile?.role) }}
            </BaseBadge>
          </div>
        </div>

        <div
          class="flex flex-col p-4 rounded-xl space-y-2"
          :class="[themeClass.background.airy, themeClass.border.airy]"
        >
          <h2 class="text-lg font-medium" :class="themeClass.text.secondary">
            <i :class="['fa-solid fa-id-card-clip mr-2', themeClass.icon.secondary]"></i>
            Bio
          </h2>
          <p
            class="text-sm leading-relaxed break-words whitespace-pre-wrap"
            :class="themeClass.text.subtle"
          >
            {{ profile?.bio || 'Belum ada bio' }}
          </p>
        </div>
      </div>
    </BaseCard>

    <ProfileForm
      v-model="editProfile"
      :data-profile="profile"
      @file-selected="selectedFile = $event"
      @save="saveProfile"
    />
  </div>
</template>

<script setup>
import ProfileForm from '../form/ProfileForm.vue'
import defaultAvatar from '@/assets/icons/user.png'

const themeClass = useThemeClass()

const props = defineProps({
  profile: { type: Object, default: () => {} },
})

const editProfile = ref(false)
const selectedFile = ref(null)
const userStore = useUserStore()

const editModal = () => {
  editProfile.value = true
}

const saveProfile = async (updatedProfile) => {
  const payload = {
    name: updatedProfile.name,
    email: updatedProfile.email,
    gender: updatedProfile.gender,
    phone: updatedProfile.phone,
    address: updatedProfile.address,
    bio: updatedProfile.bio,
    dateOfBirth: updatedProfile.dateOfBirth,
  }

  if (selectedFile.value) {
    payload.file = selectedFile.value
    await userStore.updateProfileWithItem(payload)
  } else {
    await userStore.updateProfile(payload)
  }
  editProfile.value = false
}

const profileSrc = ref(defaultAvatar)

watch(
  () => props.profile,
  (newVal) => {
    if (newVal) {
      profileSrc.value = newVal.photo ? `${__BASE_URL__}${newVal.photo}` : defaultAvatar
    } else {
      profileSrc.value = defaultAvatar
    }
  },
  { immediate: true },
)
</script>
