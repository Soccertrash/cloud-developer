import 'source-map-support/register'
import * as uuid from 'uuid'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {CreateTodoRequest} from '../../requests/CreateTodoRequest'
import {TodoAccess} from "../../datalayer/todoAccess";
import {createLogger} from "../../utils/logger";
import {TodoItem} from "../../models/TodoItem";
import { getUserId } from '../utils';

const todoAccess = new TodoAccess();
const logger = createLogger('createTodo');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.debug('Process createTodo', event);

    const newTodo: CreateTodoRequest = JSON.parse(event.body)


    const todoId = uuid.v4()
    const userId = getUserId(event);


    const todoItem: TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: newTodo.name,
        dueDate: newTodo.dueDate,
        done: false

    }

    const item = await todoAccess.createTodo(todoItem);

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item
        })
    }
}
