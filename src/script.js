import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base Setup
 */
// Debug GUI
const gui = new GUI({ title: '🦇 Haunted Estate Controls' })
gui.close()

// Canvas & Scene
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

// Floor Textures
const floorAlphaTexture = textureLoader.load('/haunted-house-resources/floor/alpha.webp')
const floorColorTexture = textureLoader.load('/haunted-house-resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('/haunted-house-resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('/haunted-house-resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('/haunted-house-resources/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

floorColorTexture.colorSpace = THREE.SRGBColorSpace

const setupRepeat = (textures, countX, countY) => {
    textures.forEach((texture) => {
        texture.repeat.set(countX, countY)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
    })
}

setupRepeat([floorColorTexture, floorARMTexture, floorNormalTexture, floorDisplacementTexture], 8, 8)

// Wall Textures
const wallColorTexture = textureLoader.load('/haunted-house-resources/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp')
const wallARMTexture = textureLoader.load('/haunted-house-resources/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
const wallNormalTexture = textureLoader.load('/haunted-house-resources/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')
wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof Textures
const roofColorTexture = textureLoader.load('/haunted-house-resources/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('/haunted-house-resources/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('/haunted-house-resources/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')
roofColorTexture.colorSpace = THREE.SRGBColorSpace
setupRepeat([roofColorTexture, roofARMTexture, roofNormalTexture], 3, 1)

// Bush Textures
const bushColorTexture = textureLoader.load('/haunted-house-resources/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('/haunted-house-resources/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('/haunted-house-resources/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')
bushColorTexture.colorSpace = THREE.SRGBColorSpace
setupRepeat([bushColorTexture, bushARMTexture, bushNormalTexture], 2, 1)

// Grave Textures
const graveColorTexture = textureLoader.load('/haunted-house-resources/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const graveARMTexture = textureLoader.load('/haunted-house-resources/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const graveNormalTexture = textureLoader.load('/haunted-house-resources/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')
graveColorTexture.colorSpace = THREE.SRGBColorSpace
setupRepeat([graveColorTexture, graveARMTexture, graveNormalTexture], 0.3, 0.4)

// Door Textures
const doorColorTexture = textureLoader.load('/haunted-house-resources/door/color.webp')
const doorAlphaTexture = textureLoader.load('/haunted-house-resources/door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('/haunted-house-resources/door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('/haunted-house-resources/door/height.webp')
const doorNormalTexture = textureLoader.load('/haunted-house-resources/door/normal.webp')
const doorMetalnessTexture = textureLoader.load('/haunted-house-resources/door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('/haunted-house-resources/door/roughness.webp')
doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Materials
 */
const floorMaterial = new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.25,
    displacementBias: -0.15
})

const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture
})

const roofMaterial = new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture
})

const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#88aa77',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture
})

const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture
})

const woodMaterial = new THREE.MeshStandardMaterial({
    color: '#3d2516',
    roughness: 0.9,
    metalness: 0.1
})

const stoneMaterial = new THREE.MeshStandardMaterial({
    color: '#495057',
    roughness: 0.85,
    metalness: 0.15
})

const windowGlowMaterial = new THREE.MeshStandardMaterial({
    color: '#ffc107',
    emissive: '#ff9800',
    emissiveIntensity: 1.5,
    roughness: 0.2
})

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(32, 32, 100, 100),
    floorMaterial
)
floor.rotation.x = -Math.PI * 0.5
floor.receiveShadow = true
scene.add(floor)

/**
 * Estate House Complex
 */
const estate = new THREE.Group()
scene.add(estate)

// 1. Main Mansion Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    wallMaterial
)
walls.position.y = 1.5
walls.castShadow = true
walls.receiveShadow = true
estate.add(walls)

// 2. Main Mansion Roof (Pyramid)
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.8, 4),
    roofMaterial
)
roof.position.y = 3 + 0.9
roof.rotation.y = Math.PI * 0.25
roof.castShadow = true
estate.add(roof)

