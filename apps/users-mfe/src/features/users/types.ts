export interface UserName {
  title: string
  first: string
  last: string
}

export interface UserLocation {
  city: string
  state: string
  country: string
}

export interface UserPicture {
  large: string
  medium: string
  thumbnail: string
}

export interface UserLogin {
  uuid: string
  username: string
}

export interface User {
  login: UserLogin
  name: UserName
  email: string
  phone: string
  location: UserLocation
  picture: UserPicture
  nat: string
  gender: string
  dob: { age: number; date: string }
}

export interface RandomUserResponse {
  results: User[]
  info: {
    seed: string
    results: number
    page: number
    version: string
  }
}
