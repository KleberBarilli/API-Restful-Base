import { Request, Response } from 'express';
import CreateSessionsService from '../../../services/CreateSessionsService';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

export default class SessionsController {
	public async create(req: Request, res: Response): Promise<Response> {
		const { email, password } = req.body;

		const createSession = container.resolve(CreateSessionsService);

		const user = await createSession.execute({
			email,
			password,
		});

		return res.json(classToClass(user));
	}
}