// 3. Chimney on Roof
const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 1.6, 0.65),
    wallMaterial
)
chimney.position.set(1.2, 3.8, -0.9)
chimney.castShadow = true
estate.add(chimney)

const chimneyRim = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.15, 0.75),
    stoneMaterial
)
chimneyRim.position.set(1.2, 4.6, -0.9)
estate.add(chimneyRim)

// 4. Side Annex / Shed (Додаткова прибудова / сарай)
const annexWalls = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 2.2, 2.8),
    wallMaterial
)
annexWalls.position.set(3.2, 1.1, -0.4)
annexWalls.castShadow = true
annexWalls.receiveShadow = true
estate.add(annexWalls)

const annexRoof = new THREE.Mesh(
    new THREE.ConeGeometry(2.2, 1.2, 4),
    roofMaterial
)
annexRoof.position.set(3.2, 2.2 + 0.6, -0.4)
annexRoof.rotation.y = Math.PI * 0.25
annexRoof.castShadow = true
estate.add(annexRoof)

// 5. Front Porch (Ґанок)
const porch = new THREE.Group()
estate.add(porch)

// Porch base slab
const porchBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.2, 1.3),
    stoneMaterial
)
porchBase.position.set(0, 0.1, 2.65)
porchBase.receiveShadow = true
porch.add(porchBase)

// Front Step
const porchStep = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.1, 0.4),
    stoneMaterial
)
porchStep.position.set(0, 0.05, 3.4)
porchStep.receiveShadow = true
porch.add(porchStep)

// Porch Wooden Posts
const postGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1.8)
const postLeft = new THREE.Mesh(postGeometry, woodMaterial)
postLeft.position.set(-1.0, 1.0, 3.2)
postLeft.castShadow = true

const postRight = new THREE.Mesh(postGeometry, woodMaterial)
postRight.position.set(1.0, 1.0, 3.2)
postRight.castShadow = true
porch.add(postLeft, postRight)

// Porch Slanted Canopy
const porchCanopy = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.08, 1.5),
    roofMaterial
)
porchCanopy.position.set(0, 2.05, 2.65)
porchCanopy.rotation.x = 0.12
porchCanopy.castShadow = true
porch.add(porchCanopy)

// 6. Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 2.2, 64, 64),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        normalMap: doorNormalTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.12,
        displacementBias: -0.04,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture
    })
)
door.position.set(0, 1.05, 2.01)
estate.add(door)

// 7. Glowing Windows (Вікна з моторошним світлом)
const createWindow = (width, height, posX, posY, posZ, rotY = 0) => {
    const windowGroup = new THREE.Group()

    // Glowing pane
    const pane = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        windowGlowMaterial
    )
    windowGroup.add(pane)

    // Wooden crossbars
    const barV = new THREE.Mesh(new THREE.BoxGeometry(0.04, height, 0.03), woodMaterial)
    const barH = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, 0.03), woodMaterial)
    barV.position.z = 0.02
    barH.position.z = 0.02
    windowGroup.add(barV, barH)

    windowGroup.position.set(posX, posY, posZ)
    windowGroup.rotation.y = rotY
    return windowGroup
}

const windowLeft = createWindow(0.7, 0.9, -1.2, 1.5, 2.02)
const windowRight = createWindow(0.7, 0.9, 1.2, 1.5, 2.02)
const windowAttic = createWindow(0.6, 0.6, 0, 3.3, 1.45)
const windowAnnex = createWindow(0.65, 0.8, 3.2, 1.3, 1.02)
estate.add(windowLeft, windowRight, windowAttic, windowAnnex)

// 8. Hanging Entrance Lantern (Ліхтар біля входу)
const lanternGroup = new THREE.Group()
lanternGroup.position.set(0, 2.1, 2.9)
estate.add(lanternGroup)

const lanternMount = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.25),
    woodMaterial
)
lanternMount.rotation.x = Math.PI * 0.5
lanternGroup.add(lanternMount)

const lanternBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff7733' })
)
lanternBulb.position.y = -0.15
lanternGroup.add(lanternBulb)

