export const generateSlug = (title: string) => {
   return title
      .toLowerCase()
      .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '') // Keep Bangla, English letters, numbers, and spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim(); // Remove trailing spaces
};
