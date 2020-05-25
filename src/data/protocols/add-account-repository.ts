import { AddAccountModel } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models/accout'

export interface AddAccountRepository{
  add (accountData: AddAccountModel): Promise<AccountModel>
}
