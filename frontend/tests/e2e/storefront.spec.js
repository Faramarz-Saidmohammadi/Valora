import { test, expect } from '@playwright/test';

const products = [
  {
    _id: 'product-1',
    name: 'Atlas Backpack',
    image: '/images/backpack.jpg',
    brand: 'Valora Goods',
    category: 'Travel',
    description: 'A durable everyday backpack for work and travel.',
    reviews: [],
    rating: 4.5,
    numReviews: 8,
    price: 79.99,
    countInStock: 7,
  },
  {
    _id: 'product-2',
    name: 'Studio Headphones',
    image: '/images/headphones.jpg',
    brand: 'Soundline',
    category: 'Audio',
    description: 'Over-ear headphones for focused listening.',
    reviews: [],
    rating: 4.2,
    numReviews: 5,
    price: 129.99,
    countInStock: 0,
  },
];

async function mockCatalog(page) {
  await page.route('**/api/products**', async (route) => {
    const { pathname } = new URL(route.request().url());
    const body = pathname === '/api/products/product-1'
      ? products[0]
      : { products, page: 1, pages: 1 };

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

test('catalog filtering and cart flow remain functional', async ({ page }) => {
  await mockCatalog(page);
  await page.goto('/search/test');

  await expect(page.getByRole('heading', { name: 'Results for “test”' })).toBeVisible();
  await expect(page.getByText('2 shown')).toBeVisible();
  await expect(page.getByText('1 in stock')).toBeVisible();

  await page.getByRole('button', { name: 'Travel' }).click();
  await expect(page.getByText('Atlas Backpack')).toBeVisible();
  await expect(page.getByText('Studio Headphones')).toBeHidden();

  await page.getByRole('link', { name: 'View Product' }).click();
  await expect(page.getByRole('heading', { name: 'Atlas Backpack' })).toBeVisible();
  await expect(page.getByText('7 in stock')).toBeVisible();

  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByText('Atlas Backpack')).toBeVisible();
  await expect(page.getByRole('button', { name: /Open cart with 1 items/i })).toBeVisible();
});

test('mobile navigation exposes accessible state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');

  const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await menuButton.click();
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
});
