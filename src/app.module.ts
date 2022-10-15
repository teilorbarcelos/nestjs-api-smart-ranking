import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_URL } from 'env';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    PlayersModule,
    MongooseModule.forRoot(DB_URL, {
      // useNewUrlParses: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    }),
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
