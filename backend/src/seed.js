require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Ingredient = require('./models/Ingredient');
const Dish = require('./models/Dish');
const Menu = require('./models/Menu');
const Store = require('./models/Store');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🌱 Clearing existing data...');
    await Ingredient.deleteMany({});
    await Dish.deleteMany({});
    await Menu.deleteMany({});
    await Store.deleteMany({});

    console.log('🌱 Seeding ingredients...');
    const ingredients = await Ingredient.insertMany([
      { name: 'Tofu', category: 'protein', isVegan: true },
      { name: 'Tempeh', category: 'protein', isVegan: true },
      { name: 'Chickpeas', category: 'legume', isVegan: true },
      { name: 'Lentils', category: 'legume', isVegan: true },
      { name: 'Quinoa', category: 'grain', isVegan: true },
      { name: 'Brown Rice', category: 'grain', isVegan: true },
      { name: 'Spinach', category: 'vegetable', isVegan: true },
      { name: 'Kale', category: 'vegetable', isVegan: true },
      { name: 'Tomatoes', category: 'vegetable', isVegan: true },
      { name: 'Avocado', category: 'fruit', isVegan: true },
      { name: 'Nutritional Yeast', category: 'other', isVegan: true },
      { name: 'Coconut Milk', category: 'dairy-alternative', isVegan: true },
      { name: 'Almond Milk', category: 'dairy-alternative', isVegan: true },
      { name: 'Olive Oil', category: 'oil', isVegan: true },
      { name: 'Garlic', category: 'vegetable', isVegan: true },
      { name: 'Onion', category: 'vegetable', isVegan: true },
      { name: 'Bell Peppers', category: 'vegetable', isVegan: true },
      { name: 'Mushrooms', category: 'vegetable', isVegan: true },
      { name: 'Cashews', category: 'nut', isVegan: true },
      { name: 'Almonds', category: 'nut', isVegan: true }
    ]);

    console.log('🌱 Seeding dishes...');
    const dishes = await Dish.insertMany([
      {
        name: 'Vegan Buddha Bowl',
        description: 'A nutritious bowl with quinoa, roasted vegetables, and tahini dressing',
        isVegan: true,
        ingredients: [
          { ingredient: ingredients[4]._id, name: 'Quinoa', quantity: '1 cup', isVegan: true },
          { ingredient: ingredients[6]._id, name: 'Spinach', quantity: '2 cups', isVegan: true },
          { ingredient: ingredients[9]._id, name: 'Avocado', quantity: '1 whole', isVegan: true },
          { ingredient: ingredients[2]._id, name: 'Chickpeas', quantity: '1 cup', isVegan: true }
        ],
        instructions: [
          'Cook quinoa according to package instructions',
          'Roast chickpeas with spices at 400°F for 20 minutes',
          'Arrange spinach, quinoa, chickpeas, and sliced avocado in a bowl',
          'Drizzle with tahini dressing'
        ],
        prepTime: 15,
        cookTime: 30,
        servings: 2,
        difficulty: 'easy',
        cuisine: 'International',
        tags: ['healthy', 'bowl', 'lunch', 'dinner'],
        source: 'manual'
      },
      {
        name: 'Tofu Scramble',
        description: 'A delicious vegan alternative to scrambled eggs',
        isVegan: true,
        ingredients: [
          { ingredient: ingredients[0]._id, name: 'Tofu', quantity: '400g', isVegan: true },
          { ingredient: ingredients[10]._id, name: 'Nutritional Yeast', quantity: '2 tbsp', isVegan: true },
          { ingredient: ingredients[14]._id, name: 'Garlic', quantity: '2 cloves', isVegan: true },
          { ingredient: ingredients[15]._id, name: 'Onion', quantity: '1 medium', isVegan: true }
        ],
        instructions: [
          'Crumble tofu into a pan',
          'Sauté onion and garlic until fragrant',
          'Add tofu and nutritional yeast',
          'Cook for 5-7 minutes, stirring occasionally',
          'Season with turmeric, salt, and pepper'
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 2,
        difficulty: 'easy',
        cuisine: 'American',
        tags: ['breakfast', 'protein', 'quick'],
        source: 'manual'
      },
      {
        name: 'Lentil Curry',
        description: 'Creamy and flavorful Indian-style lentil curry',
        isVegan: true,
        ingredients: [
          { ingredient: ingredients[3]._id, name: 'Lentils', quantity: '2 cups', isVegan: true },
          { ingredient: ingredients[11]._id, name: 'Coconut Milk', quantity: '1 can', isVegan: true },
          { ingredient: ingredients[8]._id, name: 'Tomatoes', quantity: '3 medium', isVegan: true },
          { ingredient: ingredients[15]._id, name: 'Onion', quantity: '1 large', isVegan: true }
        ],
        instructions: [
          'Sauté onions until golden',
          'Add spices (curry powder, cumin, turmeric)',
          'Add lentils, tomatoes, and coconut milk',
          'Simmer for 25-30 minutes until lentils are tender',
          'Serve with rice or naan'
        ],
        prepTime: 10,
        cookTime: 35,
        servings: 4,
        difficulty: 'medium',
        cuisine: 'Indian',
        tags: ['curry', 'dinner', 'comfort-food'],
        source: 'manual'
      },
      {
        name: 'Mushroom Risotto',
        description: 'Creamy vegan risotto with mixed mushrooms',
        isVegan: true,
        ingredients: [
          { ingredient: ingredients[17]._id, name: 'Mushrooms', quantity: '500g', isVegan: true },
          { ingredient: ingredients[5]._id, name: 'Brown Rice', quantity: '2 cups', isVegan: true },
          { ingredient: ingredients[10]._id, name: 'Nutritional Yeast', quantity: '3 tbsp', isVegan: true },
          { ingredient: ingredients[13]._id, name: 'Olive Oil', quantity: '3 tbsp', isVegan: true }
        ],
        instructions: [
          'Sauté mushrooms in olive oil until golden',
          'Add rice and toast for 2 minutes',
          'Gradually add vegetable broth, stirring constantly',
          'Cook until rice is creamy and tender (about 25 minutes)',
          'Stir in nutritional yeast and season to taste'
        ],
        prepTime: 10,
        cookTime: 35,
        servings: 4,
        difficulty: 'medium',
        cuisine: 'Italian',
        tags: ['risotto', 'dinner', 'comfort-food'],
        source: 'manual'
      }
    ]);

    console.log('🌱 Seeding menus...');
    await Menu.insertMany([
      {
        name: 'Healthy Vegan Week',
        description: 'A week of nutritious vegan meals',
        type: 'base',
        dishes: [
          { dish: dishes[0]._id, category: 'main' },
          { dish: dishes[1]._id, category: 'main' },
          { dish: dishes[2]._id, category: 'main' }
        ],
        isVegan: true,
        cuisine: 'International',
        occasion: 'lunch',
        tags: ['healthy', 'weekly-plan'],
        source: 'manual',
        isPublished: true
      },
      {
        name: 'Comfort Food Classics',
        description: 'Vegan versions of comfort food favorites',
        type: 'base',
        dishes: [
          { dish: dishes[2]._id, category: 'main' },
          { dish: dishes[3]._id, category: 'main' }
        ],
        isVegan: true,
        cuisine: 'International',
        occasion: 'dinner',
        tags: ['comfort-food', 'cozy'],
        source: 'manual',
        isPublished: true
      }
    ]);

    console.log('🌱 Seeding stores...');
    await Store.insertMany([
      {
        name: 'Whole Foods Market',
        type: 'organic-store',
        location: {
          type: 'Point',
          coordinates: [2.3522, 48.8566] // Paris coordinates
        },
        address: {
          street: '123 Rue de Rivoli',
          city: 'Paris',
          zipCode: '75001',
          country: 'France'
        },
        contact: {
          phone: '+33 1 23 45 67 89',
          website: 'https://wholefoodsmarket.com'
        },
        availableIngredients: ingredients.slice(0, 15).map(i => i._id),
        hasVeganSection: true,
        isVerified: true
      },
      {
        name: 'Bio c\' Bon',
        type: 'organic-store',
        location: {
          type: 'Point',
          coordinates: [2.3488, 48.8534]
        },
        address: {
          street: '45 Boulevard Saint-Germain',
          city: 'Paris',
          zipCode: '75005',
          country: 'France'
        },
        contact: {
          phone: '+33 1 98 76 54 32',
          website: 'https://biocbon.fr'
        },
        availableIngredients: ingredients.slice(0, 12).map(i => i._id),
        hasVeganSection: true,
        isVerified: true
      },
      {
        name: 'Naturalia',
        type: 'organic-store',
        location: {
          type: 'Point',
          coordinates: [2.3364, 48.8606]
        },
        address: {
          street: '78 Rue de la Pompe',
          city: 'Paris',
          zipCode: '75016',
          country: 'France'
        },
        contact: {
          phone: '+33 1 11 22 33 44',
          website: 'https://naturalia.fr'
        },
        availableIngredients: ingredients.slice(0, 18).map(i => i._id),
        hasVeganSection: true,
        isVerified: true
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`   - ${ingredients.length} ingredients`);
    console.log(`   - ${dishes.length} dishes`);
    console.log(`   - 2 menus`);
    console.log(`   - 3 stores`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
