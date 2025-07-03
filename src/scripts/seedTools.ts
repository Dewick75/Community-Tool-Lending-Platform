// Usage: MONGODB_URI="your-mongodb-uri" npx ts-node src/scripts/seedTools.ts
console.log('--- Tool Seeder Script Starting ---');

import connectMongoDB from '../lib/mongodb';
import Tool from '../models/tool';

console.log('MONGODB_URI:', process.env.MONGODB_URI ? '[set]' : '[NOT SET]');

async function seedTools() {
  try {
    await connectMongoDB();

    const tools = [
      {
        name: 'Electric Drill',
        description: 'Cordless electric drill, 18V, includes two batteries and charger. Lightly used, works perfectly.',
        category: 'Power Tools',
        condition: 'Good',
        location: { city: 'Colombo', area: 'Nugegoda', postalCode: '10250' },
        owner: { name: 'Alice Perera', email: 'alice@example.com', phone: '+94 77 123 4567' },
        tags: ['cordless', '18v', 'drill', 'battery'],
      },
      {
        name: 'Hand Saw',
        description: 'Sharp hand saw, suitable for woodwork. Comfortable grip.',
        category: 'Hand Tools',
        condition: 'Excellent',
        location: { city: 'Kandy', area: 'Peradeniya', postalCode: '20000' },
        owner: { name: 'Bandara Silva', email: 'bandara@example.com', phone: '+94 71 234 5678' },
        tags: ['woodwork', 'saw', 'hand tool'],
      },
      {
        name: 'Lawn Mower',
        description: 'Electric lawn mower, recently serviced. Cuts grass efficiently.',
        category: 'Garden Tools',
        condition: 'Good',
        location: { city: 'Galle', area: 'Unawatuna', postalCode: '80000' },
        owner: { name: 'Chathura Jayasuriya', email: 'chathura@example.com', phone: '+94 76 345 6789' },
        tags: ['lawn', 'mower', 'garden'],
      },
      {
        name: 'Socket Set',
        description: 'Complete socket set with ratchet and extension. Metric sizes.',
        category: 'Automotive',
        condition: 'Fair',
        location: { city: 'Negombo', area: 'Kochchikade', postalCode: '11540' },
        owner: { name: 'Dilani Fernando', email: 'dilani@example.com', phone: '+94 75 456 7890' },
        tags: ['socket', 'automotive', 'tools'],
      },
      {
        name: 'Pressure Washer',
        description: 'High-pressure washer for cleaning vehicles and driveways. Includes hose and attachments.',
        category: 'Cleaning',
        condition: 'Good',
        location: { city: 'Matara', area: 'Walgama', postalCode: '81000' },
        owner: { name: 'Eshan Karunaratne', email: 'eshan@example.com', phone: '+94 78 567 8901' },
        tags: ['pressure', 'washer', 'cleaning'],
      },
      {
        name: 'Blender',
        description: 'Kitchen blender, 1.5L, suitable for smoothies and sauces. Clean and fully functional.',
        category: 'Kitchen Appliances',
        condition: 'Excellent',
        location: { city: 'Jaffna', area: 'Nallur', postalCode: '40000' },
        owner: { name: 'Fathima Rasheed', email: 'fathima@example.com', phone: '+94 79 678 9012' },
        tags: ['kitchen', 'blender', 'appliance'],
      },
    ];

    await Tool.insertMany(tools);
    console.log('✅ Seeded 6 tools successfully!');
  } catch (error) {
    console.error('❌ Error seeding tools:', error);
    if (!process.env.MONGODB_URI) {
      console.error('❗ MONGODB_URI environment variable is not set. Please set it before running this script.');
    }
    process.exit(1);
  } finally {
    process.exit();
  }
}

seedTools();