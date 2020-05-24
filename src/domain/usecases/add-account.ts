import { AccountModel } from '../models/accout'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

// AddAccountModel é especifico daqui dentro/ cria aqui mesmo
export interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel> // Este é o BD mesmo por exemplo
}
