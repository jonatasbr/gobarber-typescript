// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(
      fakeUsersRepository,
    );
  });

  it('should be able to show profile ', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('john.doe@example.com');
  });

  it('should not be able to show to user not found', async () => {
    await expect(
      showProfile.execute({
        user_id: 'user-not-found',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
