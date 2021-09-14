import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { compare, hash } from 'bcryptjs';
import { IUser } from '@modules/users/domain/models/IUser';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';

interface IRequest {
	user_id: string;
	username: string;
	email: string;
	password?: string;
	old_password?: string;
}

@injectable()
export default class UpdateProfileService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsersRepository,
	) {}
	async execute({
		user_id,
		username,
		email,
		password,
		old_password,
	}: IRequest): Promise<IUser> {
		const user = await this.usersRepository.findById(user_id);

		if (!user) {
			throw new AppError('User not found');
		}

		const userUpdateEmail = await this.usersRepository.findByEmail(email);

		if (userUpdateEmail && userUpdateEmail.id != user.id) {
			throw new AppError('There is already one user with this email');
		}

		if (password && !old_password) {
			throw new AppError('Old password is missing');
		}

		if (password && old_password) {
			const checkOldPassword = await compare(old_password, user.password);

			if (!checkOldPassword) {
				throw new AppError('Old password does not match');
			}
			user.password = await hash(password, 8);
		}

		user.username = username;
		user.email = email;

		await this.usersRepository.save(user);

		return user;
	}
}
