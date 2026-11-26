import * as migration_20261126_050525_initial from './20261126_050525_initial';

export const migrations = [
  {
    up: migration_20261126_050525_initial.up,
    down: migration_20261126_050525_initial.down,
    name: '20261126_050525_initial'
  },
];
