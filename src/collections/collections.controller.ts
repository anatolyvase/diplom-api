import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get('/female')
  getFemaleCollection() {
    return this.collectionsService.getFemaleCollection();
  }

  @Get('/male')
  getMaleCollection() {
    return this.collectionsService.getMaleCollection();
  }

  @Get('/new')
  getNewestProducts() {
    return this.collectionsService.getNewest();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.collectionsService.findOne(id);
  }
}
