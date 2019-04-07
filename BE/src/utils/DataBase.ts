import { request } from 'graphql-request';
import * as fs from 'fs';
import * as path from 'path';

const queryCache: any = {};
const endpoint = `http://${process.env.SMORODINA_MOD_EPD_PRISMA_HOST}:${process.env.SMORODINA_MOD_EPD_PRISMA_PORT}`;
/**
 * Выполнение GraphQL квери
 */
export default async (queryName: string, variables?: any) => {
    try {
        let query = queryCache[queryName];

        if (!query) {
            query = fs.readFileSync(path.resolve(__dirname, '..', '..', 'queries', `${queryName}.gql`), 'utf8');
            queryCache[queryName] = query;
        }
        let result = await request(endpoint, query, variables) as Array<any>;
        if (Object.keys(result).length === 1) {
            return result[Object.keys(result)[0]];
        }
        return result;
    } catch (error) {
        throw (error);
    }
}