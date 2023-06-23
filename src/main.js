import * as THREE from 'three'
// import typeface from 'three/examples/fonts/gentilis_bold.typeface.json' //기본제공 typeface 폰트 사용방법
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'

window.addEventListener('load', function() {
  init()
})

async function init() {
  const gui = new GUI()

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500,
  )

  camera.position.z = 5

  /** OrbitControls */
  new OrbitControls(camera, renderer.domElement)

  /** Font */
  const fontLoader = new FontLoader()

  const font = await fontLoader.loadAsync('./asset/fonts/The Jamsil 3 Regular_Regular.json')

  /** Text */
  const textGeometry = new TextGeometry('안녕, 친구들', {
    font,
    size: 0.5,
    height: 0.1,
  })

  const textMaterial = new THREE.MeshPhongMaterial({ color: 0x00c896 })

  const text = new THREE.Mesh(textGeometry, textMaterial)

  scene.add(text)

  /** AnbientLight */
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)

  scene.add(ambientLight)

  /** PointLight */
  const pointLight = new THREE.PointLight(0xffffff, 0.5)
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
  pointLight.position.set(3, 0, 2)

  scene.add(pointLight, pointLightHelper)

  gui
    .add(pointLight.position,'x')
    .min(-3)
    .max(3)
    .step(0.1);

  render()

  function render() {
    renderer.render(scene, camera)

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