import express from "express"
const app = express()
app.get('/', (req, res) => {
  res.send('Hello World!')
})
export {app}
/*app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/