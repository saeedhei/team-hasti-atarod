TypeScript
There is a full TypeScript definition included in the the nano package. Your TypeScript editor will show you hints as you write your code with the nano library with your own custom classes:

```
import * as Nano  from 'nano'

let n = Nano('http://USERNAME:PASSWORD@127.0.0.1:5984')
let db = n.db.use('people')

interface iPerson extends Nano.MaybeDocument {
  name: string,
  dob: string
}

class Person implements iPerson {
  _id: string
  _rev: string
  name: string
  dob: string

  constructor(name: string, dob: string) {
    this._id = undefined
    this._rev = undefined
    this.name = name
    this.dob = dob
  }

  processAPIResponse(response: Nano.DocumentInsertResponse) {
    if (response.ok === true) {
      this._id = response.id
      this._rev = response.rev
    }
  }
}

let p = new Person('Bob', '2015-02-04')
db.insert(p).then((response) => {
  p.processAPIResponse(response)
  console.log(p)
})
```
