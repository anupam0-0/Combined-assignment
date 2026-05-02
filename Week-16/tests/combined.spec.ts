import { fullProduct } from '../src/medium/combined';

describe('FullProduct Type', () => {
  it('should have name, price, and downloadLink properties', () => {
    expect(fullProduct).toHaveProperty('name', 'E-book');
    expect(fullProduct).toHaveProperty('price', 10);
    expect(fullProduct).toHaveProperty('downloadLink', 'https://example.com/ebook');
  });

  it('should have the correct types for properties', () => {
    expect(typeof fullProduct.name).toBe('string');
    expect(typeof fullProduct.price).toBe('number');
    expect(typeof fullProduct.downloadLink).toBe('string');
  });
});
