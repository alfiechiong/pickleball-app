import Joi from 'joi';

export const createGameSchema = Joi.object({
  location: Joi.string().required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  start_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  end_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  max_players: Joi.number().integer().min(2).max(8).default(4),
  skill_level: Joi.string()
    .valid('beginner', 'intermediate', 'advanced', 'pro')
    .default('intermediate'),
  notes: Joi.string().allow('', null),
}).custom((value, helpers) => {
  const startTime = new Date(`1970-01-01T${value.start_time}`);
  const endTime = new Date(`1970-01-01T${value.end_time}`);

  if (endTime <= startTime) {
    return helpers.error('any.invalid', { message: 'End time must be after start time' });
  }

  const gameDate = new Date(value.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (gameDate < today) {
    return helpers.error('any.invalid', { message: 'Game date cannot be in the past' });
  }

  return value;
});
