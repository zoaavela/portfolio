import { useRef, useMemo, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Sky, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ── MOULIN ──
function WindMill() {
    const { scene } = useGLTF('/src/three/models/windmill.glb')
    const bladesRef = useRef()

    // Cherche le mesh des ailes
    useFrame((_, delta) => {
        scene.traverse(child => {
            if (child.name.toLowerCase().includes('blade') ||
                child.name.toLowerCase().includes('sail') ||
                child.name.toLowerCase().includes('wing')) {
                child.rotation.z += delta * 0.5
            }
        })
    })

    return (
        <primitive
            object={scene}
            position={[0, 2, -10]}
            scale={2}
        />
    )
}

// ── TULIPES ──
function TulipRow({ color, xOffset, count = 60 }) {
    const { scene } = useGLTF('/src/three/models/tulip.glb')
    const meshRef = useRef()

    const geometry = useMemo(() => {
        let geo
        scene.traverse(child => {
            if (child.isMesh && !geo) geo = child.geometry.clone()
        })
        return geo
    }, [scene])

    const matrix = useMemo(() => {
        const matrices = []
        for (let i = 0; i < count; i++) {
            const m = new THREE.Matrix4()
            const z = (i - count / 2) * 1.2 + (Math.random() - 0.5) * 0.3
            const x = xOffset + (Math.random() - 0.5) * 0.5
            const scale = 0.25 + Math.random() * 0.08
            m.compose(
                new THREE.Vector3(x, 0.5, z),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.random() * 0.4, 0)),
                new THREE.Vector3(scale, scale, scale)
            )
            matrices.push(m)
        }
        return matrices
    }, [count, xOffset])

    useEffect(() => {
        if (!meshRef.current) return
        matrix.forEach((m, i) => meshRef.current.setMatrixAt(i, m))
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [matrix])

    if (!geometry) return null

    return (
        <instancedMesh ref={meshRef} args={[geometry, null, count]} castShadow>
            <meshStandardMaterial color={color} roughness={0.8} />
        </instancedMesh>
    )
}

function Tulips() {
    const ROWS = [
        { color: '#E8004D', x: -13 },
        { color: '#E8004D', x: -11 },
        { color: '#FFD700', x: -9 },
        { color: '#FFD700', x: -7 },
        { color: '#FF69B4', x: -5 },
        { color: '#FF69B4', x: -3 },
        { color: '#FF6600', x: -1 },
        { color: '#FF6600', x: 1 },
        { color: '#E8004D', x: 3 },
        { color: '#FF1493', x: 5 },
        { color: '#FF1493', x: 7 },
        { color: '#FFD700', x: 9 },
        { color: '#FFD700', x: 11 },
        { color: '#E8004D', x: 13 },
    ]

    return (
        <>
            {ROWS.map((row, i) => (
                <TulipRow key={i} color={row.color} xOffset={row.x} count={80} />
            ))}
        </>
    )
}

// ── TERRAIN ──
function Terrain() {
    const geo = useMemo(() => {
        const g = new THREE.PlaneGeometry(100, 100, 32, 32)
        const pos = g.attributes.position
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i)
            const z = pos.getY(i)
            pos.setZ(i, Math.sin(x * 0.1) * 0.3 + Math.cos(z * 0.15) * 0.2)
        }
        g.computeVertexNormals()
        return g
    }, [])

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <primitive object={geo} />
            <meshStandardMaterial color="#4A8C2A" roughness={1} />
        </mesh>
    )
}

// ── CAMÉRA ──
function CameraRig() {
    const { camera } = useThree()
    const mouse = useRef({ x: 0, y: 0 })

    useFrame(() => {
        camera.position.x += (mouse.current.x * 4 - camera.position.x) * 0.02
        camera.position.y += (mouse.current.y * 1.5 + 4 - camera.position.y) * 0.02
        camera.lookAt(0, 0, 0)
    })

    return (
        <mesh
            onPointerMove={e => {
                mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
                mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
            }}
        >
            <planeGeometry args={[1000, 1000]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    )
}

// ── SCÈNE ──
function Scene() {
    return (
        <>
            <Sky
                sunPosition={[1, 0.1, 0]}
                turbidity={10}
                rayleigh={3}
                mieCoefficient={0.005}
                mieDirectionalG={0.8}
            />
            <fog attach="fog" args={['#ffcf7a', 25, 70]} />
            <ambientLight intensity={0.4} color="#ffd580" />
            <directionalLight
                position={[-20, 15, 10]}
                intensity={2}
                color="#ff9f4a"
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <hemisphereLight
                skyColor="#87CEEB"
                groundColor="#4A8C2A"
                intensity={0.6}
            />

            <Terrain />

            <Suspense fallback={null}>
                <WindMill />
                <Tulips count={300} />
            </Suspense>

            <CameraRig />
        </>
    )
}

export default function DutchField() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas
                camera={{ position: [0, 5, 15], fov: 60 }}
                shadows
                gl={{ antialias: true }}
            >
                <Scene />
            </Canvas>
        </div>
    )
}