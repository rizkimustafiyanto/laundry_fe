<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
    <div
      class="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center transition-all"
    >
      <h1 class="text-4xl font-extrabold text-red-600 dark:text-red-400 mb-4">
        401 - Unauthorized
      </h1>
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <RouterLink
        to="/"
        class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Kembali ke Beranda
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
// Tidak perlu tambahan script kecuali ingin redirect otomatis, dll.
</script>
