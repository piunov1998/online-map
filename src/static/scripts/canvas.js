const tile_size = 256
const map = document.getElementById("map")
const ctx = map.getContext("2d")

let pos_x = pos_y = 0
let zoom = findSizeInTiles().z



window.addEventListener('resize', function() {updateCanvasSize(); console.log('resized')})

function updateCanvasSize() {
    map.width = map.clientWidth
    map.height = map.clientHeight
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

updateCanvasSize()
