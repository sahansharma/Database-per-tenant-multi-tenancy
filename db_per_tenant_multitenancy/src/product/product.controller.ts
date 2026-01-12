import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products for the tenant' })
  @ApiHeader({ name: 'x-tenant-id', description: 'Tenant identifier' })
  @ApiResponse({ status: 200, description: 'List of products' })
  findAll() {
    return this.productService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product for the tenant' })
  @ApiHeader({ name: 'x-tenant-id', description: 'Tenant identifier' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  create(@Body() body: { name: string; description?: string; price: number }) {
    return this.productService.create(body);
  }
}