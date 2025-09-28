// src/components/FrameMesh.tsx
import { useEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useConfigurator } from '@/store/useConfigurator';
import * as THREE from 'three';
import defaultArt from '@/assets/art-abstract-1.jpg'; // fallback bundle-safe

export default function FrameMesh() {
  const {
    artUrl,
    ratio,
    frameColor,
    frameThickness, // mm
    frameDepth,     // mm
    matteEnabled,
    matteWidth,     // cm
    matteColor,
  } = useConfigurator();

  // 1) Pré-checar a URL de arte para nunca passar URL ruim ao useTexture
  const [resolvedUrl, setResolvedUrl] = useState<string>(defaultArt);

  useEffect(() => {
    const url = (artUrl && artUrl.trim()) ? artUrl : defaultArt;
    let canceled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { if (!canceled) setResolvedUrl(url); };
    img.onerror = () => { if (!canceled) setResolvedUrl(defaultArt); };
    img.src = url;
    return () => { canceled = true; };
  }, [artUrl]);

  // 2) Carregar textura APENAS da URL pré-validada
  const { gl } = useThree();
  const texture = useTexture(resolvedUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = gl.capabilities.getMaxAnisotropy();
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

  // 3) Suas dimensões, idem ao que você já tinha
  const artDimensions = useMemo(() => {
    switch (ratio) {
      case '1:1':  return { width: 3,   height: 3 };
      case '2:3':  return { width: 2,   height: 3 };
      case '3:2':  return { width: 4.5, height: 3 };
      case '4:5':  return { width: 3.2, height: 4 };
      case '16:9': return { width: 4,   height: 2.25 };
      case '3:4':
      default:     return { width: 3,   height: 4 };
    }
  }, [ratio]);

  const frameThick = frameThickness / 100;
  const frameDeep  = frameDepth  / 100;
  const matteW     = matteEnabled ? matteWidth / 10 : 0;

  return (
    <group>
      {/* Arte */}
      <mesh position={[0, 0, frameDeep / 2 + 0.01]}>
        <planeGeometry args={[artDimensions.width, artDimensions.height]} />
        <meshStandardMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Passe-partout */}
      {matteEnabled && (
        <mesh position={[0, 0, frameDeep / 2]}>
          <planeGeometry args={[
            artDimensions.width + matteW * 2,
            artDimensions.height + matteW * 2
          ]}/>
          <meshStandardMaterial color={matteColor} />
        </mesh>
      )}

      {/* Moldura topo/base/esq/dir */}
      <mesh position={[0,  artDimensions.height/2 + frameThick/2 + matteW, frameDeep/2]}>
        <boxGeometry args={[artDimensions.width + frameThick*2 + matteW*2, frameThick, frameDeep]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      <mesh position={[0, -artDimensions.height/2 - frameThick/2 - matteW, frameDeep/2]}>
        <boxGeometry args={[artDimensions.width + frameThick*2 + matteW*2, frameThick, frameDeep]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      <mesh position={[-artDimensions.width/2 - frameThick/2 - matteW, 0, frameDeep/2]}>
        <boxGeometry args={[frameThick, artDimensions.height + matteW*2, frameDeep]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      <mesh position={[ artDimensions.width/2 + frameThick/2 + matteW, 0, frameDeep/2]}>
        <boxGeometry args={[frameThick, artDimensions.height + matteW*2, frameDeep]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Fundo */}
      <mesh position={[0, 0, -frameDeep/2]}>
        <boxGeometry args={[
          artDimensions.width  + frameThick*2 + matteW*2,
          artDimensions.height + frameThick*2 + matteW*2,
          0.1
        ]}/>
        <meshStandardMaterial color={frameColor} />
      </mesh>
    </group>
  );
}
