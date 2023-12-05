import { writable } from "svelte/store"
import { Token } from "../type"

const data = writable({
  token: null,
})

function setToken(token: Token) {
  // TODO:
  data.set({
    ...data,
    token,
  })

  // Do some other stuff
}

export default {
  data,
  setToken,
}
