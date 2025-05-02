<template>
  <div class="unauthorized-container">
    <div class="content">
      <h1>401 - Unauthorized</h1>
      <p>Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <RouterLink to="/" class="back-home">Kembali ke Beranda</RouterLink>
    </div>
  </div>
</template>

<script setup>
// Tidak perlu script tambahan kecuali ingin menambahkan logika
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
}

.content {
  max-width: 500px;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.back-home {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #0d6efd;
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.back-home:hover {
  background-color: #0b5ed7;
}
</style>
