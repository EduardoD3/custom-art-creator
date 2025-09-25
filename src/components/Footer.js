import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-display text-2xl font-semibold text-foreground">
              Norte<span className="text-primary">Interiores</span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Transformamos suas memórias em obras de arte com molduras personalizadas 
              e tecnologia de preview 3D em tempo real.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Facebook
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Pinterest
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Produtos</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/customizar" className="hover:text-primary transition-colors">Quadros Personalizados</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Coleções</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Molduras</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Materiais Premium</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Guia de Tamanhos</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Política de Trocas</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Norte Interiores. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-primary transition-colors">Política de Privacidade</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}