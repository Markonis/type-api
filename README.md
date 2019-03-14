# typeful-api

A set of framework agnostic Typescript abstractions for writing full stack type-safe APIs.

To get started, please check out a [minimal example repository](https://github.com/Markonis/cooking-recipes)
which implements both the server and the client for a complete reference on how this package can
be used. You can also checkout [this blog post](https://affine.tech/blog/full-stack-type-safe-apis)
for an introduction and the reasoning behind this package

## Abstract API Definition

The core class in this package is the `ApiEndpoint`. 
It is a generic class with 2 type arguments `TInput` and `TOutput`, 
which correspond to the types of parameters and the returned value.

Using this class you can define the structure of your API as in the example below:

```ts

import { ApiEndpoint, setPaths } from 'typeful-api'

interface Foo {
  id: string
  title: string
}

interface FindParams {
  id: string
}

const api = setPaths({
  recipe: {
    create: new ApiEndpoint<Foo, Foo>(),
    read: new ApiEndpoint<FindParams, Foo>(),
    update: new ApiEndpoint<Foo, Foo>(),
    destroy: new ApiEndpoint<FindParams, Foo>()
  }
});

```

This part of the code is meant to be shared between the client and the server,
so it's best to put it in a shared folder. Or you can also publish it
as a package and reuse across your frontend and backend code.

## Using With a Concrete Framework

This package only provides abstract data types which help you define the shared
structure of your api. An implementation is provided for the express framework
in the form of the [typeful-api-express](https://github.com/Markonis/typeful-api-express)
package.






