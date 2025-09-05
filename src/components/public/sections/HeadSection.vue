<template>
  <nav class="bg-white shadow-md fixed top-0 left-0 w-full z-50">
    <div class="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <img src="@/assets/logo.svg" alt="LaundryKuy Logo" class="h-12 w-12 object-cover" />
        <span class="text-2xl font-bold text-blue-700">LaundryKuy</span>
      </div>

      <div>
        <a
          href="/login"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </a>
      </div>
    </div>
  </nav>
</template>