const lanternLight = new THREE.PointLight('#ff7733', 3.5, 7)
lanternLight.position.set(0, 2.0, 2.9)
lanternLight.castShadow = true
lanternLight.shadow.mapSize.width = 256
lanternLight.shadow.mapSize.height = 256
lanternLight.shadow.camera.far = 8
scene.add(lanternLight)

// 9. Stone Pathway (Кам'яна звивиста доріжка)
const pathwayGroup = new THREE.Group()
scene.add(pathwayGroup)

const stoneGeom = new THREE.CylinderGeometry(0.3, 0.35, 0.06, 7)
const stonePoints = [
    { x: 0, z: 3.7 },
    { x: -0.2, z: 4.4 },
    { x: 0.1, z: 5.1 },
    { x: -0.3, z: 5.9 },
    { x: 0.2, z: 6.8 },
    { x: -0.1, z: 7.7 },
    { x: 0.3, z: 8.6 },
    { x: 0.0, z: 9.6 }
]

stonePoints.forEach((pt, i) => {
    const stone = new THREE.Mesh(stoneGeom, stoneMaterial)
    stone.position.set(pt.x + (Math.random() - 0.5) * 0.15, 0.03, pt.z)
    stone.scale.set(0.9 + Math.random() * 0.3, 1, 0.8 + Math.random() * 0.4)
    stone.rotation.y = Math.random() * Math.PI
    stone.receiveShadow = true
    pathwayGroup.add(stone)
})

// 10. Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)

const bushConfigs = [
    { scale: [0.8, 0.8, 0.8], pos: [1.2, 0.2, 2.4] },
    { scale: [0.5, 0.5, 0.5], pos: [1.8, 0.1, 2.3] },
    { scale: [0.7, 0.7, 0.7], pos: [-1.3, 0.2, 2.4] },
    { scale: [0.4, 0.4, 0.4], pos: [-1.8, 0.1, 2.2] },
    { scale: [0.6, 0.6, 0.6], pos: [4.4, 0.2, -0.4] },
    { scale: [0.5, 0.5, 0.5], pos: [-2.2, 0.2, -1.0] },
    { scale: [0.9, 0.9, 0.9], pos: [-2.2, 0.3, 1.5] }
]

bushConfigs.forEach((cfg) => {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial)
    bush.scale.set(...cfg.scale)
    bush.position.set(...cfg.pos)
    bush.rotation.y = Math.random() * Math.PI
    bush.castShadow = true
    bush.receiveShadow = true
    estate.add(bush)
})

// 11. Graveyard & Tombs (Цвинтар)
const graves = new THREE.Group()
scene.add(graves)

const tombstoneGeom = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const tombstoneCrossH = new THREE.BoxGeometry(0.5, 0.12, 0.1)
const tombstoneCrossV = new THREE.BoxGeometry(0.14, 0.85, 0.1)

for (let i = 0; i < 42; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 4.2 + Math.random() * 7.5

    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    // Avoid doorway path
    if (Math.abs(x) < 1.2 && z > 2.0 && z < 10.5) continue

    const graveItem = new THREE.Group()

    if (Math.random() > 0.35) {
        // Slab tombstone
        const slab = new THREE.Mesh(tombstoneGeom, graveMaterial)
        slab.position.y = 0.4
        slab.castShadow = true
        slab.receiveShadow = true
        graveItem.add(slab)
    } else {
        // Gothic cross
        const crossV = new THREE.Mesh(tombstoneCrossV, graveMaterial)
        crossV.position.y = 0.42
        crossV.castShadow = true
        crossV.receiveShadow = true

        const crossH = new THREE.Mesh(tombstoneCrossH, graveMaterial)
        crossH.position.y = 0.55
        crossH.castShadow = true
        crossH.receiveShadow = true

        graveItem.add(crossV, crossH)
    }

    graveItem.position.set(x, 0, z)
    graveItem.rotation.y = (Math.random() - 0.5) * 0.8
    graveItem.rotation.z = (Math.random() - 0.5) * 0.25
    graveItem.rotation.x = (Math.random() - 0.5) * 0.2
    graves.add(graveItem)
}

