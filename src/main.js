import * as THREE from 'three'
// import typeface from 'three/examples/fonts/gentilis_bold.typeface.json' //기본제공 typeface 폰트 사용방법
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import GUI from 'lil-gui'

window.addEventListener('load', function() {
  init()
})

async function init() {
  const gui = new GUI()

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.shadowMap.enabled = true

  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500,
  )

  camera.position.set(0, 1, 5)

  /** OrbitControls */
  new OrbitControls(camera, renderer.domElement)

  /** Font */
  const fontLoader = new FontLoader()

  const font = await fontLoader.loadAsync('/3d-text/asset/fonts/The Jamsil 3 Regular_Regular.json')

  /** Text */
  const textGeometry = new TextGeometry('Welcome to eazy\'s Blog', {
    font,
    size: 0.5,
    height: 0.1,
    bevelEnabled: true,
    bevelSegment: 5,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  })

  const textMaterial = new THREE.MeshPhongMaterial()

  const text = new THREE.Mesh(textGeometry, textMaterial)

  text.castShadow = true

  // 바운딩박스로 가운데 정렬하기 -> 단순 가운데 정렬일때는 center함수를 사용하는것이 더 이득이다
  // textGeometry.computeBoundingBox()
  //
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) * 0.5,
  //   -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) * 0.5,
  //   -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) * 0.5,
  // )

  textGeometry.center()

  scene.add(text)

  /** Texture */
  const textureLoader = new THREE.TextureLoader()

  const textTexture = textureLoader.load('https://images.unsplash.com/photo-1586012556194-38bdc1b9ab7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80')

  textMaterial.map = textTexture

  /** Plane */
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
  const planeMeterial = new THREE.MeshPhongMaterial({ color: 0x000000 })

  const plane = new THREE.Mesh(planeGeometry, planeMeterial)

  plane.position.z = -10
  plane.receiveShadow = true

  scene.add(plane)


  /** AnbientLight */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)

  scene.add(ambientLight)

  /** spotLight */
  const spotLight = new THREE.SpotLight(0xffffff, 2.5, 30, Math.PI * 0.15, 0.2, 0.5)

  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024
  spotLight.shadow.radius = 10

  spotLight.position.set(0, 0, 3)
  spotLight.target.position.set(0, 0, -3)

  const spotLightTexture = textureLoader.load('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')

  spotLight.map = spotLightTexture

  scene.add(spotLight, spotLight.target)

  window.addEventListener('mousemove', event => {
    const x = (event.clientX / window.innerWidth - 0.5) * 5
    const y = (event.clientY / window.innerHeight - 0.5) * 5

    spotLight.target.position.set(x, -y, -3)
  })

  const spotLightFolder = gui.addFolder('SpotLight')

  spotLightFolder
    .add(spotLight, 'angle')
    .min(0)
    .max(Math.PI / 2)
    .step(0.01)

  spotLightFolder
    .add(spotLight.position, 'z')
    .min(1)
    .max(10)
    .step(0.01)
    .name('position.z')

  spotLightFolder
    .add(spotLight, 'distance')
    .min(1)
    .max(30)
    .step(0.01)

  spotLightFolder
    .add(spotLight, 'decay')
    .min(1)
    .max(10)
    .step(0.01)

  spotLightFolder
    .add(spotLight, 'penumbra')
    .min(0)
    .max(1)
    .step(0.01)

  spotLightFolder
    .add(spotLight.shadow, 'radius')
    .min(1)
    .max(20)
    .step(0.01)


  /** PointLight */
  // const pointLight = new THREE.PointLight(0xffffff, 0.5)
  // pointLight.position.set(3, 0, 2)
  //
  // scene.add(pointLight)
  //
  // gui
  //   .add(pointLight.position,'x')
  //   .min(-3)
  //   .max(3)
  //   .step(0.1);

  /** Effects */
  const composer = new EffectComposer(renderer)

  const renderPass = new RenderPass(scene, camera)

  composer.addPass(renderPass)

  const unrealBllomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 1, 0 )

  composer.addPass(unrealBllomPass)

  const unrealBloomPassFolder = gui.addFolder('unrealBllomPass')

  unrealBloomPassFolder
    .add(unrealBllomPass, 'strength')
    .min(0)
    .max(3)
    .step(0.3)

  unrealBloomPassFolder
    .add(unrealBllomPass, 'radius')
    .min(0)
    .max(3)
    .step(0.3)

  unrealBloomPassFolder
    .add(unrealBllomPass, 'threshold')
    .min(0)
    .max(3)
    .step(0.3)

  render()

  function render() {
    // renderer.render(scene, camera)
    composer.render()

    requestAnimationFrame(render)
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.render(scene, camera)
  }

  window.addEventListener('resize', handleResize)
}