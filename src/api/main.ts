import { cloneDeep } from 'lodash';

export type ApiHandler<TInput, TOutput> =
  (data: TInput) => Promise<TOutput>

export interface ApiMounter {
  mountHandler<TInput, TOutput>(
    endpoint: ApiEndpoint<TInput, TOutput>,
    handler: ApiHandler<TInput, TOutput>): void
}

export class ApiEndpoint<TInput, TOutput>{
  public path: string[] = [];
  public pathStr() { return '/' + this.path.join('/') }
}

function isEndpoint(element: object) {
  return element.hasOwnProperty('path');
}

export function setPaths<T>(space: T, path: string[] = [], clone: boolean = true) {
  if (!space) return space;

  let result = clone ? cloneDeep(space) : space;

  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const childPath = path.concat([key]);
      const element = result[key] as any;

      if (isEndpoint(element)) {
        element.path = childPath;
      } else {
        setPaths(element, childPath, false);
      }
    }
  }

  return result;
}

export function resolvePath(space: any, depth: number = 1): string[] {
  if (isEndpoint(space)) return space.path;

  for (const key in space) {
    if (space.hasOwnProperty(key)) {
      const element = space[key];
      if (isEndpoint(element)) {
        return element.path.slice(0, element.path.length - depth);
      } else {
        return resolvePath(element, depth + 1);
      }
    }
  }

  throw new Error('Could not resolve path.');
}
