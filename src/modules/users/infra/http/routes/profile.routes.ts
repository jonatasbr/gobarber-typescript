import { Router } from 'express';
import { celebrate, Segments, Joi } from "celebrate";

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/', profileController.update);
profileRouter.get(
  '/me',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      confirmation_password: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  profileController.show
);

export default profileRouter;
