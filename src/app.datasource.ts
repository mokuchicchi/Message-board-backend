import { DataSource } from 'typeorm';
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres', // データベースの種別。今回はpostgresqlへの接続とします。
  host: 'dpg-d3b50tl6ubrc739f27o0-a',
  username: 'user',
  password: 'WFfy1P2QiZhkH174VscNAtvdqVkP8X7D',
  database: 'message_board_db_ez7u',
  entities: ['src/entities/*.ts'], //  エンティティファイル（後述）配列
  migrations: ['src/migrations/*.ts'], // マイグレーションファイル（後述）配列
});

export default AppDataSource;
