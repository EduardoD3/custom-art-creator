import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import FrameMesh from './FrameMesh';

export default function ThreeViewer() {
  return (
    <div className="w-full h-96 lg:h-[500px] bg-nt-sand/10 rounded-xl overflow-hidden shadow-soft">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 65 }}
        dpr={[1, 2]}
        shadows={false}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.0} />
          <Environment preset="studio" />
          
          <FrameMesh /> {/* Agora gira sozinho */}

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            maxDistance={8}
            minDistance={3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
