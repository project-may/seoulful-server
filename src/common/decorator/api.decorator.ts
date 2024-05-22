import { Delete, Get, HttpCode, Patch, Post, Put, HttpStatus, All, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport/dist'
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiCreatedResponse } from '@nestjs/swagger'

export type Map<T> = { [key: string]: T }
export type Optional<T> = T | null | undefined

interface IApiOptions {
  path: string | string[]
  description?: string
  auth?: boolean
}

interface IApiPropertyOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any
  description?: string
  nullable?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  example?: any
}

function combinePropertyDecorator(...decorators: PropertyDecorator[]): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, key: string) {
    let decorator: Optional<PropertyDecorator>
    while ((decorator = decorators.shift())) decorator(target, key)
  } as PropertyDecorator
}

function combineMethodDecorator(decorators: MethodDecorator[]): MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, key: string, descriptor: any) {
    let decorator: Optional<MethodDecorator>
    while ((decorator = decorators.shift())) decorator(target, key, descriptor)
  } as MethodDecorator
}

type ApiMethodType = (path?: string | string[]) => MethodDecorator

function getApiDecorator(
  apiMethodType: ApiMethodType,
  returnTypeFunc: (returns?: void) => any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: IApiOptions
): MethodDecorator {
  return combineMethodDecorator([
    ...(options.auth ? [ApiBearerAuth('access-token')] : []),
    apiMethodType(options.path),
    ApiOperation({
      summary: options.description,
      description: options.description
    }),
    ApiCreatedResponse({
      description: options.description,
      type: returnTypeFunc(),
      status: HttpStatus.OK
    }),
    options.auth === true ? UseGuards(AuthGuard()) : null,
    HttpCode(HttpStatus.OK)
  ])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GetApi = function (returnTypeFunc: (returns?: void) => any, options: IApiOptions): MethodDecorator {
  return getApiDecorator(Get, returnTypeFunc, options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PostApi = function (returnTypeFunc: (returns?: void) => any, options: IApiOptions): MethodDecorator {
  return getApiDecorator(Post, returnTypeFunc, options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PutApi = function (returnTypeFunc: (returns?: void) => any, options: IApiOptions): MethodDecorator {
  return getApiDecorator(Put, returnTypeFunc, options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PatchApi = function (returnTypeFunc: (returns?: void) => any, options: IApiOptions): MethodDecorator {
  return getApiDecorator(Patch, returnTypeFunc, options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DeleteApi = function (returnTypeFunc: (returns?: void) => any, options: IApiOptions): MethodDecorator {
  return getApiDecorator(Delete, returnTypeFunc, options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DuAllApi = function (returnTypeFunc: (returns?: void) => any, options: IApiOptions): MethodDecorator {
  return getApiDecorator(All, returnTypeFunc, options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getReturnTypeFunc = (returnType: any) => () => returnType

export const ApiField = function (options: IApiPropertyOptions): PropertyDecorator {
  return combinePropertyDecorator(
    ApiProperty({
      // type: options.type,
      description: options.description,
      required: !options.nullable,
      example: options.example
    })
  )
}

export const ApiNestedField = function (options: IApiPropertyOptions): PropertyDecorator {
  return combinePropertyDecorator(
    ApiProperty({
      type: options.type,
      description: options.description,
      required: options ? !options.nullable : undefined,
      example: options.example
    })
  )
}

export const RestApiField = function (options: IApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    description: options.description,
    required: !options.nullable,
    example: options.example
  })
}

export const ApiEnumField = function (options: IApiPropertyOptions): PropertyDecorator {
  return combinePropertyDecorator(
    ApiProperty({
      type: options.type,
      enum: options.type,
      enumName: TheEgoApiEnums.findName(options.type),
      description: options.description,
      required: options ? !options.nullable : undefined,
      example: options.example
    })
  )
}

export class TheEgoApiEnums {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static enums: Map<any> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static register(name: string, enumType: any): void {
    this.enums[name] = enumType
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static findEnum(name: string): any | undefined {
    return this.enums[name]
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static findName(enumType: any): string | undefined {
    return Object.keys(this.enums).find((name) => this.enums[name] == enumType)
  }
}
