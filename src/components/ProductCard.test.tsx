import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { Product, StoreSettings } from '../types/catalog';
import { initialStoreSettings } from '../data/initialData';

const mockProduct: Product = {
  id: 'prod-123',
  title: 'Camisa Lino Premium Elegante',
  description: 'Esta es una descripción larga y completa sin cortes para la vista de galería que incluye detalles sobre la tela de lino, botones de nácar y confección artesanal.',
  price: 45.0,
  originalPrice: 60.0,
  currency: '$',
  category: 'Ropa',
  brand: 'Chihuahua Luxury',
  sku: 'CHI-CAM-001',
  sizes: 'S, M, L, XL',
  image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop',
  inStock: true,
};

describe('ProductCard Gallery Layout', () => {
  it('renders gallery layout with full title, uncut description and REF code', () => {
    render(
      <ProductCard
        product={mockProduct}
        settings={initialStoreSettings}
        isCustomerMode={true}
        layout="gallery"
      />
    );

    expect(screen.getByText('Camisa Lino Premium Elegante')).toBeDefined();
    expect(screen.getByText(/Esta es una descripción larga y completa sin cortes/)).toBeDefined();
    expect(screen.getByText(/REF: CHI-CAM-001/)).toBeDefined();
    expect(screen.getByText(/Tallas disponibles: S, M, L, XL/)).toBeDefined();
    expect(screen.getByText('-25% OFF')).toBeDefined();
    expect(screen.getByText('Pedir Artículo')).toBeDefined();
  });

  it('renders list layout appropriately', () => {
    render(
      <ProductCard
        product={mockProduct}
        settings={initialStoreSettings}
        isCustomerMode={true}
        layout="list"
      />
    );

    expect(screen.getByText('Camisa Lino Premium Elegante')).toBeDefined();
    expect(screen.getByText('CHI-CAM-001')).toBeDefined();
    expect(screen.getByText('Pedir')).toBeDefined();
  });

  it('renders standard grid layout appropriately', () => {
    render(
      <ProductCard
        product={mockProduct}
        settings={initialStoreSettings}
        isCustomerMode={true}
        layout="grid-3"
      />
    );

    expect(screen.getByText('Camisa Lino Premium Elegante')).toBeDefined();
    expect(screen.getByText('CHI-CAM-001')).toBeDefined();
  });

  it('renders in dark mode without errors', () => {
    render(
      <ProductCard
        product={mockProduct}
        settings={{ ...initialStoreSettings, themeMode: 'dark' }}
        isCustomerMode={true}
        layout="gallery"
      />
    );

    expect(screen.getByText('Camisa Lino Premium Elegante')).toBeDefined();
    expect(screen.getByText('Pedir Artículo')).toBeDefined();
  });
});
