import {Category} from '../models/Category';

const DEFAULT_CATEGORIES = ['מוצרי ניקיון', 'גבינות', 'ירקות ופירות', 'בשר ודגים', 'מאפים'];

export const initializeCategories = async () => {
  try {
    const existingCategories = await Category.find();

    if (existingCategories.length === 0) {
      const categories = DEFAULT_CATEGORIES.map((name) => ({name}));
      await Category.insertMany(categories);
      console.log('Default categories created');
    } else {
      const existingNames = existingCategories.map((cat) => cat.name);
      const missingCategories = DEFAULT_CATEGORIES.filter((name) => !existingNames.includes(name));

      if (missingCategories.length > 0) {
        const categories = missingCategories.map((name) => ({name}));
        await Category.insertMany(categories);
        console.log(`Added missing categories: ${missingCategories.join(', ')}`);
      }
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
    throw error;
  }
};
