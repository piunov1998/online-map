function clamp(val, min, max) {
    return Math.max(Math.min(val, max), min)
}

function check_xyz() {
    zoom = clamp(zoom, 0, 14)
    pos_x = clamp(pos_x, 0, Math.max(2**(zoom + 1), 0))
    pos_y = clamp(pos_y, 0, Math.max(2**(zoom + 1), 0))
}

function zoomOut() {
    zoom -= 1
    pos_x = Math.ceil(pos_x / 2) - Math.floor(findSizeInTiles().x / 2)
    pos_y = Math.ceil(pos_y / 2) - Math.floor(findSizeInTiles().y / 2)
    check_xyz()
    fillCanvas()
}
function zoomIn() {
    zoom += 1
    pos_x = pos_x * 2 + Math.floor(findSizeInTiles().x / 2)
    pos_y = pos_y * 2 + Math.floor(findSizeInTiles().y / 2)
    check_xyz()
    fillCanvas()
}
function moveLeft() {
    pos_x -= 1
    check_xyz()
    fillCanvas()
}
function moveRight() {
    pos_x += 1
    check_xyz()
    fillCanvas()
}
function moveUp() {
    pos_y -= 1
    check_xyz()
    fillCanvas()
}
function moveDown() {
    pos_y += 1
    check_xyz()
    fillCanvas()
}