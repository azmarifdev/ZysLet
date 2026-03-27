import mongoose from 'mongoose';
import { User } from './app/modules/user/user.model'; // Ensure this is exporting a Mongoose model
import config from './config';

async function seed() {
   try {
      const seedEmail = process.env.ADMIN_SEED_EMAIL || 'zyslet@gmail.com';
      const seedPassword = process.env.ADMIN_SEED_PASSWORD || '@zyslet1234';

      // Connect to MongoDB
      await mongoose.connect(config.database_url as string);
      console.log('Connected to MongoDB.');

      // If admin exists with this email, reset password.
      // If no admin exists, create one.
      const existingUser = await User.findOne({ email: seedEmail }).select(
         '+password'
      );

      if (existingUser) {
         existingUser.name = 'Admin';
         existingUser.role = 'admin';
         existingUser.password = seedPassword; // pre-save hook will hash
         await existingUser.save();
         console.log(`Admin user updated successfully: ${seedEmail}`);
         return;
      }

      // Create admin user
      const adminUser = new User({
         name: 'Admin',
         email: seedEmail,
         password: seedPassword, // Plain text password - model will hash it
         role: 'admin',
      });

      await adminUser.save();
      console.log(`Admin user created successfully: ${seedEmail}`);
   } catch (error) {
      console.error('Error seeding admin user:', error);
   } finally {
      await mongoose.disconnect();
   }
}

seed()
   .then(() => {
      console.log('Seeding completed.');
      process.exit(0);
   })
   .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
   });

export default seed;
