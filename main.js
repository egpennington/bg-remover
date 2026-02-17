const imageInput = document.getElementById("image-input")
const removeBtn = document.getElementById("remove-btn")
const resultImage = document.getElementById("result-image")
const downloadLink = document.getElementById("downloadLink")
const dropzoneTitle = document.getElementById("dropzone-title")
const icon = document.getElementById("icon")
const spinner = document.querySelector(".spinner")
const btnText = document.querySelector(".btn-text")

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0]

  removeBtn.classList.toggle("is-enabled", !!file)
  dropzoneTitle.textContent = file ? file.name : "Choose an Image"

  downloadLink.removeAttribute("href")
  downloadLink.classList.add("disabled")
  downloadLink.textContent = "Download PNG"
  downloadLink.style.display = "block"

  if (!file) {
    icon.innerHTML = "📷"
    return
  }

  const previewURL = URL.createObjectURL(file)

  icon.innerHTML = `
    <img src="${previewURL}" >
  `
})

removeBtn.addEventListener("click", async () => {
  const file = imageInput.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append("file", file)

  /* Spinner add */
  spinner.classList.remove("hidden")
  btnText.textContent = "Processing..."
  removeBtn.disabled = true

  try {
    const response = await fetch("http://127.0.0.1:8000/remove-bg", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Server error ${response.status}: ${text}`)
    }

    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob)

    // Time stamp
    const now = new Date()
    const timeStamp = now.toLocaleString().replace(/[:.]/g, "-")

    resultImage.src = imageUrl
    downloadLink.href = imageUrl
    downloadLink.download = `bg-removed-${timeStamp}.png` 
    downloadLink.classList.remove("disabled")
    downloadLink.textContent = "Download PNG"
    downloadLink.style.display = "block"

    /* Spinner stop */
    spinner.classList.add("hidden")
    btnText.textContent = "Remove Background"
    removeBtn.disabled = false

  } catch (error) {
    console.error(error)
    alert("Something went wrong. Check console.")

    /* Spinner in catch */
    spinner.classList.add("hidden")
    btnText.textContent = "Remove Background"
    removeBtn.disabled = false

  } 
})
