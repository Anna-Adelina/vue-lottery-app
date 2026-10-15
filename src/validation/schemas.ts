import { object, string } from 'yup'

export const loginSchema = object({
  username: string().trim().required('Вкажіть username'),
  password: string().required('Вкажіть пароль').min(6, 'Пароль має містити щонайменше 6 символів'),
})