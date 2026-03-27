import multer from 'multer';

// Multer setup for handling file uploads
export const upload = multer({
   storage: multer.memoryStorage(), // Store files in memory
});
