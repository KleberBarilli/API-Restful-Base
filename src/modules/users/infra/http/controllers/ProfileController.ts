import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowProfileService from '../../../services/ShowProfileService';
import UpdateProfileService from '../../../services/UpdateProfileService';
import { classToClass } from 'class-transformer';

export default class ProfileController {
	public async show(req: Request, res: Response): Promise<Response> {
		const showProfile = container.resolve(ShowProfileService);
		const id = req.user.id;

		const user = await showProfile.execute({ id });

		return res.json(classToClass(user));
	}

	public async update(req: Request, res: Response): Promise<Response> {
		const user_id = req.user.id;
		const { username, email, password, old_password } = req.body;

		const updateProfile = container.resolve(UpdateProfileService);

		const user = await updateProfile.execute({
			user_id,
			username,
			email,
			password,
			old_password,
		});

		return res.json(classToClass(user));
	}
}
