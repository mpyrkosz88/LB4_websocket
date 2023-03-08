import { repository } from '@loopback/repository';
import { Server } from 'socket.io';
import { del, get, getModelSchemaRef, param, patch, post, put, requestBody, } from '@loopback/rest';
import { Todo } from '../models';
import { TodoRepository } from '../repositories';
import { ws } from "../websocket/decorators/websocket.decorator";

export class TodoController {
    constructor(
        @repository(TodoRepository) protected todoRepository: TodoRepository,
    ) {
    }

    @post('/todos', {
        responses: {
            '200': {
                description: 'Todo model instance',
                content: { 'application/json': { schema: getModelSchemaRef(Todo) } },
            },
        },
    })
    async createTodo(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Todo, { title: 'NewTodo', exclude: ['id'] }),
                },
            },
        })
        todo: Omit<Todo, 'id'>,
    ): Promise<Todo> {
        return this.todoRepository.create(todo);
    }

    @get('/todos/{id}', {
        responses: {
            '200': {
                description: 'Todo model instance',
                content: { 'application/json': { schema: getModelSchemaRef(Todo) } },
            },
        },
    })
    async findTodoById(
        @param.path.number('id') id: number,
        @param.query.boolean('items') items?: boolean,
    ): Promise<Todo> {
        return this.todoRepository.findById(id);
    }

    @get('/todos', {
        responses: {
            '200': {
                description: 'Array of Todo model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: getModelSchemaRef(Todo) },
                    },
                },
            },
        },
    })
    async findTodos(
    ): Promise<Todo[]> {
        return this.todoRepository.find();
    }

    @put('/todos/{id}', {
        responses: {
            '204': {
                description: 'Todo PUT success',
            },
        },
    })
    async replaceTodo(
        @param.path.number('id') id: number,
        @requestBody() todo: Todo,
    ): Promise<void> {
        await this.todoRepository.replaceById(id, todo);
    }

    @patch('/todos/{id}', {
        responses: {
            '204': {
                description: 'Todo PATCH success',
            },
        },
    })
    async updateTodo(
        @param.path.number('id') id: number,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Todo, { partial: true }),
                },
            },
        })
        todo: Partial<Todo>,
    ): Promise<void> {
        await this.todoRepository.updateById(id, todo);
    }

    @del('/todos/{id}', {
        responses: {
            '204': {
                description: 'Todo DELETE success',
            },
        },
    })
    async deleteTodo(
        @param.path.number('id') id: number
    ): Promise<void> {
        await this.todoRepository.deleteById(id);
    }

    @post('/todos/room/example/emit')
    async exampleRoomEmmit(
        @ws.namespace('chatNsp') nsp: Server
    ): Promise<unknown> {
        nsp.to('some room').emit('some room event', `time: ${new Date().getTime()}`);
        console.log('exampleRoomEmmit');
        return 'room event emitted';
    }
}
