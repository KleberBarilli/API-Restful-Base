import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { hash } from 'bcryptjs';

interface IUserRequest {
	token: string;
	password: string;
}

@injectable()
export default class ResetPasswordService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsersRepository,
		@inject('UserTokensRepository')
		private userTokensRepository: IUserTokensRepository,
	) {}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async execute({ token, password }: IUserRequest): Promise<void> {
		const userToken = await this.userTokensRepository.findByToken(token);

		if (!userToken) {
			throw new AppError('User Token does not exists..');
		}

		const user = await this.usersRepository.findById(userToken.user_id);

		if (!user) {
			throw new AppError('User does not exists..');
		}

		const tokenCreatedAt = userToken.created_at;
		const compareDate = addHours(tokenCreatedAt, 2);

		if (isAfter(Date.now(), compareDate)) {
			throw new AppError('Token expired.');
		}

		user.password = await hash(password, 8);

		await this.usersRepository.save(user);
	}
}
