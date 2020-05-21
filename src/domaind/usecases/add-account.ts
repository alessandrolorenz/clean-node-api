import { AccountModel } from '../models/accout'

export interface AddAccountModel {
  name: String
  email: String
  password: String
}

// AddAccountModel é especifico daqui dentro/ cria aqui mesmo
export interface AddAccount {
  add(email: AddAccountModel): AccountModel // Este é o BD mesmo por exemplo
}
