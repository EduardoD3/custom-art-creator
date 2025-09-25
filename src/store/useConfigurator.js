import { create } from 'zustand';

export const useConfigurator = create((set, get) => ({
  // Arte
  artSource: 'library', // 'upload' | 'library'
  artUrl: '/assets/art-abstract-1.jpg',
  artId: 'abstract-001',
  ratio: '4:5',
  
  // Moldura
  frameColor: '#1A1A1A', // nt-charcoal
  frameThickness: 12, // mm
  frameDepth: 30, // mm (shadow box depth)
  
  // Passe-partout
  matteEnabled: false,
  matteWidth: 4, // cm
  matteColor: '#F0F0F0',
  
  // Tamanho (cm)
  size: { w: 50, h: 70 },
  
  // Material e acabamento
  material: 'papel', // 'papel' | 'canvas' | 'vidro'
  glass: 'nenhum', // 'nenhum' | 'comum' | 'museu'
  
  // Preços e identificação
  price: 0,
  baseSku: 'QUAD-PERS',
  
  // Snapshot para revisão
  snapshotUrl: null,
  
  // Actions
  setArt: (artData) => set({ 
    artUrl: artData.url, 
    artId: artData.id, 
    ratio: artData.ratio,
    artSource: 'library'
  }),
  
  setFrameColor: (color) => set({ frameColor: color }),
  setFrameThickness: (thickness) => set({ frameThickness: thickness }),
  setFrameDepth: (depth) => set({ frameDepth: depth }),
  
  setMatteEnabled: (enabled) => set({ matteEnabled: enabled }),
  setMatteWidth: (width) => set({ matteWidth: width }),
  setMatteColor: (color) => set({ matteColor: color }),
  
  setSize: (size) => set({ size }),
  setMaterial: (material) => set({ material }),
  setGlass: (glass) => set({ glass }),
  
  setSnapshotUrl: (url) => set({ snapshotUrl: url }),
  
  // Calcular preço automaticamente
  calculatePrice: () => {
    const state = get();
    const { size, material, frameThickness, glass, matteEnabled, matteWidth } = state;
    
    // Área em m²
    const area = (size.w * size.h) / 10000;
    
    // Preço base + área
    let price = 120 + area * 280;
    
    // Material
    if (material === 'canvas') price += area * 90;
    if (material === 'vidro') price += area * 140;
    
    // Moldura
    price += frameThickness * 1.2;
    
    // Proteção
    if (glass === 'comum') price += area * 60;
    if (glass === 'museu') price += area * 150;
    
    // Passe-partout
    if (matteEnabled) price += matteWidth * 2;
    
    const finalPrice = Math.round(price);
    set({ price: finalPrice });
    return finalPrice;
  },
  
  // Reset configuração
  reset: () => set({
    artSource: 'library',
    artUrl: '/assets/art-abstract-1.jpg',
    artId: 'abstract-001',
    ratio: '4:5',
    frameColor: '#1A1A1A',
    frameThickness: 12,
    frameDepth: 30,
    matteEnabled: false,
    matteWidth: 4,
    matteColor: '#F0F0F0',
    size: { w: 50, h: 70 },
    material: 'papel',
    glass: 'nenhum',
    price: 0,
    snapshotUrl: null
  })
}));