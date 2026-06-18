export type Lang = 'ru' | 'fr' | 'en';

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
];

export const loginText: Record<Lang, {
  subtitle: string;
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  signIn: string;
  signingIn: string;
  error: string;
  help: string;
  helpLink: string;
}> = {
  ru: {
    subtitle: 'CRM',
    title: 'Вход в систему',
    description: 'Введите данные вашего аккаунта',
    emailLabel: 'Email',
    emailPlaceholder: 'manager@blackborz.ru',
    passwordLabel: 'Пароль',
    signIn: 'Войти',
    signingIn: 'Вход...',
    error: 'Неверный email или пароль',
    help: 'Нет аккаунта или проблемы со входом?',
    helpLink: 'Напишите администратору',
  },
  fr: {
    subtitle: 'CRM',
    title: 'Connexion',
    description: 'Entrez les identifiants de votre compte',
    emailLabel: 'Email',
    emailPlaceholder: 'manager@blackborz.ru',
    passwordLabel: 'Mot de passe',
    signIn: 'Se connecter',
    signingIn: 'Connexion...',
    error: 'Email ou mot de passe incorrect',
    help: 'Pas de compte ou problème de connexion ?',
    helpLink: "Contactez l'administrateur",
  },
  en: {
    subtitle: 'CRM',
    title: 'Sign in',
    description: 'Enter your account credentials',
    emailLabel: 'Email',
    emailPlaceholder: 'manager@blackborz.ru',
    passwordLabel: 'Password',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    error: 'Invalid email or password',
    help: 'No account or trouble signing in?',
    helpLink: 'Contact the administrator',
  },
};
