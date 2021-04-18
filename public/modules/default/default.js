function loadingHandler(status) {
    let loadingSelector = querySelector('#loadingScreen')

    if (!status != status === 'stop') {
        loadingSelector.style.display = 'none'
    } else if (status === 'start') {
        loadingSelector.style.display = 'flex'
        loadingSelector.style.position = 'fixed'
    } else {
        loadingSelector.style.display = 'none'
    }
}