// 12. Crooked Wooden Fence (Похилений паркан навколо)
const fenceGroup = new THREE.Group()
scene.add(fenceGroup)

const fencePostGeom = new THREE.CylinderGeometry(0.04, 0.05, 1.1, 5)
const fenceBarGeom = new THREE.BoxGeometry(1.2, 0.06, 0.03)

const fenceRadius = 11.5
const fenceCount = 38

for (let i = 0; i < fenceCount; i++) {
    const angle = (i / fenceCount) * Math.PI * 2
    const x = Math.sin(angle) * fenceRadius
    const z = Math.cos(angle) * fenceRadius

    // Gate opening in front
    if (Math.abs(x) < 1.8 && z > 8.0) continue

    const post = new THREE.Mesh(fencePostGeom, woodMaterial)
    post.position.set(x, 0.55, z)
    post.rotation.y = angle
    post.rotation.z = (Math.random() - 0.5) * 0.2
    post.rotation.x = (Math.random() - 0.5) * 0.2
    post.castShadow = true
    fenceGroup.add(post)

    // Rails connecting posts
    if (i % 2 === 0) {
        const railTop = new THREE.Mesh(fenceBarGeom, woodMaterial)
        railTop.position.set(x, 0.75, z)
        railTop.rotation.y = angle + Math.PI * 0.5 + (Math.random() - 0.5) * 0.1
        railTop.rotation.z = (Math.random() - 0.5) * 0.15
        fenceGroup.add(railTop)

        const railBottom = new THREE.Mesh(fenceBarGeom, woodMaterial)
        railBottom.position.set(x, 0.35, z)
        railBottom.rotation.y = angle + Math.PI * 0.5 + (Math.random() - 0.5) * 0.1
        railBottom.rotation.z = (Math.random() - 0.5) * 0.15
        fenceGroup.add(railBottom)
    }
}

// 13. Spooky Dead Trees (Зловісні засохлі дерева)
const createSpookyTree = (x, z, scale = 1) => {
    const tree = new THREE.Group()
    const trunkGeom = new THREE.CylinderGeometry(0.12, 0.25, 3.2, 6)
    const trunk = new THREE.Mesh(trunkGeom, woodMaterial)
    trunk.position.y = 1.6
    trunk.castShadow = true
    tree.add(trunk)

    // Branches
    const branchGeom = new THREE.CylinderGeometry(0.04, 0.09, 1.4, 5)

    const branch1 = new THREE.Mesh(branchGeom, woodMaterial)
    branch1.position.set(0.3, 2.5, 0)
    branch1.rotation.z = -0.7
    branch1.rotation.y = 0.5
    branch1.castShadow = true

    const branch2 = new THREE.Mesh(branchGeom, woodMaterial)
    branch2.position.set(-0.3, 2.2, 0.2)
    branch2.rotation.z = 0.8
    branch2.rotation.y = -0.6
    branch2.castShadow = true

    const branch3 = new THREE.Mesh(branchGeom, woodMaterial)
    branch3.position.set(0, 2.8, -0.3)
    branch3.rotation.x = -0.8
    branch3.castShadow = true

    tree.add(branch1, branch2, branch3)
    tree.position.set(x, 0, z)
    tree.scale.set(scale, scale, scale)
    tree.rotation.y = Math.random() * Math.PI
    return tree
}

scene.add(createSpookyTree(-7.5, 4.5, 1.2))
scene.add(createSpookyTree(7.8, -3.2, 1.1))
scene.add(createSpookyTree(-6.2, -6.5, 1.3))

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.25)
scene.add(ambientLight)

