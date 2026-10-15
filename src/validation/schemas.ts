import { number, object, string } from 'yup'

export const loginSchema = object({
  username: string().trim().required('Вкажіть username'),
  password: string().required('Вкажіть пароль').min(6, 'Пароль має містити щонайменше 6 символів'),
})

export const userSchema = object({
  firstName: string().trim().required('Вкажіть ім’я'),
  lastName: string().trim().required('Вкажіть прізвище'),
  email: string().trim().required('Вкажіть email').email('Невірний формат email'),
  username: string().trim().required('Вкажіть username'),
  password: string().required('Вкажіть пароль').min(6, 'Пароль має містити щонайменше 6 символів'),
  age: number()
    .typeError('Вік має бути числом')
    .required('Вкажіть вік')
    .integer('Вік має бути цілим числом')
    .min(0, 'Вік не може бути від’ємним')
    .max(120, 'Вкажіть реальний вік'),
  gender: string().required('Оберіть стать').oneOf(['male', 'female'], 'Оберіть male або female'),
  phone: string()
    .trim()
    .required('Вкажіть телефон')
    .matches(/^\+?[\d\s()-]{7,20}$/, 'Невірний формат телефону'),
})