import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import path from 'path';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { ISendForgotPasswordEmail } from '../domain/models/ISendForgotPasswordEmail';
import EtherealMail from '@config/mail/EtherealMail';

@injectable()
export default class SendForgotPasswordEmailService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('UserTokensRepository')
		private userTokensRepository: IUserTokensRepository,
	) {}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async execute({ email }: ISendForgotPasswordEmail): Promise<void> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('User does not exists..');
		}

		const { token } = await this.userTokensRepository.generate(user.id);

		const forgotPasswordTemplate = path.resolve(
			__dirname,
			'..',
			'views',
			'forgot_password.hbs',
		);

		await EtherealMail.sendMail({
			to: {
				name: user.username,
				email: user.email,
			},
			subject: '[API BETS] Recuperação de SENHA',
			templateData: {
				file: forgotPasswordTemplate,
				variables: {
					name: user.username,
					link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
				},
			},
		});
	}
}
