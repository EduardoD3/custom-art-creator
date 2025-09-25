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
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Pinterest
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Produtos</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/customizar" className="hover:text-primary transition-colors">Quadros Personalizados</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Coleções</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Molduras</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Materiais Premium</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Guia de Tamanhos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de Trocas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Norte Interiores. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}