import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import heroImage from '@/assets/hero-gallery.jpg';
import abstractArt from '@/assets/art-abstract-1.jpg';
import landscapeArt from '@/assets/art-landscape-1.jpg';
import minimalArt from '@/assets/art-minimal-1.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Transforme suas <span className="text-primary">memórias</span> em obras de arte
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Crie quadros personalizados com preview 3D em tempo real. 
                Escolha molduras, materiais e acabamentos premium para transformar 
                qualquer imagem em uma peça única para seu espaço.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/customizar">
                  <Button className="btn-cta text-lg px-8 py-4">
                    Personalizar meu quadro
                  </Button>
                </Link>
                <Button variant="outline" className="text-lg px-8 py-4 border-2">
                  Ver galeria
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Preview 3D em tempo real</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Materiais premium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Entrega em todo Brasil</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                <img
                  src={heroImage}
                  alt="Galeria com quadros personalizados"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">
              Explore nossa <span className="text-primary">coleção</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra estilos únicos ou faça upload da sua própria imagem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl shadow-soft group-hover:shadow-elegant transition-all duration-300">
                <img
                  src={abstractArt}
                  alt="Arte Abstrata"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-display text-xl font-semibold">Arte Abstrata</h3>
                  <p className="text-sm opacity-90">Formas e cores contemporâneas</p>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl shadow-soft group-hover:shadow-elegant transition-all duration-300">
                <img
                  src={landscapeArt}
                  alt="Paisagens"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-display text-xl font-semibold">Paisagens</h3>
                  <p className="text-sm opacity-90">Natureza e horizontes serenos</p>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl shadow-soft group-hover:shadow-elegant transition-all duration-300">
                <img
                  src={minimalArt}
                  alt="Minimalista"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-display text-xl font-semibold">Minimalista</h3>
                  <p className="text-sm opacity-90">Simplicidade e elegância</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/customizar">
              <Button className="btn-cta text-lg px-8 py-4">
                Ver toda a coleção
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">
              Como <span className="text-primary">funciona</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Três passos simples para criar seu quadro personalizado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="font-display text-xl font-semibold mb-4">Escolha sua arte</h3>
              <p className="text-muted-foreground">
                Faça upload da sua imagem ou escolha da nossa biblioteca curada de artes exclusivas
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="font-display text-xl font-semibold mb-4">Personalize em 3D</h3>
              <p className="text-muted-foreground">
                Configure moldura, passe-partout, tamanho e material com preview 3D em tempo real
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="font-display text-xl font-semibold mb-4">Receba em casa</h3>
              <p className="text-muted-foreground">
                Produzimos com materiais premium e enviamos com embalagem segura para todo o Brasil
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">
              O que nossos <span className="text-primary">clientes</span> dizem
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-soft">
              <div className="mb-6">
                <div className="flex text-primary text-xl">★★★★★</div>
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "O preview 3D me permitiu ver exatamente como ficaria na parede. 
                A qualidade da impressão e da moldura superou minhas expectativas!"
              </p>
              <div>
                <p className="font-semibold">Maria Silva</p>
                <p className="text-sm text-muted-foreground">Designer de Interiores</p>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-soft">
              <div className="mb-6">
                <div className="flex text-primary text-xl">★★★★★</div>
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "Processo super fácil e resultado profissional. 
                Agora todas as fotos da família viraram obras de arte em casa."
              </p>
              <div>
                <p className="font-semibold">João Santos</p>
                <p className="text-sm text-muted-foreground">Arquiteto</p>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-soft">
              <div className="mb-6">
                <div className="flex text-primary text-xl">★★★★★</div>
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "Atendimento excepcional e entrega rápida. 
                O material canvas ficou perfeito para o meu estúdio."
              </p>
              <div>
                <p className="font-semibold">Ana Costa</p>
                <p className="text-sm text-muted-foreground">Fotógrafa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
