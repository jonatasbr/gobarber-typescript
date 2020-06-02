import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;


describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeUserTokenRepository, fakeMailProvider);
  });

  it('should be able to recovery the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'john.doe@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recovery a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'john.doe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'john.doe@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
