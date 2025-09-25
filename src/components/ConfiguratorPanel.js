import { useState } from 'react';
import { useConfigurator } from '@/store/useConfigurator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { FRAME_COLORS, MATTE_COLORS, SIZES, MATERIALS, GLASS_OPTIONS } from '@/lib/pricing';
import library from '@/data/library.json';

export default function ConfiguratorPanel() {
  const {
    artUrl,
    artId,
    frameColor,
    frameThickness,
    frameDepth,
    matteEnabled,
    matteWidth,
    matteColor,
    size,
    material,
    glass,
    price,
    setArt,
    setFrameColor,
    setFrameThickness,
    setFrameDepth,
    setMatteEnabled,
    setMatteWidth,
    setMatteColor,
    setSize,
    setMaterial,
    setGlass,
    calculatePrice
  } = useConfigurator();

  useState(() => {
    calculatePrice();
  }, [frameColor, frameThickness, frameDepth, matteEnabled, matteWidth, size, material, glass]);

  const handleArtSelect = (art) => {
    setArt(art);
    calculatePrice();
  };

  const handleFrameColorChange = (color) => {
    setFrameColor(color);
    calculatePrice();
  };

  const handleMatteToggle = (enabled) => {
    setMatteEnabled(enabled);
    calculatePrice();
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    calculatePrice();
  };

  const handleMaterialChange = (newMaterial) => {
    setMaterial(newMaterial);
    calculatePrice();
  };

  return (
    <div className="w-full lg:w-80 bg-card rounded-xl shadow-soft p-6">
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="image" className="text-xs">Imagem</TabsTrigger>
          <TabsTrigger value="frame" className="text-xs">Moldura</TabsTrigger>
          <TabsTrigger value="size" className="text-xs">Tamanho</TabsTrigger>
          <TabsTrigger value="material" className="text-xs">Material</TabsTrigger>
        </TabsList>

        {/* Image Selection */}
        <TabsContent value="image" className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Escolha sua arte</Label>
            <div className="grid grid-cols-2 gap-3">
              {library.map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleArtSelect(art)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    artId === art.id ? 'border-primary' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <img
                    src={art.url}
                    alt={art.title}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{art.title}</p>
                    <p className="text-xs text-muted-foreground">{art.ratio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Frame Configuration */}
        <TabsContent value="frame" className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Cor da moldura</Label>
            <div className="grid grid-cols-3 gap-2">
              {FRAME_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleFrameColorChange(color.value)}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    frameColor === color.value ? 'border-primary' : 'border-border hover:border-muted-foreground'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">
              Espessura: {frameThickness}mm
            </Label>
            <Slider
              value={[frameThickness]}
              onValueChange={([value]) => {
                setFrameThickness(value);
                calculatePrice();
              }}
              max={30}
              min={8}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">
              Profundidade: {frameDepth}mm
            </Label>
            <Slider
              value={[frameDepth]}
              onValueChange={([value]) => {
                setFrameDepth(value);
                calculatePrice();
              }}
              max={50}
              min={20}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Passe-partout</Label>
              <Switch
                checked={matteEnabled}
                onCheckedChange={handleMatteToggle}
              />
            </div>
            
            {matteEnabled && (
              <>
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Largura: {matteWidth}cm
                  </Label>
                  <Slider
                    value={[matteWidth]}
                    onValueChange={([value]) => {
                      setMatteWidth(value);
                      calculatePrice();
                    }}
                    max={8}
                    min={2}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-3 block">Cor do passe-partout</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {MATTE_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setMatteColor(color.value);
                          calculatePrice();
                        }}
                        className={`h-10 rounded-lg border-2 transition-all ${
                          matteColor === color.value ? 'border-primary' : 'border-border hover:border-muted-foreground'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* Size Selection */}
        <TabsContent value="size" className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Tamanho do quadro</Label>
            <div className="space-y-2">
              {SIZES.map((sizeOption) => (
                <button
                  key={`${sizeOption.w}x${sizeOption.h}`}
                  onClick={() => handleSizeChange({ w: sizeOption.w, h: sizeOption.h })}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    size.w === sizeOption.w && size.h === sizeOption.h
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="font-medium">{sizeOption.label}</div>
                  <div className="text-sm text-muted-foreground">{sizeOption.ratio}</div>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Material Selection */}
        <TabsContent value="material" className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Material</Label>
            <div className="space-y-2">
              {MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => handleMaterialChange(mat.id)}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    material === mat.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="font-medium">{mat.name}</div>
                  <div className="text-sm text-muted-foreground">{mat.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Proteção</Label>
            <div className="space-y-2">
              {GLASS_OPTIONS.map((glassOption) => (
                <button
                  key={glassOption.id}
                  onClick={() => {
                    setGlass(glassOption.id);
                    calculatePrice();
                  }}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    glass === glassOption.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="font-medium">{glassOption.name}</div>
                  <div className="text-sm text-muted-foreground">{glassOption.description}</div>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Price Box */}
      <Card className="mt-6 bg-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resumo do pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tamanho:</span>
            <span className="font-medium">{size.w}×{size.h} cm</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Material:</span>
            <span className="font-medium capitalize">{material}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Moldura:</span>
            <span className="font-medium">{frameThickness}mm</span>
          </div>
          {matteEnabled && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Passe-partout:</span>
              <span className="font-medium">{matteWidth}cm</span>
            </div>
          )}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {price}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Prazo: 5-7 dias úteis
            </p>
          </div>
          <Button className="w-full btn-cta">
            Continuar para revisão
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}