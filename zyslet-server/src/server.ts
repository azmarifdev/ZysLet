import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
// import { errorlogger, logger } from './shared/logger';

process.on('uncaughtException', error => {
   console.log('uncaughtException error: ', error);
   // errorlogger.error(error);
   process.exit(1);
});

let server: Server;

async function connection() {
   try {
      await mongoose.connect(config.database_url as string);
      // logger.info('DB is connected succesfully ....!!');
      console.log('DB is connected succesfully ....!!');

      server = app.listen(Number(config.port), '0.0.0.0', () => {
         console.log(`Application is listening on 0.0.0.0:${config.port}`);
      });
   } catch (err) {
      console.error('Database connection error:', err);
      console.log('server errooooooooooorrrrr');
      // errorlogger.error(err);
   }

   process.on('unhandledRejection', error => {
      console.log('unhandledRejection error : ', error);
      if (server) {
         server.close(() => {
            process.exit(1);
         });
      } else {
         process.exit(1);
      }
   });
}
connection();

// process.on('SIGTERM', () => {
//    logger.info('SIGTERM is received');
//    if (server) {
//       server.close();
//    }
// });
