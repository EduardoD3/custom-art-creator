"use state"

import { Suspense, useEffect } from 'react';
import { useConfigurator } from '@/store/useConfigurator';
import Header from '@/components/Header';
import ConfiguratorPanel from '@/components/ConfiguratorPanel';
import ThreeViewer from '@/components/ThreeViewer';

export default function Customizar() {
  const calculatePrice = useConfigurator(state => state.calculatePrice);

  useEffect(() => {
    // Calculate initial price when component mounts
    calculatePrice();
  }, [calculatePrice]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            Personalize seu <span className="text-primary">quadro</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Configure cada detalhe com preview 3D em tempo real. 
            Ajuste moldura, passe-partout, tamanho e material até encontrar o resultado perfeito.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-xl p-4 shadow-soft">
              <h2 className="font-display text-xl font-semibold mb-4">Preview 3D</h2>
              <Suspense 
                fallback={
                  <div className="w-full h-96 lg:h-[500px] bg-muted rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Carregando preview 3D...</p>
                    </div>
                  </div>
                }
              >
                <ThreeViewer />
              </Suspense>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="bg-muted px-3 py-1 rounded-full text-sm">
                  <span className="text-muted-foreground">Dica:</span> Arraste para rotacionar
                </div>
                <div className="bg-muted px-3 py-1 rounded-full text-sm">
                  <span className="text-muted-foreground">Scroll:</span> Zoom
                </div>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg text-center shadow-soft">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">3D</span>
                </div>
                <h3 className="font-medium mb-1">Preview Real</h3>
                <p className="text-sm text-muted-foreground">Visualize exatamente como ficará</p>
              </div>
              
              <div className="bg-card p-4 rounded-lg text-center shadow-soft">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">⚡</span>
                </div>
                <h3 className="font-medium mb-1">Tempo Real</h3>
                <p className="text-sm text-muted-foreground">Mudanças instantâneas</p>
              </div>
              
              <div className="bg-card p-4 rounded-lg text-center shadow-soft">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">✨</span>
                </div>
                <h3 className="font-medium mb-1">Alta Qualidade</h3>
                <p className="text-sm text-muted-foreground">Materiais premium</p>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <ConfiguratorPanel />
          </div>
        </div>
      </div>
    </div>
  );
}