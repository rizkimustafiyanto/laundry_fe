<script setup>
import StarRating from './ReviewStar.vue'
import CompanyReviewForm from './ReviewForm.vue'

const props = defineProps({
  companyId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: '',
  },
})

const reviewStore = useCompanyReviewStore()
const themeClass = useThemeClass()

const data = ref([])
const loading = ref(true)
const editReviewId = ref(null)

const loadData = async () => {
  loading.value = true

  try {
    const res = await reviewStore.fetchRatingUser(props.companyId, props.userId)

    data.value = Array.isArray(res) ? res : res ? [res] : []
  } catch (err) {
    console.error('Error loading review:', err)
    data.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const editReview = (review) => {
  editReviewId.value = review.id

  reviewStore.formPayload = {
    rating: review.rating,
    comment: review.comment,
  }
}

const deleteReview = async (id) => {
  try {
    await reviewStore.deleteItem(id)
    await loadData()
  } catch (err) {
    console.error('Delete error:', err)
  }
}
</script>

<template>
  <section class="space-y-3">
    <h3 class="text-lg font-semibold flex items-center gap-2" :class="themeClass.text.secondary">
      <i :class="['fa-solid fa-clipboard-list mr-1', themeClass.icon.warning]"></i>
      Ulasan Anda
    </h3>

    <CompanyReviewForm
      v-if="editReviewId || data.length === 0"
      :companyId="companyId"
      :reviewId="editReviewId"
      @success="
        () => {
          editReviewId = null
          loadData()
        }
      "
    />

    <BaseLoadingSpinner v-if="loading" type="mini" />

    <div v-else-if="data.length" class="grid gap-6">
      <div
        v-for="review in data"
        :key="review.id"
        :class="[
          themeClass.background.mist,
          themeClass.border.secondary,
          'border rounded-2xl p-5 shadow-sm transition hover:shadow-md',
        ]"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <StarRating :modelValue="review.rating" readonly />

          <small :class="[themeClass.text.secondary, 'text-xs sm:text-sm']">
            {{ new Date(review.createdAt).toLocaleDateString() }}
          </small>
        </div>

        <p :class="[themeClass.text.dark, 'mt-4 leading-relaxed']">
          {{ review.comment }}
        </p>

        <div v-if="review.userId === userId" class="flex items-center gap-1 mt-4 text-sm">
          <BaseButton label="Edit" @click="editReview(review)" variant="link" size="sm" />
          <BaseButton label="Hapus" @click="deleteReview(review.id)" variant="danger" size="sm" />
        </div>
      </div>
    </div>

    <div v-else :class="[themeClass.text.secondary, 'text-center py-8 italic']">
      Belum ada review.
    </div>
  </section>
</template>
