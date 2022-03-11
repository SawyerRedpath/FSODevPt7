import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [countryName, setCountryName] = useState('')
  const [statusMessage, setStatusMessage] = useState('')


  useEffect(() => {
    if (countryName) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
          if (response.status === 200) {
            setCountry(response.data[0])
          }
        } catch (exception) {
          setCountry(null)
          setStatusMessage('not found...')
          setTimeout(() => {
            setStatusMessage('')
          }, 2000)
        }
      }
      fetchData()
    }
  }, [countryName])

  const set = name => setCountryName(name)

  return { country, set, statusMessage }
}

const Country = ({ country, statusMessage }) => {
  if (statusMessage) {
    return <div>{statusMessage}</div>
  }
  if (!country) {
    return null
  }

  return (
    <div>
      <h3>{country.name.common}</h3>
      <div>population {country.population}</div>
      <div>capital {country.capital}</div>
      <img src={country.flags.png} height='100' alt={`flag of ${country.name.common}`} />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
    country.set(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button type="submit">find</button>
      </form>

      <Country country={country.country} statusMessage={country.statusMessage} />
    </div>
  )
}

export default App
