import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BottonNavBar } from './BottonNavBar';

test('renderiza el botón con el texto correcto', () => {
  render(<BottonNavBar items={[{ label: 'Guardar', href: '', action: '', subject: '' }]} />);
  expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
});