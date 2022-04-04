import listen from 'infra/listen'
import server from 'infra/server'

listen(server)
  .then(async () => {
    console.log('here')
  })
  .catch((error) => {
    console.error('error', error)
  })
