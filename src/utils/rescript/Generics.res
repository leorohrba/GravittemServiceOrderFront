let hasSome = value => {
  let verifyUndefined = value => {
    switch value {
    | Some(_) => true
    | None => false
    }
  }

  switch Js.Nullable.toOption(value) {
  | Some(value) => verifyUndefined(value)
  | None => false
  }
}

let mapSomeHigherZero = list => {
  list->Belt.Array.some(item => item > 0)
}
