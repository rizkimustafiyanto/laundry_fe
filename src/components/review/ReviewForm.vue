<script setup>
import StarRating from './ReviewStar.vue'

const props = defineProps({
  companyId: {
    type: String,
    required: true,
  },
  reviewId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['success'])

const reviewStore = useCompanyReviewStore()
const themeClass = useThemeClass()

const isEditMode = computed(() => !!props.reviewId)

const submit = async () => {
  if (!reviewStore.formPayload.rating) {
    alert('Rating wajib diisi')
    return
  }

  if (isEditMode.value) {
    await reviewStore.updateItem(props.reviewId)
  } else {
    await reviewStore.createReview(props.companyId)
  }

  emit('success')
}
</script>

<template>
  <div
    :class="[
      themeClass.background.mist,
      themeClass.border.secondary,
      'border rounded-2xl p-6 shadow-sm space-y-5',
    ]"
  >
    <h3 :class="[themeClass.text.dark, 'font-semibold text-lg']">
      {{ isEditMode ? 'Edit Review' : 'Tambahkan Review' }}
    </h3>

    <div class="space-y-2">
      <label :class="[themeClass.text.secondary, 'text-sm']"> Rating </label>

      <StarRating v-model="reviewStore.formPayload.rating" />
    </div>

    <div class="space-y-2">
      <label :class="[themeClass.text.secondary, 'text-sm']"> Komentar </label>

      <textarea
        v-model="reviewStore.formPayload.comment"
        rows="4"
        :class="[
          themeClass.border.secondary,
          themeClass.text.dark,
          themeClass.background.mist,
          'border w-full rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-opacity-20',
        ]"
        placeholder="Tulis komentar kamu..."
      />
    </div>

    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-2">
      <BaseButton
        :label="isEditMode ? 'Update Review' : 'Kirim Review'"
        @click="submit"
        variant="primary"
        size="sm"
      />
    </div>
  </div>
</template>
