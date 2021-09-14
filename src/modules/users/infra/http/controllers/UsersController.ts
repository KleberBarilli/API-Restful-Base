import { Request, Response } from 'express';
import ListUserService from '../../../services/ListUserService';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';
import CreateUserService from 'src/modules/users/services/CreateUserService';

export default class UsersController {
	public async index(req: Request, res: Response): Promise<Response> {
		const listUser = container.resolve(ListUserService);

		const users = await listUser.execute();
		console.log(req.user.id);

		return res.json(classToClass(users));
	}

	public async create(req: Request, res: Response): Promise<Response> {
		const { username, email, password } = req.body;

		const createUser = container.resolve(CreateUserService);

		const user = await createUser.execute({
			username,
			email,
			password,
		});

		return res.json(classToClass(user));
	}
}
