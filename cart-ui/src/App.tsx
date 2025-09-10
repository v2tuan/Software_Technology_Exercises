// FixedApp.tsx - Clean and working test application
import React, { useState } from 'react';

// Import các components từ thư viện
import { Button } from './components/ui_v1/Button';
import { Input } from './components/ui_v1/Input';
import { Modal } from './components/ui_v1/Modal';
import { Card } from './components/ui_v1/Card';
import { CartProvider } from './components/cart/CartProvider';
import { CartDrawer } from './components/cart/CartDrawer';
import { CartButton } from './components/cart/CartButton';
import { CartItem } from './components/cart/CartItem';
import { CartSummary } from './components/cart/CartSummary';
import { useCart } from './hooks/useCart';
import './styles/index.css';

// Types
interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
}

// Demo products
const demoProducts: Product[] = [
  {
    id: '1',
    title: 'Wireless Headphones',
    price: 199,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: '2',
    title: 'Smart Watch',
    price: 299,
    description: 'Advanced smartwatch with health tracking',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: '3',
    title: 'Bluetooth Speaker',
    price: 89,
    description: 'Portable speaker with amazing sound quality',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: '4',
    title: 'Wireless Mouse',
    price: 49,
    description: 'Ergonomic wireless mouse for productivity',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop&crop=center'
  }
];

// Component Test Section
const ComponentShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testInput, setTestInput] = useState('');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Component Library Test</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Testing all UI components with modern design patterns and proper styling
        </p>
      </div>

      {/* Button Tests */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Button Components</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Button Variants
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="danger">Danger Button</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Button Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Button States
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button loading>Loading Button</Button>
              <Button disabled>Disabled Button</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Input Tests */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Input Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Basic Input"
            placeholder="Enter some text..."
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
          />
          
          <Input
            label="Email Input"
            type="email"
            placeholder="your@email.com"
            helper="We'll never share your email address"
          />
          
          <Input
            label="Password Input"
            type="password"
            placeholder="Enter your password"
          />
          
          <Input
            label="Input with Error"
            placeholder="This has an error"
            error="This field is required"
          />
          
          <Input
            label="Disabled Input"
            placeholder="This input is disabled"
            disabled
          />
        </div>
      </Card>

      {/* Card Tests */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Card Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="sm" shadow="sm" className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🚀</span>
            </div>
            <h3 className="font-semibold mb-2">Small Card</h3>
            <p className="text-sm text-muted-foreground">Compact design with small padding</p>
          </Card>
          
          <Card padding="md" shadow="md" className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⭐</span>
            </div>
            <h3 className="font-semibold mb-2">Medium Card</h3>
            <p className="text-sm text-muted-foreground">Standard design with medium padding</p>
          </Card>
          
          <Card padding="lg" shadow="lg" className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">💎</span>
            </div>
            <h3 className="font-semibold mb-2">Large Card</h3>
            <p className="text-sm text-muted-foreground">Spacious design with large padding</p>
          </Card>
        </div>
      </Card>

      {/* Modal Test */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Modal Component</h2>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Click the button below to test the modal component
          </p>
          
          <Button onClick={() => setIsModalOpen(true)}>
            Open Test Modal
          </Button>
        </div>
        
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Test Modal Dialog"
          size="md"
        >
          <div className="space-y-4">
            <p>This is a test modal to demonstrate the modal component functionality.</p>
            
            <Input
              label="Test Input in Modal"
              placeholder="Type something here..."
            />
            
            <div className="pt-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      </Card>
    </div>
  );
};

// Shopping Demo Section
const ShoppingDemo: React.FC = () => {
  const { add, items, count } = useCart();

  const handleAddToCart = (product: Product) => {
    add({
      ...product,
      qty: 1
    });
  };

  const handleQuickAdd = () => {
    // Add multiple random products
    const randomProducts = demoProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    randomProducts.forEach(product => {
      add({
        ...product,
        qty: Math.floor(Math.random() * 2) + 1
      });
    });
  };

  return (
    <div className="space-y-8">
      {/* Shopping Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Shopping Demo</h1>
          <p className="text-lg text-muted-foreground">
            Test cart functionality with sample products
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Cart Items</p>
            <p className="text-2xl font-bold">{count()}</p>
          </div>
          <CartButton />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-semibold mb-1">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">
              Test cart operations quickly
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleQuickAdd}>
              Add Random Items
            </Button>
            <CartButton variant="secondary" showCount={false}>
              Open Cart
            </CartButton>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {demoProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-200">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=300&h=300&fit=crop&crop=center`;
                }}
              />
            </div>
            
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg leading-tight">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ${product.price}
                </span>
                <Button onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Cart Preview */}
      {items.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Cart Preview</h3>
              <span className="text-muted-foreground">
                {count()} {count() === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div className="border-t pt-4">
              <CartSummary
                onCheckout={() => {
                  alert(`Checkout successful! ${count()} items purchased.`);
                }}
                checkoutText="Complete Purchase"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Main App
const FixedApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'components' | 'shopping'>('components');

  return (
    <CartProvider persistCart={false}>
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold">
                Component Library
              </h1>
              
              <nav className="hidden md:flex space-x-1">
                <Button
                  variant={currentTab === 'components' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentTab('components')}
                >
                  UI Components
                </Button>
                <Button
                  variant={currentTab === 'shopping' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentTab('shopping')}
                >
                  Shopping Demo
                </Button>
              </nav>
            </div>
            
            <CartButton />
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="md:hidden border-b bg-background">
          <div className="container mx-auto px-4 py-3 flex space-x-2">
            <Button
              variant={currentTab === 'components' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCurrentTab('components')}
              className="flex-1"
            >
              Components
            </Button>
            <Button
              variant={currentTab === 'shopping' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCurrentTab('shopping')}
              className="flex-1"
            >
              Shopping
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {currentTab === 'components' ? <ComponentShowcase /> : <ShoppingDemo />}
        </main>

        {/* Cart Drawer */}
        <CartDrawer
          onCheckout={() => {
            alert('Checkout completed successfully!');
          }}
          checkoutText="Complete Order"
        />
      </div>
    </CartProvider>
  );
};

export default FixedApp;