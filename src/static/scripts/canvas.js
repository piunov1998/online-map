const tile_size = 256
const map = document.getElementById("map")
const ctx = map.getContext("2d")
const buffer_canvas = document.createElement("canvas")
const buffer_ctx = buffer_canvas.getContext("2d")

let pos_x = 0
let pos_y = 0
let zoom = findSizeInTiles().z

let img_x = 0
let img_y = 0

map.addEventListener("wheel", mouseZoom)
map.addEventListener("mousemove", mouseMove)
map.onmouseup = renderMap
// window.addEventListener('resize', function() {updateCanvasSize(); console.log('resized')})

function updateCanvasSize() {
    map.width = map.clientWidth
    map.height = map.clientHeight
    buffer_canvas.width = map.width * 2
    buffer_canvas.height = map.height * 2
}

function urlTile(x, y, z) {
    let url = "https://tile.openstreetmap.org/{z}/{x}/{y}.png?srs=EPSG:3857" //document.getElementById("source").value
    let xyz = {x, y, z}
    for (let k in xyz) {
        url = url.replace('{' + k + '}', xyz[k])
    }
    return url
}

function fillCanvas() {
    ctx.clearRect(0, 0, map.clientWidth, map.clientHeight)
    let size = findSizeInTiles()

    for (let x = pos_x; x < pos_x + size.x; x++) {
        for (let y = pos_y; y < pos_y + size.y; y++) {
            let tile = new Image()
            tile.crossOrigin = "anonymous"
            tile.src = urlTile(x, y, zoom)
            tile.onload = function () {
                console.log(tile, (x - pos_x) * tile_size, (y - pos_y) * tile_size)
                ctx.drawImage(tile, (x - pos_x) * tile_size, (y - pos_y) * tile_size)
            }
        }
    }
}

function findSizeInTiles() {
    let x = Math.ceil(map.clientWidth / tile_size)
    let y = Math.ceil(map.clientHeight / tile_size)
    let z = Math.ceil(Math.log2(Math.max(x, y)))
    return {x, y, z}
}

function mouseZoom(event) {
    if (event.deltaY > 0) {
        zoomOut()
    } else {
        zoomIn()
    }
}

function renderMap() {
    ctx.clearRect(0, 0, map.width, map.height)
    buffer_ctx.clearRect(0, 0, buffer_canvas.width, buffer_canvas.height)
    for (let x = pos_x;
        x < pos_x + Math.ceil(buffer_canvas.width / tile_size);
        x++) {
        for (let y = pos_y;
            y < pos_y + Math.ceil(buffer_canvas.height / tile_size);
            y++) {
            if (x < 0 || y < 0) {continue}
            let tile = new Image()
            tile.crossOrigin = "anonymous"
            tile.src = urlTile(x, y, zoom)
            tile.onload = function () {
                buffer_ctx.drawImage(tile, (x - pos_x) * tile_size, (y - pos_y) * tile_size)
                let buffer = buffer_ctx.getImageData(img_x, img_y, img_x + map.width, img_y + map.height)
                ctx.putImageData(buffer, 0, 0)
            }
        }
    }
}

function mouseMove(event) {
    if (event.buttons == 1) {
        img_x -= event.movementX
        img_y -= event.movementY
        pos_x = Math.round(img_x / tile_size)
        pos_y = Math.round(img_y / tile_size)
        console.log(img_x, img_y)
        let buffer = buffer_ctx.getImageData(img_x, img_y, img_x + map.width, img_y + map.height)
        ctx.putImageData(buffer, 0, 0)
    }
}

updateCanvasSize()
