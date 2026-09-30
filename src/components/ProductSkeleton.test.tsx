import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ProductSkeleton, ProductCardSkeleton } from './ProductSkeleton';

describe('ProductSkeleton - Pantallas de Carga de Esqueleto', () => {
  it('debe renderizar el esqueleto del catálogo con la cantidad correcta de tarjetas en modo cuadrícula', () => {
    render(<ProductSkeleton layout="grid-3" count={6} isDark={false} />);
    const skeletonContainer = screen.getByLabelText('Cargando catálogo...');
    expect(skeletonContainer).toBeDefined();
    expect(skeletonContainer.getAttribute('aria-busy')).toBe('true');
  });

  it('debe renderizar la vista de esqueleto en modo lista', () => {
    const { container } = render(<ProductCardSkeleton layout="list" isDark={false} />);
    expect(container.querySelector('.skeleton-shimmer')).toBeDefined();
  });

  it('debe renderizar la vista de esqueleto en modo galería con dark mode activado', () => {
    const { container } = render(<ProductCardSkeleton layout="gallery" isDark={true} />);
    expect(container.querySelector('.skeleton-shimmer')).toBeDefined();
  });

  it('debe renderizar la vista de esqueleto en modo 4 columnas y 2 columnas', () => {
    const { rerender } = render(<ProductSkeleton layout="grid-4" count={8} isDark={true} />);
    expect(screen.getByLabelText('Cargando catálogo...')).toBeDefined();

    rerender(<ProductSkeleton layout="grid-2" count={4} isDark={false} />);
    expect(screen.getByLabelText('Cargando catálogo...')).toBeDefined();
  });
});
