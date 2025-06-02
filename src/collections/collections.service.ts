import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from "../database/database.service";

@Injectable()
export class CollectionsService {
	constructor(private readonly db: DatabaseService) {
	}

	async findAll() {
		return this.db.collection.findMany({
			include: {
				products: true,
			}
		});
	}

	async getMaleCollection() {
		return this.db.product.findMany({
			where: {
				sex: "MALE"
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				collection: true
			},
			take: 6,
		})
	}

	async getFemaleCollection() {
		return this.db.product.findMany({
			where: {
				sex: "FEMALE"
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				collection: true
			},
			take: 6,
		})
	}

	async getNewest() {
		return this.db.product.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				collection: true
			},
			take: 6,
		})
	}

	async findOne(id: string) {
		const collection = this.db.collection.findUnique({
			where: { id }, include: {
				products: true
			}
		});

		if (!collection) {
			throw new NotFoundException(`No collection with id ${id}`);
		}

		return collection;
	}
}
