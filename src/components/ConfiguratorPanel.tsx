"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useConfigurator } from "@/store/useConfigurator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { FRAME_COLORS, MATTE_COLORS, SIZES, MATERIALS, GLASS_OPTIONS } from "@/lib/pricing";
import library from "@/data/library.ts";

// --- Extras de customização de moldura (sem quebrar a store atual) ---
const FRAME_PROFILES = [
  { id: "flat", label: "Reta (flat)" },
  { id: "bevel", label: "Chanfrada (bevel)" },
  { id: "round", label: "Arredondada" },
];

const FRAME_TEXTURES = [
  { id: "plain", label: "Liso" },
  { id: "wood", label: "Madeira" },
  { id: "brushed", label: "Metal escovado" },
];

const FINISHES = [
  { id: "matte", label: "Fosco" },
  { id: "satin", label: "Semibrilho" },
  { id: "gloss", label: "Brilhante" },
];

const PREVIEW_QUALITY = [
  { id: "fast", label: "Rápido" },
  { id: "balanced", label: "Equilíbrio" },
  { id: "high", label: "Alta" },
];

// Chaves de cache local
const UPLOAD_CACHE_KEY = "pv-frame-uploads-v1";
const LAST_UPLOAD_SELECTED_KEY = "pv-frame-last-upload-id";

