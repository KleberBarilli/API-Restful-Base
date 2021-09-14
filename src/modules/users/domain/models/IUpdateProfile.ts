export interface IUpdateProfile {
	user_id: string;
	username: string;
	email: string;
	password?: string;
	old_password?: string;
}
