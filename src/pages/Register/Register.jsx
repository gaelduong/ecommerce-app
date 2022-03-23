import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CryptoJS from 'crypto-js'
import { Link, useNavigate } from 'react-router-dom'
import { generateUniqueId } from 'utils/commonUtils'
import { DUMMY_HASH_SECRET_KEY } from 'constants'
import { PATH } from 'constants'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { currentUser } = useSelector(state => state.currentUser)

  useEffect(() => {
    if (currentUser) navigate(PATH.HOME)
  }, [currentUser, navigate])

  const registerUser = async e => {
    e.preventDefault()
    setError('')

    if (password !== confirmedPassword)
      return setError('Passwords do not match')

    const existingUsers = JSON.parse(localStorage.getItem('users')) || []

    if (existingUsers.find(user => user.email === email))
      return setError('User already exists')

    const dummyHash = CryptoJS.AES.encrypt(
      password,
      DUMMY_HASH_SECRET_KEY
    ).toString()

    existingUsers.push({
      id: `u-${generateUniqueId()}`,
      name,
      email,
      password: dummyHash,
      is_admin: false,
      delivery_address: '',
      phone_number: '',
      profile_pic: 'https://picsum.photos/id/1074/50/50',
      created_date_time: new Date()
    })

    localStorage.setItem('users', JSON.stringify(existingUsers))

    navigate(PATH.LOGIN)
  }

  if (currentUser) return ''

  return (
    <>
      <form onSubmit={registerUser}>
        <div>
          <label>
            Name:{' '}
            <input
              type="text"
              onChange={e => setName(e.target.value)}
              value={name}
              placeholder="What's your name?"
              required
            />
          </label>
        </div>
        <br />
        <div>
          <label>
            Email:{' '}
            <input
              type="email"
              onChange={e => setEmail(e.target.value)}
              value={email}
              placeholder="What's your email?"
              required
            />
          </label>
        </div>
        <br />
        <div>
          <label>
            Password:{' '}
            <input
              type="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
              placeholder="What's your password?"
              // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
              // title="Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
              required
            />
          </label>
        </div>
        <br />
        <div>
          <label>
            Confirm Password:{' '}
            <input
              type="password"
              onChange={e => setConfirmedPassword(e.target.value)}
              value={confirmedPassword}
              placeholder="Re-type your password"
              required
            />
          </label>
        </div>
        <br />
        <p style={{ color: 'red' }}>{error}</p>
        <button onSubmit={registerUser}>Sign up</button>
      </form>
      <Link to={PATH.LOGIN}> Login </Link>
    </>
  )
}

export default Register
