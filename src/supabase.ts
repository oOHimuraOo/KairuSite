import { createClient } from '@supabase/supabase-js';

// ============================================================
// LEITURA DAS VARIÁVEIS DE AMBIENTE
// ============================================================

// Usa VITE_ (para Vite) e fallback para process.env (para Node/outros)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)?.trim();
const siteAuthEmail = (import.meta.env.VITE_SUPABASE_AUTH_EMAIL || process.env.VITE_SUPABASE_AUTH_EMAIL)?.trim();
const siteAuthPassword = (import.meta.env.VITE_SUPABASE_AUTH_PASSWORD || process.env.VITE_SUPABASE_AUTH_PASSWORD)?.trim();

// ============================================================
// LOG DE DEPURAÇÃO (apenas em desenvolvimento)
// ============================================================

if (import.meta.env.DEV) {
  console.log('🔍 [Supabase] URL:', supabaseUrl);
  console.log('🔍 [Supabase] Anon Key:', supabaseAnonKey ? '✅ definida' : '❌ não definida');
  console.log('🔍 [Supabase] Auth Email:', siteAuthEmail ? '✅ definido' : '❌ não definido');
  console.log('🔍 [Supabase] Auth Password:', siteAuthPassword ? '✅ definido' : '❌ não definido');
}

// ============================================================
// INSTANCIAÇÃO DO CLIENTE SUPABASE
// ============================================================

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'NewsLetter',
      },
    })
  : null;

export const isSupabaseConfigured = isConfigured;

// ============================================================
// VALIDAÇÃO DE E-MAIL
// ============================================================

const isValidEmail = (value: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value);
};

// ============================================================
// TRATAMENTO DE ERROS AMIGÁVEL
// ============================================================

export const getFriendlySubscriptionError = (error: unknown) => {
  if (!error) {
    return 'Não foi possível concluir o cadastro no momento. Tente novamente mais tarde.';
  }

  const errorCode = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : '';

  const message = typeof error === 'object' && error !== null && 'message' in error
    ? String((error as { message?: unknown }).message || '').toLowerCase()
    : '';

  switch (errorCode) {
    case '23505':
      return 'Já possuímos seu e-mail em nosso sistema.';
    case '42501':
      return 'Não foi possível salvar o e-mail no momento. Verifique as permissões do servidor.';
    case 'PGRST116':
      return 'Não foi possível localizar os dados necessários para concluir o cadastro.';
    case 'PGRST106':
      return 'Não foi possível acessar a tabela solicitada no servidor.';
    case 'JWT_INVALID':
    case 'INVALID_CREDENTIALS':
      return 'Falha de autenticação com o servidor.';
    case 'NETWORK_ERROR':
    case 'TIMEOUT':
      return 'Falha de conexão com o servidor. Tente novamente mais tarde.';
    default:
      break;
  }

  if (
    message.includes('duplicate')
    || message.includes('already exists')
    || message.includes('unique')
  ) {
    return 'Já possuímos seu e-mail em nosso sistema.';
  }

  if (
    message.includes('auth')
    || message.includes('authentication')
    || message.includes('invalid login')
    || message.includes('jwt')
  ) {
    return 'Falha de autenticação com o servidor.';
  }

  if (message.includes('permission') || message.includes('policy') || message.includes('rls')) {
    return 'Não foi possível salvar o e-mail no momento. Verifique as permissões do servidor.';
  }

  if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
    return 'Falha de conexão com o servidor. Tente novamente mais tarde.';
  }

  if (message.includes('email')) {
    return 'E-mail não cadastrado. Falha ao processar a solicitação.';
  }

  return 'Não foi possível concluir o cadastro no momento. Tente novamente mais tarde.';
};

// ============================================================
// FUNÇÃO PARA INSERIR E-MAIL NA NEWSLETTER
// ============================================================

export const insertMailSubscription = async (email: string) => {
  if (!supabase) {
    throw new Error('Supabase não configurado.');
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
    throw new Error('E-mail inválido.');
  }

  if (!siteAuthEmail || !siteAuthPassword) {
    throw new Error('Falha de autenticação com o servidor.');
  }

  // Autentica com e-mail e senha do serviço (usuário de backend)
  const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
    email: siteAuthEmail,
    password: siteAuthPassword,
  });

  if (signInError) {
    throw new Error('Falha de autenticação com o servidor.');
  }

  if (!authData.session) {
    throw new Error('Falha de autenticação com o servidor.');
  }

  // Insere o e-mail na tabela 'Mails'
  const { error } = await supabase.from('Mails').insert([{ Mail: trimmedEmail }]);

  if (error) {
    throw new Error(getFriendlySubscriptionError(error));
  }

  return true;
};