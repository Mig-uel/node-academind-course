interface IUser {
  name: string
}

const users: Array<IUser> = [{ name: 'miguel' }, { name: '' }]

const myPromise = new Promise<IUser>((resolve, reject) => {
  2 == 2 ? resolve({ name: 'd' }) : reject('Error')
})
