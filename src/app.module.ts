import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_URL } from 'env';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';
import { PlaysModule } from './plays/plays.module';

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
    ChallengesModule,
    PlaysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
