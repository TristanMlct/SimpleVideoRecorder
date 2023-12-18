const closeApp = async () => {
  await window.btnEvent.close()
}

const minApp = async () => {
  await window.btnEvent.min()
}

const closeBtn = document.getElementById('close-btn')
closeBtn.addEventListener('click', closeApp)

const minBtn = document.getElementById('min-btn')
minBtn.addEventListener('click', minApp)

