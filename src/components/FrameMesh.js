import { useTexture } from '@react-three/drei';
import { useConfigurator } from '@/store/useConfigurator';
import { useMemo } from 'react';
import * as THREE from 'three';

export default function FrameMesh() {
  const {
    artUrl,
    ratio,
    frameColor,
    frameThickness,
    frameDepth,
    matteEnabled,
    matteWidth,
    matteColor,
    size
  } = useConfigurator();

  // Load texture
  const texture = useTexture(artUrl);
  
  // Calculate dimensions based on ratio
  const artDimensions = useMemo(() => {
    let width = 3;
    let height = 4;
    
    switch (ratio) {
      case '1:1':
        width = height = 3;
        break;
      case '3:4':
        width = 3;
        height = 4;
        break;
      case '2:3':
        width = 2;
        height = 3;
        break;
      case '4:5':
        width = 3.2;
        height = 4;
        break;
      case '16:9':
        width = 4;
        height = 2.25;
        break;
      case '3:2':
        width = 4.5;
        height = 3;
        break;
      default:
        width = 3;
        height = 4;
    }
    
    return { width, height };
  }, [ratio]);

  const frameThick = frameThickness / 100; // Convert mm to scene units
  const frameDeep = frameDepth / 100;
  const matteW = matteEnabled ? matteWidth / 10 : 0; // Convert cm to scene units

  return (
    <group>
      {/* Art Image */}
      <mesh position={[0, 0, frameDeep / 2 + 0.01]}>
        <planeGeometry args={[artDimensions.width, artDimensions.height]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Matte (Passe-partout) */}
      {matteEnabled && (
        <mesh position={[0, 0, frameDeep / 2]}>
          <planeGeometry args={[artDimensions.width + matteW * 2, artDimensions.height + matteW * 2]} />
          <meshStandardMaterial color={matteColor} />
        </mesh>
      )}

      {/* Frame - Top */}
      <mesh position={[0, artDimensions.height / 2 + frameThick / 2 + matteW, frameDeep / 2]}>
        <boxGeometry args={[artDimensions.width + frameThick * 2 + matteW * 2, frameThick, frameDeep]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Frame - Bottom */}
      <mesh position={[0, -artDimensions.height / 2 - frameThick / 2 - matteW, frameDeep / 2]}>
        <boxGeometry args={[artDimensions.width + frameThick * 2 + matteW * 2, frameThick, frameDeep]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Frame - Left */}
      <mesh position={[-artDimensions.width / 2 - frameThick / 2 - matteW, 0, frameDeep / 2]}>
        <boxGeometry args={[frameThick, artDimensions.height + matteW * 2, frameDeep]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Frame - Right */}
      <mesh position={[artDimensions.width / 2 + frameThick / 2 + matteW, 0, frameDeep / 2]}>
        <boxGeometry args={[frameThick, artDimensions.height + matteW * 2, frameDeep]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Frame Back */}
      <mesh position={[0, 0, -frameDeep / 2]}>
        <boxGeometry args={[artDimensions.width + frameThick * 2 + matteW * 2, artDimensions.height + frameThick * 2 + matteW * 2, 0.1]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
    </group>
  );
}