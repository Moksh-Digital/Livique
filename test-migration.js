#!/usr/bin/env node

/**
 * Product Migration Test Script
 * 
 * This script demonstrates how to:
 * 1. Clear old products
 * 2. Create new products with the new category structure
 * 3. Fetch products by category/subcategory
 * 
 * Usage: node test-migration.js
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Sample products to add with new category structure
const sampleProducts = [
  {
    name: 'Modern Wall Clock',
    description: 'Elegant black wall clock perfect for living rooms',
    price: 1299,
    category: 'Home Decor',
    subcategory: 'Wall Clock',
    image: 'https://example.com/wall-clock.jpg',
    quantity: 50
  },
  {
    name: 'Diamond Stud Earrings',
    description: 'Beautiful diamond studded earrings for special occasions',
    price: 4999,
    category: 'Jewelry',
    subcategory: 'Earrings',
    image: 'https://example.com/earrings.jpg',
    quantity: 30
  },
  {
    name: 'Teddy Bear Plush Toy',
    description: 'Soft and cuddly teddy bear for kids',
    price: 599,
    category: 'Toys',
    subcategory: 'Teddy Bear',
    image: 'https://example.com/teddy.jpg',
    quantity: 100
  },
  {
    name: 'Leather Handbag',
    description: 'Premium leather handbag with adjustable straps',
    price: 2999,
    category: 'Bags & Wallets',
    subcategory: 'Handbags',
    image: 'https://example.com/handbag.jpg',
    quantity: 40
  },
  {
    name: 'Oversized Sunglasses',
    description: 'Trendy oversized sunglasses for summer',
    price: 1899,
    category: 'Sunglasses & Eyewear',
    subcategory: 'Oversized Sunglasses',
    image: 'https://example.com/sunglasses.jpg',
    quantity: 60
  }
];

async function makeRequest(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      console.error(`❌ Error (${response.status}):`, result);
      return null;
    }

    return result;
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('\n🔧 Product Migration Test Suite\n');
  console.log('================================\n');

  // Test 1: Get current product count
  console.log('📊 Test 1: Getting current products...');
  const currentProducts = await makeRequest('GET', '/products');
  if (currentProducts) {
    console.log(`✅ Found ${currentProducts.length || 0} existing products\n`);
  }

  // Test 2: Clear all products
  console.log('🗑️  Test 2: Clearing all products...');
  const clearResult = await makeRequest('DELETE', '/products/admin/clear-all');
  if (clearResult) {
    console.log(`✅ Deleted ${clearResult.deletedCount} products\n`);
  }

  // Test 3: Create new products
  console.log('➕ Test 3: Creating sample products...');
  for (const product of sampleProducts) {
    const result = await makeRequest('POST', '/products', product);
    if (result) {
      console.log(`✅ Created: ${product.name}`);
    }
  }
  console.log('');

  // Test 4: Fetch products by category
  console.log('🔍 Test 4: Testing category filters...');
  
  const categories = [
    { slug: 'jewelry', name: 'Jewelry' },
    { slug: 'home-decor', name: 'Home Decor' },
    { slug: 'toys', name: 'Toys' }
  ];

  for (const cat of categories) {
    const products = await makeRequest('GET', `/products?category=${cat.slug}`);
    if (products) {
      console.log(`✅ ${cat.name}: ${products.length} product(s)`);
    }
  }
  console.log('');

  // Test 5: Fetch by subcategory
  console.log('🔍 Test 5: Testing subcategory filters...');
  const subcategoryTests = [
    { category: 'jewelry', subcategory: 'earrings' },
    { category: 'home-decor', subcategory: 'wall-clock' },
    { category: 'toys', subcategory: 'teddy-bear' }
  ];

  for (const test of subcategoryTests) {
    const products = await makeRequest(
      'GET', 
      `/products?category=${test.category}&subcategory=${test.subcategory}`
    );
    if (products) {
      console.log(`✅ ${test.category}/${test.subcategory}: ${products.length} product(s)`);
    }
  }
  console.log('');

  console.log('================================');
  console.log('✅ All tests completed!\n');
  console.log('Next steps:');
  console.log('1. Visit Admin panel to add more products');
  console.log('2. Test category filtering on frontend');
  console.log('3. Verify products appear on product pages');
  console.log('4. Test search functionality\n');
}

// Run tests
runTests().catch(console.error);
