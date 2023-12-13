function toggleInactiveClass() {
  const fsBtn = document.getElementById('fs-btn')
  fsBtn.classList.toggle('inactive')

  const winBtn = document.getElementById('win-btn')
  winBtn.classList.toggle('inactive')
}

const closeApp = async () => {
  await window.btnEvent.close()
}

const minApp = async () => {
  await window.btnEvent.min()
}

const fsApp = async () => {
  await window.btnEvent.fs()
}
window.btnEvent.onMaximized(() => {
  toggleInactiveClass()
})


const winApp = async () => {
  await window.btnEvent.win()
}
window.btnEvent.onWindowed(() => {
  toggleInactiveClass()
})


const closeBtn = document.getElementById('close-btn')
closeBtn.addEventListener('click', closeApp)

const minBtn = document.getElementById('min-btn')
minBtn.addEventListener('click', minApp)

const fsBtn = document.getElementById('fs-btn')
fsBtn.addEventListener('click', fsApp)

const winBtn = document.getElementById('win-btn')
winBtn.addEventListener('click', winApp)
