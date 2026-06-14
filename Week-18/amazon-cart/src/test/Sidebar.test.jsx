import { render, screen } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { styles } from '../components/WishListStyles.module';

describe('Sidebar Component', () => {
  it('renders the sidebar with the correct content', () => {
    render(<Sidebar />);

    // Check if the sidebar is rendered
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveStyle(styles.sidebar);

    // Check if the sidebar item is rendered
    const sidebarItem = screen.getByText('Your Wish List').closest('div');
    expect(sidebarItem).toBeInTheDocument();
    expect(sidebarItem).toHaveStyle(styles.sidebarItem);

    // Check if the heading is rendered
    expect(screen.getByText('Your Wish List')).toBeInTheDocument();
    expect(screen.getByText('Your Wish List')).toHaveStyle({ fontWeight: 'bold' });

    // Check if the paragraph is rendered
    expect(screen.getByText('Default List')).toBeInTheDocument();
    expect(screen.getByText('Default List')).toHaveStyle({ fontSize: '14px', color: '#6b7280' });
  });
});
