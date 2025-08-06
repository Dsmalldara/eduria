/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback } from "react"

export function useActionState(action:any, initialState:any) {
  const [state, setState] = useState(initialState)
  const [pending, setPending] = useState(false)

  const dispatch = useCallback(
    async (payload:any) => {
      setPending(true)
      try {
        const result = await action(state, payload)
        setState(result)
        return result
      } finally {
        setPending(false)
      }
    },
    [action, state],
  )

  return [state, dispatch, pending]
}
