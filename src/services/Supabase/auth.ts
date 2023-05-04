import { supabase } from './client'

class AuthService {
  async createUser(email: string, password: string, first_name: string, last_name: string) {
    try {
      const { user, session, error } = await supabase.auth.signUp(
        {
          email: email,
          password: password,
        },
        {
          data: {
            first_name: first_name,
            last_name: last_name,
          },
        }
      )
      if (error) throw error
      return session
    } catch (e) {
      //TODO
    }
  }

  async login(email: string, password: string) {
    try {
      const { user, session, error } = await supabase.auth.signIn({
        email: email,
        password: password,
      })
      if (error?.message == 'Invalid login credentials') return 'Usuario y/o Contraseña invalidos.'
      if (!error) return session
      else throw error
    } catch (e) {
      //TODO
    }
  }
}

export default new AuthService()
