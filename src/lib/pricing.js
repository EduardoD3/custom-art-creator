// Pricing engine for custom art frames
export function calcPrice({ size, material, frameThickness, glass, matteEnabled, matteWidth }) {
  // Área em metros quadrados
  const area = (size.w * size.h) / 10000;
  
  // Preço base (fixo) + preço por área
  let price = 120 + area * 280;
  
  // Adicional por material
  const materialPricing = {
    papel: 0,
    canvas: area * 90,
    vidro: area * 140
  };
  price += materialPricing[material] || 0;
  
  // Adicional por espessura da moldura (por mm)
  price += frameThickness * 1.2;
  
  // Adicional por proteção de vidro
  const glassPricing = {
    nenhum: 0,
    comum: area * 60,
    museu: area * 150
  };
  price += glassPricing[glass] || 0;
  
  // Adicional por passe-partout
  if (matteEnabled) {
    price += matteWidth * 2;
  }
  
  return Math.round(price);
}

// Sizes disponíveis com proporções
export const SIZES = [
  { w: 30, h: 40, label: '30×40 cm', ratio: '3:4' },
  { w: 40, h: 60, label: '40×60 cm', ratio: '2:3' },
  { w: 50, h: 70, label: '50×70 cm', ratio: '5:7' },
  { w: 60, h: 90, label: '60×90 cm', ratio: '2:3' },
  { w: 70, h: 100, label: '70×100 cm', ratio: '7:10' }
];

// Cores de moldura disponíveis
export const FRAME_COLORS = [
  { name: 'Preto', value: '#1A1A1A' },
  { name: 'Branco', value: '#FFFFFF' },
  { name: 'Madeira Clara', value: '#D4A574' },
  { name: 'Madeira Escura', value: '#8B4513' },
  { name: 'Dourado', value: '#DAA520' }
];

// Cores de passe-partout
export const MATTE_COLORS = [
  { name: 'Off-White', value: '#F8F8F8' },
  { name: 'Creme', value: '#F5F5DC' },
  { name: 'Cinza Claro', value: '#E8E8E8' },
  { name: 'Cinza Médio', value: '#D3D3D3' }
];

// Materiais disponíveis
export const MATERIALS = [
  { id: 'papel', name: 'Papel Fotográfico', description: 'Acabamento brilhante premium' },
  { id: 'canvas', name: 'Canvas', description: 'Textura artística em tela' },
  { id: 'vidro', name: 'Vidro Acrílico', description: 'Impressão sob vidro premium' }
];

// Opções de proteção
export const GLASS_OPTIONS = [
  { id: 'nenhum', name: 'Sem proteção', description: 'Apenas a impressão' },
  { id: 'comum', name: 'Vidro comum', description: 'Proteção básica anti-UV' },
  { id: 'museu', name: 'Vidro museu', description: 'Proteção premium anti-UV e anti-reflexo' }
];