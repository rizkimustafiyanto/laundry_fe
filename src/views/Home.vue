<template>
  <section class="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-6">
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

    <div class="max-w-full mx-auto text-center mt-24">
      <h1 class="text-4xl md:text-full font-extrabold text-blue-700 mb-4">
        Selamat Datang di LaundryKuy
      </h1>
      <p class="text-lg md:text-xl text-gray-600 mb-8">
        Solusi laundry cepat, bersih, dan terpercaya untuk kebutuhan harian Anda.
      </p>

      <div class="mb-12">
        <img
          src="@/assets/logo.svg"
          alt="Laundry Hero"
          class="rounded-2xl shadow-lg mx-auto max-h-20 object-cover"
        />
      </div>

      <div class="grid md:grid-cols-3 gap-6 text-left">
        <div class="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
          <h3 class="text-xl font-semibold text-blue-600 mb-2">Layanan Antar Jemput</h3>
          <p class="text-gray-600">
            Kami jemput cucian Anda langsung ke rumah dan antar kembali setelah bersih dan wangi.
          </p>
        </div>
        <div class="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
          <h3 class="text-xl font-semibold text-blue-600 mb-2">Cuci Kering & Lipat</h3>
          <p class="text-gray-600">
            Pakaian Anda dicuci dan dilipat rapi, siap langsung masuk lemari.
          </p>
        </div>
        <div class="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
          <h3 class="text-xl font-semibold text-blue-600 mb-2">Layanan Kilat 24 Jam</h3>
          <p class="text-gray-600">
            Butuh cepat? Gunakan layanan express kami yang selesai dalam 24 jam.
          </p>
        </div>
      </div>

      <div class="mt-12">
        <a
          href="#"
          class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Pesan Sekarang
        </a>
      </div>
    </div>
  </section>
</template>
<script setup></script>
