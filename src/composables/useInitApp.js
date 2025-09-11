export async function initApp(pinia) {
  const companyStore = useCompanyProfileStore(pinia)

  try {
    await companyStore.fetchItems({ page: 1, limit: 1 })
    const company = companyStore.items[0]

    if (company) {
      if (company.name) document.title = company.name

      if (company.logoUrl) {
        let link = document.querySelector("link[rel~='icon']")
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        link.href = `${__BASE_URL__}${company.logoUrl}`
      }
    }
  } catch (err) {
    console.error('Gagal mengambil company profile:', err)
  }
}