// Moon Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1.0)
directionalLight.position.set(4, 5, 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 512
directionalLight.shadow.mapSize.height = 512
directionalLight.shadow.camera.top = 9
directionalLight.shadow.camera.right = 9
directionalLight.shadow.camera.bottom = -9
directionalLight.shadow.camera.left = -9
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 22
scene.add(directionalLight)

/**
 * 3 Animated Ghosts (Привиди)
 */
const ghost1 = new THREE.PointLight('#00ffff', 3.5, 6.5)
const ghost2 = new THREE.PointLight('#ff0055', 3.5, 6.5)
const ghost3 = new THREE.PointLight('#70e000', 3.5, 6.5)

ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256

// Small visible glowing spheres for ghosts
const ghostCoreGeom = new THREE.SphereGeometry(0.08, 16, 16)
const ghost1Mesh = new THREE.Mesh(ghostCoreGeom, new THREE.MeshBasicMaterial({ color: '#00ffff' }))
const ghost2Mesh = new THREE.Mesh(ghostCoreGeom, new THREE.MeshBasicMaterial({ color: '#ff0055' }))
const ghost3Mesh = new THREE.Mesh(ghostCoreGeom, new THREE.MeshBasicMaterial({ color: '#70e000' }))

ghost1.add(ghost1Mesh)
ghost2.add(ghost2Mesh)
ghost3.add(ghost3Mesh)

scene.add(ghost1, ghost2, ghost3)

/**
 * Sky & Atmosphere
 */
const sky = new Sky()
sky.scale.setScalar(100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 2.8
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95

const skyParameters = {
    elevation: -1.2,
    azimuth: 180
}

const updateSky = () => {
    const phi = THREE.MathUtils.degToRad(90 - skyParameters.elevation)
    const theta = THREE.MathUtils.degToRad(skyParameters.azimuth)
    const sun = new THREE.Vector3().setFromSphericalCoords(1, phi, theta)
    sky.material.uniforms['sunPosition'].value.copy(sun)
}
updateSky()

/**
 * Fog (Густий містичний туман)
 */
const fogColor = '#041324'
scene.fog = new THREE.FogExp2(fogColor, 0.045)

/**
 * Ambient Procedural Audio (Синтезатор містичного вітру)
 */
let audioCtx = null
let noiseGainNode = null
let isAudioPlaying = false

const initProceduralAudio = () => {
    if (audioCtx) return
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    audioCtx = new AudioContextClass()

    // Generate white noise buffer
    const bufferSize = 2 * audioCtx.sampleRate
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = audioCtx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    // Low-pass eerie wind filter
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 280
    filter.Q.value = 4.0

    // Modulate filter for howling wind sensation
    const lfo = audioCtx.createOscillator()
    lfo.frequency.value = 0.25
    const lfoGain = audioCtx.createGain()
    lfoGain.gain.value = 160
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()

    noiseGainNode = audioCtx.createGain()
    noiseGainNode.gain.value = 0.0

    whiteNoise.connect(filter)
    filter.connect(noiseGainNode)
    noiseGainNode.connect(audioCtx.destination)
    whiteNoise.start()
}

/**
 * Window Resize
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera & Controls
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 2.5, 7.5)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI * 0.49
controls.minDistance = 2
controls.maxDistance = 22

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * lil-gui Controls Configuration
 */
const params = {
    ghostSpeed: 1.0,
    lanternFlicker: true,
    lanternBaseIntensity: 3.5,
    soundEnabled: false,
    soundVolume: 0.25,
    fogDensity: 0.045
}

// Sky Folder
const skyFolder = gui.addFolder('🌅 Sky & Sun')
skyFolder.add(skyParameters, 'elevation', -10, 10, 0.1).name('Sun Elevation').onChange(updateSky)
skyFolder.add(skyParameters, 'azimuth', -180, 180, 1).name('Sun Azimuth').onChange(updateSky)
skyFolder.add(sky.material.uniforms['turbidity'], 'value', 0, 20, 0.1).name('Turbidity')
skyFolder.add(sky.material.uniforms['rayleigh'], 'value', 0, 10, 0.1).name('Rayleigh')

// Fog Folder
const fogFolder = gui.addFolder('🌫️ Fog')
fogFolder.add(params, 'fogDensity', 0.005, 0.12, 0.005).name('Density').onChange((v) => {
    scene.fog.density = v
})

// Lights Folder
const lightFolder = gui.addFolder('💡 Lights & Lantern')
lightFolder.add(ambientLight, 'intensity', 0, 1, 0.02).name('Ambient Light')
lightFolder.add(directionalLight, 'intensity', 0, 3, 0.05).name('Moon Light')
lightFolder.add(params, 'lanternFlicker').name('Lantern Flicker')
lightFolder.add(params, 'lanternBaseIntensity', 0.5, 8, 0.1).name('Lantern Power')

// Ghosts Folder
const ghostFolder = gui.addFolder('👻 Ghosts')
ghostFolder.add(params, 'ghostSpeed', 0.1, 3.0, 0.1).name('Speed')
ghostFolder.addColor({ color: '#00ffff' }, 'color').name('Ghost 1').onChange((c) => {
    ghost1.color.set(c)
    ghost1Mesh.material.color.set(c)
})
ghostFolder.addColor({ color: '#ff0055' }, 'color').name('Ghost 2').onChange((c) => {
    ghost2.color.set(c)
    ghost2Mesh.material.color.set(c)
})
ghostFolder.addColor({ color: '#70e000' }, 'color').name('Ghost 3').onChange((c) => {
    ghost3.color.set(c)
    ghost3Mesh.material.color.set(c)
})

// Audio Folder
const audioFolder = gui.addFolder('🔊 Spooky Ambience')
audioFolder.add(params, 'soundEnabled').name('Sound (Click scene)').onChange((enabled) => {
    initProceduralAudio()
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume()
    }
    if (noiseGainNode) {
        noiseGainNode.gain.setTargetAtTime(enabled ? params.soundVolume : 0, audioCtx.currentTime, 0.15)
    }
})
audioFolder.add(params, 'soundVolume', 0, 1, 0.05).name('Volume').onChange((v) => {
    if (noiseGainNode && params.soundEnabled) {
        noiseGainNode.gain.setTargetAtTime(v, audioCtx.currentTime, 0.1)
    }
})

// Click on canvas unlocks Web Audio safely
window.addEventListener('click', () => {
    if (params.soundEnabled && audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume()
    }
}, { once: true })

/**
 * Animate Loop
 */
const timer = new Timer()

const tick = () => {
    timer.update()
    const elapsedTime = timer.getElapsed()

    // 1. Lantern Flickering Animation (миготіння ліхтаря)
    if (params.lanternFlicker) {
        const flicker = Math.sin(elapsedTime * 14) * 0.4 +
                        Math.sin(elapsedTime * 29) * 0.3 +
                        (Math.random() - 0.5) * 0.4
        lanternLight.intensity = Math.max(0.4, params.lanternBaseIntensity + flicker)
    } else {
        lanternLight.intensity = params.lanternBaseIntensity
    }

    // 2. Ghosts Movement (параметричні траєкторії польоту)
    const speed = elapsedTime * params.ghostSpeed

    // Ghost 1 (Cyan) - Large outer circle with height sine wave
    const ghost1Angle = speed * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 5
    ghost1.position.z = Math.sin(ghost1Angle) * 5
    ghost1.position.y = Math.sin(speed * 3) + 0.3

    // Ghost 2 (Pink) - Figure-8 (Lissajous) closer to graves
    const ghost2Angle = -speed * 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 6
    ghost2.position.z = Math.sin(ghost2Angle * 2) * 5.5
    ghost2.position.y = Math.sin(speed * 4) + Math.sin(speed * 2.5) + 0.2

    // Ghost 3 (Green) - Elliptical wave hovering around porch & annex
    const ghost3Angle = speed * 0.4
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(speed * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(speed * 0.5))
    ghost3.position.y = Math.sin(speed * 5) + Math.sin(speed * 2) + 0.5

    // 3. Controls update
    controls.update()

    // 4. Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
