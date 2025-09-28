import { useRef, useMemo, useEffect } from 'react';
import { GroupProps, useFrame, ThreeEvent } from '@react-three/fiber';
import { Center, ContactShadows, Environment, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

type RealisticFrameProps = GroupProps & {
  artUrl?: string;          // URL da arte (ex: "/images/arte.jpg")
  ratio?: number;           // Largura/Altura da imagem (ex: 3/4). Default: 3/4
  outerWidth?: number;      // Largura total do quadro em metros. Default: 1.0
  frameWidth?: number;      // Largura da moldura (borda) em metros. Default: 0.05
  frameDepth?: number;      // Profundidade da moldura. Default: 0.04
  bevel?: number;           // Chanfro visual (simulado com pequenos offsets). Default: 0.008
  matteWidth?: number;      // Passe-partout (borda interna). Default: 0.02
  glass?: boolean;          // Renderiza vidro? Default: true
  woodTextureUrl?: string;  // Opcional: textura de madeira ("/textures/wood.jpg")
  autoRotate?: boolean;     // Rotação automática sutil. Default: true
};

export default function RealisticFrame({
  artUrl = '/images/placeholder.jpg',
  ratio = 3 / 4,
  outerWidth = 1.0,
  frameWidth = 0.05,
  frameDepth = 0.04,
  bevel = 0.008,
  matteWidth = 0.02,
  glass = true,
  woodTextureUrl,
  autoRotate = true,
  ...groupProps
}: RealisticFrameProps) {
  const group = useRef<THREE.Group>(null);

  // Altura a partir do ratio (W/H = ratio => H = W/ratio)
  const outerHeight = useMemo(() => outerWidth / ratio, [outerWidth, ratio]);

  // Área visível (janela interna) depois da moldura
  const innerWidth = useMemo(() => outerWidth - frameWidth * 2, [outerWidth, frameWidth]);
  const innerHeight = useMemo(() => outerHeight - frameWidth * 2, [outerHeight, frameWidth]);

  // Área da arte com passe-partout
  const artWidth = useMemo(() => innerWidth - matteWidth * 2, [innerWidth, matteWidth]);
  const artHeight = useMemo(() => innerHeight - matteWidth * 2, [innerHeight, matteWidth]);

  // Textura da arte
  const texture = useTexture(artUrl);
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }, [texture]);

  // Textura da madeira (opcional)
  const woodTex = useTexture(
    woodTextureUrl ? { map: woodTextureUrl, roughnessMap: woodTextureUrl } : {} as any
  ) as any;

  if (woodTex.map) {
    woodTex.map.colorSpace = THREE.SRGBColorSpace;
    woodTex.map.wrapS = woodTex.map.wrapT = THREE.RepeatWrapping;
    woodTex.map.repeat.set(1.5, 1.5);
  }

  // Rotação automática sutil
  useFrame((_, dt) => {
    if (!autoRotate || !group.current) return;
    group.current.rotation.y += dt * 0.15; // ~8.6°/s
  });

  // Materiais PBR
  const frameMaterial = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: woodTex.map ? 0xffffff : 0x5f4b3a, // marrom se sem textura
      roughness: 0.5,
      metalness: 0.05,
      clearcoat: 0.2,
      clearcoatRoughness: 0.4,
      map: woodTex.map ?? null,
      roughnessMap: woodTex.roughnessMap ?? null,
    });
    return m;
  }, [woodTex.map, woodTex.roughnessMap]);

  const matteMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xf2f2f2,
        roughness: 0.9,
        metalness: 0.0,
      }),
    []
  );

  const artMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0.0,
      }),
    [texture]
  );

  const backboardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.0,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.98, // vidro real (requer WebGL2)
        thickness: 0.01,
        roughness: 0.05,
        ior: 1.5,
        reflectivity: 0.5,
        transparent: true,
        opacity: 1,
      }),
    []
  );

  // Helpers para criar as 4 "réguas" da moldura
  const railZ = frameDepth / 2;                // moldura mais "para frente"
  const boardZ = -frameDepth * 0.25;           // backboard atrás
  const artZ = railZ - 0.01 - bevel;           // arte um pouco atrás do vidro
  const glassZ = railZ + 0.001;                // quase na face frontal
  const matteZ = artZ + 0.001;                 // passe-partout levemente na frente da arte (visualmente junto)

  // Gestos (opcional): clique para centralizar/pausar rotação
  const rotatingRef = useRef<boolean>(autoRotate);
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    rotatingRef.current = !rotatingRef.current;
  };
  useEffect(() => {
    // sincroniza autoRotate externo com interno
    rotatingRef.current = autoRotate;
  }, [autoRotate]);
  useFrame(() => {
    if (!group.current) return;
    if (!rotatingRef.current) return;
  });

  return (
    <group ref={group} {...groupProps} onClick={onClick}>
      {/* Luz ambiente auxiliar para dar leitura em qualquer HDRI */}
      <ambientLight intensity={0.2} />

      {/* Conjunto centralizado */}
      <Center disableY>
        {/* 4 réguas (laterais) com leve "chanfro" simulado por offsets e escala */}
        {/* Horizontal superior */}
        <mesh
          position={[0, outerHeight / 2 - frameWidth / 2, railZ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[outerWidth, frameWidth, frameDepth]} />
          <meshPhysicalMaterial {...frameMaterial} />
        </mesh>

        {/* Horizontal inferior */}
        <mesh
          position={[0, -outerHeight / 2 + frameWidth / 2, railZ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[outerWidth, frameWidth, frameDepth]} />
          <meshPhysicalMaterial {...frameMaterial} />
        </mesh>

        {/* Vertical esquerda */}
        <mesh
          position={[-outerWidth / 2 + frameWidth / 2, 0, railZ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[frameWidth, outerHeight - frameWidth * 2 + bevel, frameDepth]} />
          <meshPhysicalMaterial {...frameMaterial} />
        </mesh>

        {/* Vertical direita */}
        <mesh
          position={[outerWidth / 2 - frameWidth / 2, 0, railZ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[frameWidth, outerHeight - frameWidth * 2 + bevel, frameDepth]} />
          <meshPhysicalMaterial {...frameMaterial} />
        </mesh>

        {/* Backboard (fundo) */}
        <mesh position={[0, 0, boardZ]} receiveShadow>
          <boxGeometry args={[innerWidth, innerHeight, frameDepth * 0.2]} />
          <meshStandardMaterial {...(backboardMaterial as any)} />
        </mesh>

        {/* Passe-partout (placa branca ligeiramente maior que a arte) */}
        <mesh position={[0, 0, matteZ]} receiveShadow>
          <planeGeometry args={[innerWidth - bevel * 2, innerHeight - bevel * 2]} />
          <meshPhysicalMaterial {...(matteMaterial as any)} />
        </mesh>

        {/* Arte */}
        <mesh position={[0, 0, artZ]} castShadow>
          <planeGeometry args={[artWidth, artHeight]} />
          <meshStandardMaterial {...(artMaterial as any)} />
        </mesh>

        {/* Vidro */}
        {glass && (
          <mesh position={[0, 0, glassZ]}>
            <planeGeometry args={[innerWidth - bevel * 1.5, innerHeight - bevel * 1.5]} />
            <meshPhysicalMaterial {...(glassMaterial as any)} />
          </mesh>
        )}
      </Center>

      {/* Sombras de contato para ancorar no “chão” */}
      <ContactShadows
        position={[0, -outerHeight / 2 - 0.05, 0]}
        scale={Math.max(outerWidth, outerHeight) * 2}
        opacity={0.4}
        blur={2}
        far={0.6}
        frames={60}
      />

      {/* Tool-tip simples */}
      <Html position={[0, outerHeight / 2 + 0.04, 0]} center distanceFactor={4}>
        <div
          style={{
            padding: '6px 10px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            fontSize: 12,
            borderRadius: 8,
            backdropFilter: 'blur(6px)',
            whiteSpace: 'nowrap',
          }}
        >
          Clique para pausar a rotação
        </div>
      </Html>
    </group>
  );
}
