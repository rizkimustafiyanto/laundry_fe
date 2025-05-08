<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Transaksi Laundry</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="status in ['Antrian', 'Diproses', 'Selesai']"
        :key="status"
        class="bg-white p-4 rounded shadow"
      >
        <h3 class="font-semibold text-blue-600 mb-2">Status: {{ status }}</h3>
        <ul class="text-sm space-y-1">
          <li v-for="tx in filteredTransactions(status)" :key="tx.id">
            <span class="font-medium">{{ tx.nama }}</span> - {{ tx.tanggal }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dummyTransactions = ref([
  { id: 1, nama: 'Andi', tanggal: '2025-05-01', status: 'Antrian' },
  { id: 2, nama: 'Budi', tanggal: '2025-05-02', status: 'Diproses' },
  { id: 3, nama: 'Sari', tanggal: '2025-05-03', status: 'Selesai' },
  { id: 4, nama: 'Andi', tanggal: '2025-05-04', status: 'Selesai' },
])

const filteredTransactions = (status) =>
  dummyTransactions.value.filter((tx) => tx.status === status)
</script>
