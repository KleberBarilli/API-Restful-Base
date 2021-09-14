import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '../../../services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
	public async update(req: Request, res: Response): Promise<Response> {
		const updateAvatar = container.resolve(UpdateUserAvatarService);

		const user = await updateAvatar.execute({
			user_id: req.user.id,
			avatarFilename: req.file?.filename as string,
		});

		return res.json(classToClass(user));
	}
}