// Utilitário para formatar preço de forma segura
function formatBRL(value: any) {
  const num = typeof value === "number" ? value : Number(value ?? 0);
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Calcula razão aproximada (ex.: 4:5)
function ratioLabel(w: number, h: number) {
  if (!w || !h) return "";
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(Math.round(w), Math.round(h));
  return `${Math.round(w / g)}:${Math.round(h / g)}`;
}

// Redimensiona imagem para preview e retorna dataURL (cache apenas para exibição)
async function imageToDataURL(file: File, maxSize = 2048, quality = 0.9): Promise<{ dataUrl: string; width: number; height: number }>
{
  const img = document.createElement("img");
  const blobUrl = URL.createObjectURL(file);
  img.src = blobUrl;
  await new Promise((res, rej) => {
    img.onload = () => res(null);
    img.onerror = rej;
  });
  const { width: w, height: h } = img;
  const scale = Math.min(1, maxSize / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  URL.revokeObjectURL(blobUrl);
  return { dataUrl, width: canvas.width, height: canvas.height };
}

export default function ConfiguratorPanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
    calculatePrice,
    // Chamadas opcionais – só serão usadas se existirem na store
    // @ts-ignore
    setFrameProfile,
    // @ts-ignore
    setFrameTexture,
    // @ts-ignore
    setFrameFinish,
    // @ts-ignore
    setCornerRadius,
    // @ts-ignore
    setPreviewQuality,
  } = useConfigurator();

  // Estado local para extras caso a store ainda não tenha os setters
  const [localExtras, setLocalExtras] = useState({
    frameProfile: "flat",
    frameTexture: "plain",
    frameFinish: "matte",
    cornerRadius: 0,
    previewQuality: "balanced",
  });

  // Uploads em cache local
  const [uploads, setUploads] = useState<Array<{ id: string; url: string; title: string; ratio: string }>>([]);

  // Carregar uploads do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(UPLOAD_CACHE_KEY);
      if (raw) setUploads(JSON.parse(raw));
    } catch {}
  }, []);

  // Recalcula preço quando dependências mudarem
  useEffect(() => {
    calculatePrice();
  }, [frameColor, frameThickness, frameDepth, matteEnabled, matteWidth, size, material, glass, calculatePrice]);

  // Propagar extras para consumidores (FrameMesh pode ouvir este evento)
  useEffect(() => {
    const payload = {
      frameProfile: localExtras.frameProfile,
      frameTexture: localExtras.frameTexture,
      frameFinish: localExtras.frameFinish,
      cornerRadius: localExtras.cornerRadius,
      previewQuality: localExtras.previewQuality,
    };
    window.dispatchEvent(new CustomEvent("configurator:extras", { detail: payload }));
  }, [localExtras]);

  const handleArtSelect = (art: any) => {
    setArt?.(art);
    calculatePrice();
    // Guarda último upload selecionado (se for upload)
    if (String(art.id).startsWith("upload:")) {
      try { localStorage.setItem(LAST_UPLOAD_SELECTED_KEY, String(art.id)); } catch {}
    }
  };

  const handleFrameColorChange = (color: string) => {
    setFrameColor?.(color);
    calculatePrice();
  };

  const handleMatteToggle = (enabled: boolean) => {
    setMatteEnabled?.(enabled);
    calculatePrice();
  };

  const handleSizeChange = (newSize: any) => {
    setSize?.(newSize);
    calculatePrice();
  };

  const handleMaterialChange = (newMaterial: any) => {
    setMaterial?.(newMaterial);
    calculatePrice();
  };

  const setExtra = (key: keyof typeof localExtras, value: any) => {
    // Tenta store, senão cai no estado local
    if (key === "frameProfile") setFrameProfile?.(value);
    if (key === "frameTexture") setFrameTexture?.(value);
    if (key === "frameFinish") setFrameFinish?.(value);
    if (key === "cornerRadius") setCornerRadius?.(value);
    if (key === "previewQuality") setPreviewQuality?.(value);
    setLocalExtras((s) => ({ ...s, [key]: value }));
    calculatePrice();
  };

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    try {
      const { dataUrl, width, height } = await imageToDataURL(file, 2400, 0.92);
      const id = `upload:${Date.now()}`;
      const art = { id, url: dataUrl, title: file.name.replace(/\.[^.]+$/, ""), ratio: ratioLabel(width, height) };
      // Atualiza cache (mantém no máximo 8)
      const next = [art, ...uploads.filter((u) => u.id !== id)].slice(0, 8);
      setUploads(next);
      try { localStorage.setItem(UPLOAD_CACHE_KEY, JSON.stringify(next)); } catch {}
      try { localStorage.setItem(LAST_UPLOAD_SELECTED_KEY, id); } catch {}
      // Seleciona a arte recém‑enviada
      handleArtSelect(art);
    } catch (e) {
      console.error("Falha ao processar imagem:", e);
      alert("Não foi possível processar a imagem. Tente outra foto.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const sizeLabel = useMemo(() => `${size?.w ?? "-"}×${size?.h ?? "-"} cm`, [size]);

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
          <div className="space-y-3">
            <Label className="text-sm font-medium block">Envie sua própria foto</Label>
            <div className="border-2 border-dashed rounded-xl p-4 text-center hover:bg-muted/50 transition" onClick={onPickFile}>
              <p className="text-sm mb-2">Clique ou arraste uma imagem (JPG/PNG, até ~10MB)</p>
              <Button variant="secondary" size="sm" onClick={onPickFile}>Fazer upload</Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>
          </div>

          {uploads.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 block">Meus uploads</Label>
              <div className="grid grid-cols-2 gap-3">
                {uploads.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleArtSelect(art)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      artId === art.id ? "border-primary" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img src={art.url} alt={art.title} className="w-full h-24 object-cover" />
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">{art.title}</p>
                      <p className="text-xs text-muted-foreground">{art.ratio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium mb-3 block">Escolha sua arte</Label>
            <div className="grid grid-cols-2 gap-3">
              {library.map((art: any) => (
                <div
                  key={art.id}
                  onClick={() => handleArtSelect(art)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    artId === art.id ? "border-primary" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={art.url} alt={art.title} className="w-full h-24 object-cover" />
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
              {FRAME_COLORS.map((color: any) => (
                <button
                  key={color.value}
                  onClick={() => handleFrameColorChange(color.value)}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    frameColor === color.value ? "border-primary" : "border-border hover:border-muted-foreground"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Perfil da moldura */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Perfil da moldura</Label>
            <div className="grid grid-cols-3 gap-2">
              {FRAME_PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setExtra("frameProfile", p.id)}
                  className={`p-2 rounded-lg border transition-all text-xs ${
                    localExtras.frameProfile === p.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textura & acabamento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Textura</Label>
              <div className="space-y-2">
                {FRAME_TEXTURES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setExtra("frameTexture", t.id)}
                    className={`w-full p-2 rounded-lg border transition-all text-left text-sm ${
                      localExtras.frameTexture === t.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-3 block">Acabamento</Label>
              <div className="space-y-2">
                {FINISHES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setExtra("frameFinish", f.id)}
                    className={`w-full p-2 rounded-lg border transition-all text-left text-sm ${
                      localExtras.frameFinish === f.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Espessura / Profundidade */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Espessura: {frameThickness}mm</Label>
            <Slider
              value={[frameThickness]}
              onValueChange={([value]) => {
                setFrameThickness?.(value as number);
                calculatePrice();
              }}
              max={30}
              min={8}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Profundidade: {frameDepth}mm</Label>
            <Slider
              value={[frameDepth]}
              onValueChange={([value]) => {
                setFrameDepth?.(value as number);
                calculatePrice();
              }}
              max={50}
              min={20}
              step={5}
              className="w-full"
            />
          </div>

          {/* Cantos arredondados */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Raio dos cantos: {localExtras.cornerRadius}mm</Label>
            <Slider
              value={[localExtras.cornerRadius]}
              onValueChange={([value]) => setExtra("cornerRadius", value as number)}
              max={16}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Passe-partout */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Passe-partout</Label>
              <Switch checked={!!matteEnabled} onCheckedChange={handleMatteToggle} />
            </div>

            {matteEnabled && (
              <>
                <div>
                  <Label className="text-sm font-medium mb-3 block">Largura: {matteWidth}cm</Label>
                  <Slider
                    value={[matteWidth]}
                    onValueChange={([value]) => {
                      setMatteWidth?.(value as number);
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
                    {MATTE_COLORS.map((color: any) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setMatteColor?.(color.value);
                          calculatePrice();
                        }}
                        className={`h-10 rounded-lg border-2 transition-all ${
                          matteColor === color.value ? "border-primary" : "border-border hover:border-muted-foreground"
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

          {/* Qualidade de preview (apenas visual) */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Qualidade de renderização (preview)</Label>
            <div className="grid grid-cols-3 gap-2">
              {PREVIEW_QUALITY.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setExtra("previewQuality", q.id)}
                  className={`p-2 rounded-lg border transition-all text-xs ${
                    localExtras.previewQuality === q.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Apenas para exibição local – não afeta o pedido.</p>
          </div>
        </TabsContent>

        {/* Size Selection */}
        <TabsContent value="size" className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Tamanho do quadro</Label>
            <div className="space-y-2">
              {SIZES.map((sizeOption: any) => (
                <button
                  key={`${sizeOption.w}x${sizeOption.h}`}
                  onClick={() => handleSizeChange({ w: sizeOption.w, h: sizeOption.h })}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    size?.w === sizeOption.w && size?.h === sizeOption.h
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground"
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
              {MATERIALS.map((mat: any) => (
                <button
                  key={mat.id}
                  onClick={() => handleMaterialChange(mat.id)}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    material === mat.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
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
              {GLASS_OPTIONS.map((glassOption: any) => (
                <button
                  key={glassOption.id}
                  onClick={() => {
                    setGlass?.(glassOption.id);
                    calculatePrice();
                  }}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    glass === glassOption.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
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
            <span className="font-medium">{sizeLabel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Material:</span>
            <span className="font-medium capitalize">{String(material)}</span>
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
              <span className="text-2xl font-bold text-primary">R$ {formatBRL(price)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Prazo: 5–7 dias úteis</p>
          </div>
          <Button className="w-full btn-cta">Continuar para revisão</Button>
        </CardContent>
      </Card>
    </div>
  );
}
