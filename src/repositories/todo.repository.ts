import { inject } from '@loopback/core';
import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Todo, TodoRelations } from '../models';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {
  constructor(@inject('datasources.db') dataSource: juggler.DataSource) {
    super(Todo, dataSource);
  }
}
