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
  // registration
  registerTitle: string;
  registerDescription: string;
  registerCta: string;
  registering: string;
  toRegister: string;
  toRegisterLink: string;
  toLogin: string;
  toLoginLink: string;
  passwordHint: string;
  registerError: string;
  checkEmail: string;
  registeredSuccess: string;
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
    registerTitle: 'Регистрация',
    registerDescription: 'Создайте аккаунт для доступа к CRM',
    registerCta: 'Создать аккаунт',
    registering: 'Создание...',
    toRegister: 'Нет аккаунта?',
    toRegisterLink: 'Зарегистрироваться',
    toLogin: 'Уже есть аккаунт?',
    toLoginLink: 'Войти',
    passwordHint: 'Минимум 6 символов',
    registerError: 'Не удалось создать аккаунт',
    checkEmail: 'Проверьте почту — мы отправили ссылку для подтверждения.',
    registeredSuccess: 'Аккаунт создан! Теперь войдите.',
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
    registerTitle: 'Inscription',
    registerDescription: 'Créez un compte pour accéder au CRM',
    registerCta: 'Créer un compte',
    registering: 'Création...',
    toRegister: 'Pas de compte ?',
    toRegisterLink: "S'inscrire",
    toLogin: 'Vous avez déjà un compte ?',
    toLoginLink: 'Se connecter',
    passwordHint: 'Au moins 6 caractères',
    registerError: 'Impossible de créer le compte',
    checkEmail: 'Vérifiez votre email — nous avons envoyé un lien de confirmation.',
    registeredSuccess: 'Compte créé ! Connectez-vous maintenant.',
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
    registerTitle: 'Sign up',
    registerDescription: 'Create an account to access the CRM',
    registerCta: 'Create account',
    registering: 'Creating...',
    toRegister: "Don't have an account?",
    toRegisterLink: 'Sign up',
    toLogin: 'Already have an account?',
    toLoginLink: 'Sign in',
    passwordHint: 'At least 6 characters',
    registerError: 'Could not create account',
    checkEmail: 'Check your email — we sent a confirmation link.',
    registeredSuccess: 'Account created! Now sign in.',
  },
};
